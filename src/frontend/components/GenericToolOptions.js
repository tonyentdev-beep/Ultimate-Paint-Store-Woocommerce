import { Fragment } from '@wordpress/element';

const GenericToolOptions = ({
    selectedFulfillment,
    setSelectedFulfillment,
    matchedStockQty,
    deliveryAddress,
    onDeliveryAddressChange,
}) => {
    return (
        <div className="ps-generic-tool-options">
            {/* Fulfillment Section */}
            <div style={{ marginTop: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Fulfillment Method</label>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <input
                            type="radio"
                            name="generic_fulfillment"
                            value="pickup"
                            checked={selectedFulfillment === 'pickup'}
                            onChange={() => setSelectedFulfillment('pickup')}
                            style={{ marginRight: '8px' }}
                        />
                        Store Pickup
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <input
                            type="radio"
                            name="generic_fulfillment"
                            value="delivery"
                            checked={selectedFulfillment === 'delivery'}
                            onChange={() => setSelectedFulfillment('delivery')}
                            style={{ marginRight: '8px' }}
                        />
                        Delivery
                    </label>
                </div>
                
                {selectedFulfillment === 'delivery' && (
                    <div style={{ marginTop: '15px' }}>
                        <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#555' }}>
                            Currently using saved address for delivery. You can update this on the checkout page.
                        </p>
                    </div>
                )}
                
                <div style={{ marginTop: '10px', fontSize: '14px', color: matchedStockQty > 0 ? '#00a32a' : '#d63638', fontWeight: '500' }}>
                    {matchedStockQty > 0 ? `In Stock (${matchedStockQty} available)` : 'Out of Stock'}
                </div>
            </div>
        </div>
    );
};

export default GenericToolOptions;
