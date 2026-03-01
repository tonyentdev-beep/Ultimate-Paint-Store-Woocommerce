const Visualizer = ({ imageUrl, selectedColor }) => {
    return (
        <div className="ps-visualizer">
            {imageUrl ? (
                <div className="ps-visualizer-container" style={{ position: 'relative', width: '100%', paddingTop: '75%', backgroundColor: '#eee', overflow: 'hidden', borderRadius: '8px' }}>
                    {/* The base scene image */}
                    <img
                        src={imageUrl}
                        alt="Room Scene"
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
                    />

                    {/* The color overlay */}
                    {selectedColor && (
                        <div
                            className="ps-color-overlay"
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: selectedColor.hex_value,
                                mixBlendMode: 'multiply',
                                zIndex: 2
                            }}
                        ></div>
                    )}
                </div>
            ) : (
                <div style={{ padding: '40px', textAlign: 'center', background: '#eee', borderRadius: '8px' }}>
                    <p>No scene image available.</p>
                </div>
            )}
        </div>
    );
};

export default Visualizer;
