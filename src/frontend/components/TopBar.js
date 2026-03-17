import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

const TopBar = ({ familyName, dynamicTitle, categories, displayPrice, isAdding, handleAddToCart, quantity, setQuantity, canAddToCart, message, reviewStats }) => {
    return (
        <>
            {/* Breadcrumb + Title — always at the top */}
            <div className="ps-top-bar" style={{
                background: '#fff',
                position: 'sticky',
                top: '10px',
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
                        <a href="/" style={{ textDecoration: 'none', color: '#00598e' }}>Home</a>{' / '}
                        {(Array.isArray(categories) && categories.length > 0) ? (
                            categories.map((cat, index) => (
                                <span key={index}>
                                    <a 
                                        href={`/shop/?ps_category=${cat.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                                        style={{ textDecoration: 'none', color: '#00598e' }}
                                    >
                                        {cat}
                                    </a>
                                    {' / '}
                                </span>
                            ))
                        ) : (
                            <span><a href="/shop/" style={{ textDecoration: 'none', color: '#00598e' }}>Products</a>{' / '}</span>
                        )}
                        <span style={{ color: '#666' }}>{familyName}</span>
                    </div>

                    {/* Title & Cart Row — visible on desktop only */}
                    <div className="ps-topbar-desktop-cart" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                        <div style={{ flex: '1 1 auto', minWidth: '200px' }}>
                            <h1 style={{ fontSize: '24px', margin: '0 0 5px 0', color: '#222', lineHeight: '1.2' }}>{dynamicTitle || familyName}</h1>
                            {reviewStats && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px', color: '#555' }}>
                                    {reviewStats.total > 0 ? (
                                        <a
                                            href="#reviews"
                                            style={{ display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none', color: 'inherit' }}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                const target = document.querySelector('#reviews');
                                                if (target) {
                                                    const headerOffset = 180;
                                                    const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
                                                    window.scrollTo({ top: elementPosition - headerOffset, behavior: 'smooth' });
                                                }
                                            }}
                                        >
                                            <span style={{ color: '#ffb400', fontSize: '24px', letterSpacing: '2px' }}>
                                                {'★'.repeat(Math.round(reviewStats.average))}{'☆'.repeat(5 - Math.round(reviewStats.average))}
                                            </span>
                                            <span style={{ textDecoration: 'underline' }}>{reviewStats.total} Reviews</span>
                                        </a>
                                    ) : (
                                        <a
                                            href="#reviews"
                                            style={{ color: '#00598E', textDecoration: 'underline', fontSize: '14px' }}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                const target = document.querySelector('#reviews');
                                                if (target) {
                                                    const headerOffset = 180;
                                                    const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
                                                    window.scrollTo({ top: elementPosition - headerOffset, behavior: 'smooth' });
                                                }
                                            }}
                                        >
                                            Be the first to review!
                                        </a>
                                    )}
                                </div>
                            )}
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

            {/* Mobile Sticky Bottom Cart Bar */}
            <div className="ps-mobile-cart-bar">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '10px' }}>
                    {displayPrice && (
                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#111' }}>
                            {displayPrice}
                        </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                            className="ps-qty-btn"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            style={{ width: '32px', height: '32px' }}
                        >
                            <svg width="14" height="3" viewBox="0 0 16 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="16" height="3" rx="1.5" fill="#C4C4C4" />
                            </svg>
                        </button>
                        <input
                            type="number"
                            className="ps-qty-input ps-qty-input-mobile"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        />
                        <button
                            className="ps-qty-btn"
                            onClick={() => setQuantity(quantity + 1)}
                            style={{ width: '32px', height: '32px' }}
                        >
                            <svg width="18" height="18" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                            padding: '12px 24px',
                            fontSize: '15px',
                            fontWeight: 'bold',
                            flex: '1 1 auto'
                        }}
                    >
                        {isAdding ? 'Adding...' : 'Add to Cart'}
                    </button>
                </div>
                {message && (
                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: message.includes('✅') ? '#0f834d' : '#d63638', textAlign: 'center', marginTop: '4px' }}>
                        {message}
                    </div>
                )}
            </div>
        </>
    );
};

export default TopBar;
