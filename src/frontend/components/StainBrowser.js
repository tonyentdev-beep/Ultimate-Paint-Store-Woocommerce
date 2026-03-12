import { useState, useMemo } from '@wordpress/element';

const StainBrowser = ({ psProducts, selectedStain, onStainSelect }) => {
    // Extract unique stains from physical products
    const uniqueStains = useMemo(() => {
        if (!psProducts || !Array.isArray(psProducts)) return [];
        
        const stainMap = new Map();
        
        psProducts.forEach(product => {
            // Only consider products that have a stain color name
            if (product.color_name && product.color_name.trim() !== '') {
                const normalizedName = product.color_name.trim();
                
                // Keep the first product we find for each color name to represent the visual
                if (!stainMap.has(normalizedName)) {
                    stainMap.set(normalizedName, {
                        name: normalizedName,
                        hex_value: 'STAIN', // Mock hex to satisfy downstream visualizer logic if needed
                        image_url: product.stain_image_url || '',
                        color_code: 'Stain', // Mock code
                        description: 'Wood Stain'
                    });
                }
            }
        });

        // Convert Map to Array and sort alphabetically
        return Array.from(stainMap.values()).sort((a, b) => a.name.localeCompare(b.name));
    }, [psProducts]);

    if (uniqueStains.length === 0) {
        return (
            <div style={{ padding: '20px', background: '#f9f9f9', borderRadius: '8px', border: '1px solid #eee' }}>
                <p style={{ margin: 0, color: '#666', fontStyle: 'italic' }}>No stain colors available for this product.</p>
            </div>
        );
    }

    return (
        <div className="ps-stain-browser" style={{ 
            background: '#fff', 
            borderRadius: '12px', 
            border: '1px solid #eee', 
            overflow: 'hidden',
            boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
        }}>
            {/* Header Area */}
            <div style={{ padding: '20px', borderBottom: '1px solid #eee', background: '#fafbfc' }}>
                <h2 style={{ margin: '0 0 10px 0', fontSize: '20px', color: '#111' }}>Select a Stain Color</h2>
                
                {selectedStain ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ 
                            width: '40px', 
                            height: '40px', 
                            borderRadius: '8px', 
                            overflow: 'hidden',
                            border: '1px solid #ccc',
                            flexShrink: 0
                        }}>
                            {selectedStain.image_url ? (
                                <img 
                                    src={selectedStain.image_url} 
                                    alt={selectedStain.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <div style={{ width: '100%', height: '100%', background: '#deb887' }} />
                            )}
                        </div>
                        <div>
                            <div style={{ fontWeight: '600', fontSize: '16px', color: '#111' }}>{selectedStain.name}</div>
                            <div style={{ fontSize: '13px', color: '#666' }}>Wood Stain Finish</div>
                        </div>
                    </div>
                ) : (
                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Please choose a stain finish from the options below.</p>
                )}
            </div>

            {/* Stain Grid */}
            <div style={{ padding: '20px' }}>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(8, minmax(0, 1fr))', 
                    gap: '10px' 
                }}>
                    {uniqueStains.map((stain) => {
                        const isSelected = selectedStain && selectedStain.name === stain.name;
                        
                        return (
                            <div 
                                key={stain.name}
                                onClick={() => onStainSelect(stain)}
                                style={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '6px',
                                    transition: 'all 0.2s',
                                    transform: isSelected ? 'scale(1.02)' : 'scale(1)'
                                }}
                            >
                                <div style={{
                                    width: '100%',
                                    aspectRatio: '1/1',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    border: isSelected ? '3px solid #00598e' : '2px solid transparent',
                                    boxShadow: isSelected ? '0 4px 12px rgba(0,89,142,0.3)' : '0 2px 5px rgba(0,0,0,0.1)',
                                    transition: 'all 0.2s',
                                    padding: '3px', /* Space between image and selection border */
                                    boxSizing: 'border-box'
                                }}>
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        backgroundColor: '#deb887' // Wood fallback color
                                    }}>
                                        {stain.image_url && (
                                            <img 
                                                src={stain.image_url} 
                                                alt={stain.name}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                                loading="lazy"
                                            />
                                        )}
                                    </div>
                                </div>
                                
                                <span style={{
                                    fontSize: '11px',
                                    fontWeight: isSelected ? '600' : '500',
                                    color: isSelected ? '#00598e' : '#444',
                                    textAlign: 'center',
                                    lineHeight: '1.2',
                                    wordWrap: 'break-word',
                                    width: '100%'
                                }}>
                                    {stain.name}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default StainBrowser;
