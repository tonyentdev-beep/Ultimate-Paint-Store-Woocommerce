import { useState } from '@wordpress/element';
import FulfillmentOptions from './FulfillmentOptions';

const ToolOptions = ({ attributes, selectedWidth, setSelectedWidth, selectedFulfillment, setSelectedFulfillment, matchedStockQty, deliveryAddress, onDeliveryAddressChange }) => {
    const hasWidths = attributes.widths && attributes.widths.length > 0;

    return (
        <div className="ps-product-options">
            {hasWidths && (
                <div style={{ marginBottom: '25px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px' }}>Width / Size</label>
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        {attributes.widths.map(width => {
                            const isSelected = selectedWidth === width.slug;
                            
                            return (
                                <div
                                    key={width.slug}
                                    onClick={() => setSelectedWidth(width.slug)}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '12px 24px',
                                        borderRadius: '6px',
                                        border: isSelected ? '2px solid #00598e' : '1px solid #ccc',
                                        backgroundColor: isSelected ? '#00598e' : '#fff',
                                        color: isSelected ? '#fff' : '#333',
                                        fontWeight: '500',
                                        fontSize: '15px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease-in-out',
                                        boxShadow: isSelected ? '0 4px 12px rgba(0,89,142,0.2)' : '0 2px 5px rgba(0,0,0,0.05)',
                                    }}
                                >
                                    {width.name}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Delivery vs Pickup Options */}
            <div style={{ marginTop: '10px' }}>
                <FulfillmentOptions
                    selectedOption={selectedFulfillment}
                    onOptionSelect={setSelectedFulfillment}
                    stockQty={matchedStockQty}
                    deliveryAddress={deliveryAddress}
                    onDeliveryAddressChange={onDeliveryAddressChange}
                />
            </div>
        </div>
    );
};

export default ToolOptions;
