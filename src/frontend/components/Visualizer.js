import { useState, useEffect, useRef } from '@wordpress/element';

/**
 * Visualizer Component
 *
 * Supports two modes:
 * 1. SVG scenes: fetches the SVG inline, finds <path class="wall"> elements,
 *    and fills them with the selected paint color using multiply blend mode.
 * 2. PNG/JPG scenes: falls back to a full-image color overlay div (legacy).
 */
const Visualizer = ({ imageUrl, selectedColor }) => {
    const [svgContent, setSvgContent] = useState(null);
    const [isSvg, setIsSvg] = useState(false);
    const svgRef = useRef(null);

    // Detect SVG and fetch inline
    useEffect(() => {
        if (!imageUrl) {
            setSvgContent(null);
            setIsSvg(false);
            return;
        }

        const isSvgFile = imageUrl.toLowerCase().includes('.svg');
        setIsSvg(isSvgFile);

        if (isSvgFile) {
            fetch(imageUrl)
                .then(res => res.text())
                .then(text => {
                    setSvgContent(text);
                })
                .catch(() => {
                    // Fallback to img tag if fetch fails
                    setSvgContent(null);
                    setIsSvg(false);
                });
        } else {
            setSvgContent(null);
        }
    }, [imageUrl]);

    // Apply paint color to SVG wall paths
    useEffect(() => {
        if (!svgRef.current || !isSvg) return;

        const wallPaths = svgRef.current.querySelectorAll('.wall, [data-wall]');
        wallPaths.forEach(path => {
            if (selectedColor && selectedColor.hex_value) {
                path.style.fill = selectedColor.hex_value;
                path.style.fillOpacity = '0.65';
                path.style.mixBlendMode = 'multiply';
            } else {
                // No color selected — show wall paths as transparent
                path.style.fill = 'transparent';
                path.style.fillOpacity = '0';
            }
        });
    }, [selectedColor, svgContent, isSvg]);

    if (!imageUrl) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', background: '#eee', borderRadius: '8px' }}>
                <p>No scene image available.</p>
            </div>
        );
    }

    return (
        <div className="ps-visualizer">
            <div className="ps-visualizer-container">
                {isSvg && svgContent ? (
                    // SVG MODE: inline SVG with wall path coloring
                    <div
                        ref={svgRef}
                        className="ps-visualizer-svg"
                        style={{
                            position: 'absolute',
                            top: 0, left: 0,
                            width: '100%', height: '100%',
                        }}
                        dangerouslySetInnerHTML={{ __html: svgContent }}
                    />
                ) : (
                    // PNG/JPG MODE: image + full overlay (legacy fallback)
                    <>
                        <img
                            src={imageUrl}
                            alt="Room Scene"
                            style={{
                                position: 'absolute',
                                top: 0, left: 0,
                                width: '100%', height: '100%',
                                objectFit: 'contain',
                                zIndex: 1
                            }}
                        />
                        {selectedColor && (
                            <div
                                className="ps-color-overlay"
                                style={{
                                    position: 'absolute',
                                    top: 0, left: 0,
                                    width: '100%', height: '100%',
                                    backgroundColor: selectedColor.hex_value,
                                    mixBlendMode: 'multiply',
                                    opacity: 0.6,
                                    zIndex: 2
                                }}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Visualizer;
