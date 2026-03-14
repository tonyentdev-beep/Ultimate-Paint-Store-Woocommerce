import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { useFavorites } from '../hooks/useFavorites';
import ColorCard from './ColorCard';

export default function ColorPage({ colorSlug }) {
    const [colorData, setColorData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { toggleFavorite, isFavorite } = useFavorites();
    const [activeProductTab, setActiveProductTab] = useState('All');

    useEffect(() => {
        const fetchColor = async () => {
            try {
                const response = await apiFetch({ path: `/paint-store/v1/public/colors/${colorSlug}` });
                setColorData(response);
            } catch (err) {
                console.error("Failed to fetch color data:", err);
                setError(err.message || "Failed to load color.");
            } finally {
                setLoading(false);
            }
        };
        fetchColor();
    }, [colorSlug]);

    if (loading) {
        return <div style={{ padding: '60px', textAlign: 'center', fontSize: '1.2rem', color: '#666' }}>Loading Color Details...</div>;
    }

    if (error || !colorData || !colorData.color) {
        return <div style={{ padding: '60px', textAlign: 'center', color: '#d63638', fontSize: '1.2rem' }}>Error: {error || "Color not found."}</div>;
    }

    const { color, brand, color_family, coordinating_colors, available_products } = colorData;

    // Helper function to determine if text should be light or dark based on background hex
    const getContrastYIQ = (hexcolor) => {
        if (!hexcolor) return '#333';
        hexcolor = hexcolor.replace("#", "");
        if (hexcolor.length === 3) {
            hexcolor = hexcolor.split('').map(c => c + c).join('');
        }
        if (hexcolor.length !== 6) return '#333';
        
        const r = parseInt(hexcolor.substr(0, 2), 16);
        const g = parseInt(hexcolor.substr(2, 2), 16);
        const b = parseInt(hexcolor.substr(4, 2), 16);
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return (yiq >= 140) ? '#111' : '#fff'; // Using 140 to be slightly more biased against light text on mid-tones
    };
    
    const textColor = getContrastYIQ(color.hex_value);
    const isLightText = textColor === '#fff';

    return (
        <div className="ps-color-page-wrapper" style={{ fontFamily: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif', color: '#333' }}>
            
            {/* Full Width Color Header Section */}
            <div style={{ 
                backgroundColor: color.hex_value || '#ccc', 
                color: textColor, 
                padding: '80px 20px',
                position: 'relative',
                overflow: 'hidden',
                width: '100vw',
                marginLeft: 'calc(50% - 50vw)',
                minHeight: 'calc(100vh - 120px)',
                display: 'flex',
                alignItems: 'center'
            }}>
                <div style={{ width: '100%', maxWidth: '99vw', margin: '0 auto', padding: '0 20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '40px' }}>
                    {/* Left Column: Title and Code */}
                    <div style={{ flex: '1 1 500px' }}>
                        <h1 style={{ 
                            margin: '0 0 10px 0', 
                            fontSize: '4.5rem', 
                            fontWeight: '900', 
                            lineHeight: '1',
                            textTransform: 'uppercase',
                            letterSpacing: '-1px'
                        }}>
                            {color.name}
                        </h1>
                        <p style={{ 
                            fontSize: '1.8rem', 
                            margin: '0 0 15px 0', 
                            fontWeight: '400',
                            letterSpacing: '1px',
                            opacity: 0.9
                        }}>
                            {color.color_code}
                        </p>

                        {color.description && (
                            <p style={{ 
                                fontSize: '1.1rem', 
                                lineHeight: '1.6', 
                                margin: '0 0 40px 0',
                                opacity: 0.85,
                                maxWidth: '600px'
                            }}>
                                {color.description}
                            </p>
                        )}
                        
                        <button 
                            onClick={(e) => {
                                console.log('[PS] Save colour button clicked, color.id:', color.id);
                                e.preventDefault();
                                e.stopPropagation();
                                toggleFavorite(color.id, e);
                            }}
                            style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '10px',
                            backgroundColor: '#fff',
                            color: '#333',
                            border: '1px solid #ddd',
                            borderRadius: '30px',
                            padding: '12px 24px',
                            fontSize: '1rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            Save colour
                        </button>
                    </div>

                    {/* Right Column: Actions */}
                    <div style={{ flex: '0 1 400px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <h3 style={{ 
                                margin: '0', 
                                fontSize: '1.6rem', 
                                fontWeight: '900',
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                            }}>
                                LOVE THIS COLOUR?
                            </h3>
                            <button 
                                onClick={(e) => {
                                    console.log('[PS] Heart button clicked, color.id:', color.id);
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggleFavorite(color.id, e);
                                }}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '5px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'transform 0.2s',
                                    position: 'relative',
                                    zIndex: 10
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                                aria-label={isFavorite(color.id) ? "Remove from favorites" : "Add to favorites"}
                            >
                                <svg 
                                    width="28" 
                                    height="28" 
                                    viewBox="0 0 24 24" 
                                    fill={isFavorite(color.id) ? "#ff4757" : "none"}
                                    stroke={isFavorite(color.id) ? "#ff4757" : "#555"}
                                    strokeWidth="2" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                >
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path>
                                </svg>
                            </button>
                        </div>
                        
                        <button style={{
                            width: '100%',
                            backgroundColor: '#fff',
                            color: '#555',
                            border: '1px solid #ddd',
                            borderRadius: '30px',
                            padding: '16px 24px',
                            fontSize: '1.1rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '10px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}>
                            Great, now choose a product 
                            <span style={{ fontSize: '1.2rem', fontWeight: 'normal', color: '#999' }}>↓</span>
                        </button>

                        <div style={{
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: '8px', 
                            marginTop: '20px',
                            background: isLightText ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                            padding: '24px',
                            borderRadius: '16px'
                        }}>
                            <div style={{ fontSize: '0.95rem', letterSpacing: '0.3px', display: 'flex', alignItems: 'center' }}>
                                <span style={{ opacity: 0.8, marginRight: '4px' }}>Hex:</span>
                                <span>{color.hex_value}</span>
                            </div>
                            {color.rgb_value && (
                                <div style={{ fontSize: '0.95rem', letterSpacing: '0.3px', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ opacity: 0.8, marginRight: '4px' }}>RGB:</span>
                                    <span>{color.rgb_value}</span>
                                </div>
                            )}
                            {brand && (
                                <div style={{ fontSize: '0.95rem', letterSpacing: '0.3px', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ opacity: 0.8, marginRight: '4px' }}>Brand:</span>
                                    <span>{brand.name}</span>
                                </div>
                            )}
                            {color_family && (
                                <div style={{ fontSize: '0.95rem', letterSpacing: '0.3px', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ opacity: 0.8, marginRight: '4px' }}>Color Family:</span>
                                    <span>{color_family.name}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Below Header Section */}
            <div style={{ maxWidth: '99vw', margin: '40px auto', padding: '0 20px' }}>
                
            {/* Coordinating Colors Section */}
            {coordinating_colors && coordinating_colors.length > 0 && (
                <div style={{ marginBottom: '60px' }}>
                    <div style={{ marginBottom: '25px' }}>
                        <h2 style={{ fontSize: '2rem', margin: '0 0 10px 0', textTransform: 'uppercase', fontWeight: 'bold', color: '#00598e' }}>Coordinating Colors</h2>
                        <p style={{ fontSize: '1.1rem', color: '#666', margin: 0 }}>Explore coordinating colors for accent walls, trims and doors.</p>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'stretch' }}>
                        {/* Masonry Grid representing combinations */}
                        <div style={{ 
                            flex: '0 0 480px', 
                            display: 'flex', 
                            height: '350px' 
                        }}>
                            {/* Left Main Color Box */}
                            <div style={{ 
                                flex: 1, 
                                background: color.hex_value,
                                height: '100%'
                            }}></div>
                            
                            {/* Right Stacked Coordinating Colors */}
                            <div style={{ 
                                flex: 1, 
                                display: 'flex', 
                                flexDirection: 'column' 
                            }}>
                                {coordinating_colors.slice(0, 3).map((coordColor, index) => (
                                    <div 
                                        key={coordColor.id} 
                                        style={{ 
                                            flex: 1, 
                                            background: coordColor.hex_value,
                                            width: '100%'
                                        }}
                                        title={coordColor.name}
                                    ></div>
                                ))}
                            </div>
                        </div>

                        {/* Standard Color Cards for Coordinations */}
                        <div style={{ 
                            flex: 1,
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
                            gap: '20px',
                            alignItems: 'start'
                        }}>
                            {coordinating_colors.map(coordColor => (
                                <ColorCard key={coordColor.id} color={coordColor} />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Available Products Section */}
            {available_products && available_products.length > 0 && (
                <div style={{ marginBottom: '60px' }}>
                    <h2 style={{ fontSize: '2rem', borderBottom: '2px solid #f0f0f0', paddingBottom: '15px', marginBottom: '30px' }}>Available in these Products</h2>
                    
                    {/* Category Tabs */}
                    {(() => {
                        const categories = ['All', ...new Set(available_products.map(p => p.category || 'Other').filter(Boolean))];
                        if (categories.length > 1) { 
                            return (
                                <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
                                    {categories.map(cat => (
                                        <button 
                                            key={cat}
                                            onClick={() => setActiveProductTab(cat)}
                                            style={{
                                                padding: '10px 20px',
                                                background: activeProductTab === cat ? '#00598e' : '#f0f0f0',
                                                color: activeProductTab === cat ? '#fff' : '#333',
                                                border: 'none',
                                                borderRadius: '30px',
                                                cursor: 'pointer',
                                                fontWeight: '600',
                                                transition: 'background 0.2s'
                                            }}
                                        >
                                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            );
                        }
                        return null;
                    })()}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
                        {available_products
                        .filter(prod => activeProductTab === 'All' || (prod.category || 'Other') === activeProductTab)
                        .map(prod => {
                            // Link to WooCommerce permalink with preselect_color parameter
                            const productLink = prod.permalink ? `${prod.permalink}?preselect_color=${color.slug}` : `/?paint_store_family=${prod.id}&preselect_color=${color.slug}`;
                            return (
                                <a 
                                    href={productLink} 
                                    key={prod.id} 
                                    style={{ 
                                        display: 'flex', 
                                        flexDirection: 'column',
                                        border: '1px solid #eaeaea', 
                                        borderRadius: '12px', 
                                        padding: '25px', 
                                        textDecoration: 'none', 
                                        color: 'inherit',
                                        background: '#fff',
                                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.transform = 'none';
                                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.02)';
                                    }}
                                >
                                    {prod.image_url && (
                                        <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                                            <img src={prod.image_url} alt="Product Image" style={{ maxWidth: '100%', height: 'auto', maxHeight: '200px', objectFit: 'contain' }} />
                                        </div>
                                    )}
                                    <h3 style={{ margin: '0 0 20px 0', fontSize: '1.3rem', color: '#111', flexGrow: 1, textAlign: 'center' }}>{prod.name}</h3>
                                    
                                    <div className="ps-card-buttons" style={{ display: 'flex', justifyContent: 'center' }}>
                                        <span className="ps-card-btn ps-btn-buy">Buy online</span>
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                </div>
            )}

            </div> {/* End of below-header constrained container */}

        </div>
    );
}
