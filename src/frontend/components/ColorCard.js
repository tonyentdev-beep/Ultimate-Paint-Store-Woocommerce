import { createElement } from '@wordpress/element';
import { useFavorites } from '../hooks/useFavorites';

export default function ColorCard({ color }) {
    const { toggleFavorite, isFavorite } = useFavorites();

    return (
        <a 
            href={color.product_url ? color.product_url : `/colors/${color.slug ? color.slug : color.id}/`}
            style={{
                display: 'block',
                textDecoration: 'none',
                color: 'inherit',
                borderRadius: '0',
                overflow: 'hidden',
                border: '1px solid #e0e0e0',
                transition: 'transform 0.2s, box-shadow 0.2s',
                background: '#fff',
                cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
            }}
        >
            <div style={{ position: 'relative', width: '100%' }}>
                <div style={{ 
                    aspectRatio: '4 / 3', 
                    background: color.image_url ? `url(${color.image_url}) center/cover no-repeat` : (color.hex_value || '#f1f1f1'),
                    borderBottom: '1px solid rgba(0,0,0,0.05)',
                    width: '100%'
                }}></div>
                
                <button 
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(color.id, e);
                    }}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '5px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                        transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                    aria-label={isFavorite(color.id) ? "Remove from favorites" : "Add to favorites"}
                >
                    <svg 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill={isFavorite(color.id) ? "#ff4757" : "none"}
                        stroke={isFavorite(color.id) ? "#ff4757" : "rgba(0,0,0,0.4)"}
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        style={{ 
                            filter: isFavorite(color.id) ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' : 'drop-shadow(0 2px 4px rgba(255,255,255,0.5))' 
                        }}
                    >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
            </div>
            <div style={{ padding: '15px' }}>
                <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {color.name}
                </div>
                <div style={{ fontSize: '13px', color: '#666' }}>
                    {color.color_code}
                </div>
            </div>
        </a>
    );
}
