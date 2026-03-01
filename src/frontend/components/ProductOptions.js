const ProductOptions = ({ attributes, selectedSize, setSelectedSize, selectedSheen, setSelectedSheen, selectedColor, shouldFilter }) => {
    const hasSizes = attributes.sizes && attributes.sizes.length > 0;
    const hasSheens = attributes.sheens && attributes.sheens.length > 0;

    return (
        <div className="ps-product-options" style={{ marginTop: '20px' }}>
            {hasSizes && (
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Size</label>
                    <select
                        value={selectedSize}
                        onChange={(e) => setSelectedSize(e.target.value)}
                        style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                    >
                        <option value="">Choose a size</option>
                        {attributes.sizes.map(size => (
                            <option key={size.slug} value={size.slug}>{size.name}</option>
                        ))}
                    </select>
                </div>
            )}

            {hasSheens && (
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Sheen</label>
                    <select
                        value={selectedSheen}
                        onChange={(e) => setSelectedSheen(e.target.value)}
                        style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                    >
                        <option value="">Choose a sheen</option>
                        {attributes.sheens.map(sheen => (
                            <option key={sheen.slug} value={sheen.slug}>{sheen.name}</option>
                        ))}
                    </select>
                </div>
            )}

            {shouldFilter && selectedColor && !hasSizes && !hasSheens && (
                <p style={{ color: '#c33', fontStyle: 'italic', margin: '0 0 15px 0' }}>
                    No product options are available for this color combination.
                </p>
            )}
        </div>
    );
};

export default ProductOptions;
