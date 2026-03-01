const ProductOptions = ({ attributes, selectedSize, setSelectedSize, selectedSheen, setSelectedSheen }) => {
    return (
        <div className="ps-product-options" style={{ marginTop: '20px' }}>
            {attributes.sizes && attributes.sizes.length > 0 && (
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Size</label>
                    <select
                        value={selectedSize}
                        onChange={(e) => setSelectedSize(e.target.value)}
                        style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                    >
                        <option value="">Choose an option</option>
                        {attributes.sizes.map(size => (
                            <option key={size.slug} value={size.slug}>{size.name}</option>
                        ))}
                    </select>
                </div>
            )}

            {attributes.sheens && attributes.sheens.length > 0 && (
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Sheen</label>
                    <select
                        value={selectedSheen}
                        onChange={(e) => setSelectedSheen(e.target.value)}
                        style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                    >
                        <option value="">Choose an option</option>
                        {attributes.sheens.map(sheen => (
                            <option key={sheen.slug} value={sheen.slug}>{sheen.name}</option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
};

export default ProductOptions;
