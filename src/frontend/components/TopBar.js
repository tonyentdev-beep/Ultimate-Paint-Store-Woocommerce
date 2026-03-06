import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

const TopBar = ({ familyName, categories, displayPrice, isAdding, handleAddToCart, quantity, setQuantity, canAddToCart, message }) => {
    return (
        <div className="ps-top-bar" style={{
            background: '#fff',
            position: 'sticky',
            top: '80px',
            zIndex: 100,
            width: '99vw',
            maxWidth: '99vw',
            marginLeft: 'calc(-50vw + 50% + 0.5vw)',
            boxSizing: 'border-box',
            padding: '10px 20px'
        }}>
            <div style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            }}>
                {/* Breadcrumb row */}
                <div style={{ fontSize: '13px', color: '#00598e', fontWeight: 'bold' }}>
                    Home / {(categories && categories.length > 0) ? categories.join(' / ') : 'Products'} / {familyName}
                </div>

                {/* Title & Cart Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                    <div style={{ flex: '1 1 auto', minWidth: '300px' }}>
                        <h1 style={{ fontSize: '24px', margin: '0 0 5px 0', color: '#222', lineHeight: '1.2' }}>{familyName}</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px', color: '#555' }}>
                            <span style={{ color: '#ffb400', fontSize: '24px', letterSpacing: '2px' }}>★★★★☆</span>
                            <span>4185</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                        {displayPrice && (
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111' }}>
                                {displayPrice}
                            </div>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <button
                                className="ps-qty-btn"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            >
                                <svg width="16" height="3" viewBox="0 0 16 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="16" height="3" rx="1.5" fill="#C4C4C4" />
                                </svg>
                            </button>
                            <input
                                type="number"
                                className="ps-qty-input"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            />
                            <button
                                className="ps-qty-btn"
                                onClick={() => setQuantity(quantity + 1)}
                            >
                                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11 2V20M2 11H20" stroke="#00598E" strokeWidth="2.5" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>

                        <button
                            className="ps-card-btn ps-btn-buy"
                            onClick={handleAddToCart}
                            disabled={isAdding || !canAddToCart}
                            style={{
                                cursor: (!canAddToCart || isAdding) ? 'not-allowed' : 'pointer',
                                opacity: (!canAddToCart || isAdding) ? 0.7 : 1,
                                padding: '14px 30px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                minWidth: '150px',
                                marginLeft: '10px'
                            }}
                        >
                            {isAdding ? 'Adding...' : 'Add to Cart'}
                        </button>
                    </div>
                </div>

                {message && (
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: message.includes('✅') ? '#0f834d' : '#d63638', textAlign: 'right' }}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TopBar;
