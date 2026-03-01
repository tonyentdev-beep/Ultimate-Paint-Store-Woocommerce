import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

const AddToCart = ({ familyId, variations, selectedSize, selectedSheen, selectedColor }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [message, setMessage] = useState('');

    const handleAddToCart = async () => {
        if (!selectedSize || !selectedSheen) {
            setMessage('Please select a Size and Sheen.');
            return;
        }
        if (!selectedColor) {
            setMessage('Please select a Color.');
            return;
        }

        // Find the matching variation ID
        const matchedVariation = variations.find(v =>
            v.attributes.attribute_pa_paint_size === selectedSize &&
            v.attributes.attribute_pa_paint_sheen === selectedSheen
        );

        if (!matchedVariation) {
            setMessage('This combination of size and sheen is currently unavailable.');
            return;
        }

        setIsAdding(true);
        setMessage('');

        try {
            const response = await apiFetch({
                path: '/paint-store/v1/public/add-to-cart',
                method: 'POST',
                data: {
                    product_id: familyId,
                    variation_id: matchedVariation.id,
                    quantity: 1,
                    color_hex: selectedColor.hex_value,
                    color_name: `${selectedColor.name} (${selectedColor.color_code})`
                }
            });

            if (response.success) {
                setMessage('✅ Added to cart successfully!');

                // Trigger WooCommerce fragments refresh so the cart icon updates
                if (typeof jQuery !== 'undefined') {
                    jQuery(document.body).trigger('wc_fragment_refresh');
                    jQuery(document.body).trigger('added_to_cart');
                }
            } else {
                setMessage('❌ Failed to add to cart.');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            setMessage(`❌ Error: ${error.message || 'Failed to add to cart.'}`);
        }

        setIsAdding(false);
    };

    // Calculate dynamic price based on variation
    let activePriceHtml = '';
    if (selectedSize && selectedSheen) {
        const matchedVariation = variations.find(v =>
            v.attributes.attribute_pa_paint_size === selectedSize &&
            v.attributes.attribute_pa_paint_sheen === selectedSheen
        );
        if (matchedVariation && matchedVariation.price_html) {
            activePriceHtml = matchedVariation.price_html;
        }
    }

    return (
        <div className="ps-add-to-cart-wrapper" style={{ marginTop: '30px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
            <div style={{ marginBottom: '15px' }} dangerouslySetInnerHTML={{ __html: activePriceHtml }} />

            <button
                className="button alt"
                onClick={handleAddToCart}
                disabled={isAdding || !selectedSize || !selectedSheen || !selectedColor}
                style={{ width: '100%', padding: '15px', fontSize: '18px', fontWeight: 'bold' }}
            >
                {isAdding ? 'Adding...' : 'Add to Cart'}
            </button>

            {message && (
                <div style={{ marginTop: '15px', fontWeight: 'bold', color: message.includes('✅') ? '#0f834d' : '#d63638' }}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default AddToCart;
