import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const data = await apiFetch({ path: '/paint-store/v1/dashboard-stats' });
            setStats(data);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        }
        setLoading(false);
    };

    const cards = [
        { key: 'brands', label: 'Brands', icon: '🏷️', color: '#4F46E5' },
        { key: 'color_families', label: 'Color Families', icon: '🎨', color: '#7C3AED' },
        { key: 'colors', label: 'Colors', icon: '🖌️', color: '#DB2777' },
        { key: 'bases', label: 'Bases', icon: '🧪', color: '#DC2626' },
        { key: 'product_families', label: 'Product Families', icon: '📦', color: '#EA580C' },
        { key: 'product_categories', label: 'Product Categories', icon: '📂', color: '#D97706' },
        { key: 'sizes', label: 'Sizes', icon: '📐', color: '#CA8A04' },
        { key: 'sheens', label: 'Sheens', icon: '✨', color: '#65A30D' },
        { key: 'surface_types', label: 'Surface Types', icon: '🧱', color: '#0D9488' },
        { key: 'scene_images', label: 'Scene Images', icon: '🖼️', color: '#0284C7' },
    ];

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
                <p style={{ fontSize: '16px' }}>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <div style={{ marginBottom: '30px' }}>
                <h2 style={{ margin: '0 0 8px', fontSize: '22px', color: '#1e1e1e' }}>Dashboard</h2>
                <p style={{ margin: 0, color: '#757575', fontSize: '14px' }}>
                    Overview of your paint store data.
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '30px',
            }}>
                {cards.map(card => (
                    <div key={card.key} style={{
                        background: '#fff',
                        borderRadius: '10px',
                        padding: '20px',
                        border: '1px solid #e0e0e0',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                        transition: 'transform 0.15s, box-shadow 0.15s',
                        cursor: 'default',
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span style={{ fontSize: '28px' }}>{card.icon}</span>
                            <span style={{
                                fontSize: '32px', fontWeight: 700, color: card.color,
                                lineHeight: 1,
                            }}>
                                {stats ? stats[card.key] : 0}
                            </span>
                        </div>
                        <div style={{
                            fontSize: '13px', fontWeight: 600, color: '#555',
                            textTransform: 'uppercase', letterSpacing: '0.5px',
                        }}>
                            {card.label}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{
                background: '#fff', borderRadius: '10px', padding: '24px',
                border: '1px solid #e0e0e0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}>
                <h3 style={{ margin: '0 0 12px', fontSize: '16px', color: '#1e1e1e' }}>Quick Start Guide</h3>
                <ol style={{ margin: 0, paddingLeft: '20px', color: '#555', lineHeight: '2' }}>
                    <li><strong>Brands</strong> — Add your paint brands (e.g., Valspar, Sherwin-Williams)</li>
                    <li><strong>Color Families</strong> — Create color families (e.g., Blues, Greens, Neutrals)</li>
                    <li><strong>Colors</strong> — Add individual colors or bulk import via CSV</li>
                    <li><strong>Bases</strong> — Define paint bases (e.g., White Base, Deep Base)</li>
                    <li><strong>Product Families</strong> — Create product lines (e.g., Supreme Edge Interior)</li>
                    <li><strong>Scene Images</strong> — Upload room scenes for the Color Visualizer</li>
                    <li><strong>WooCommerce</strong> — Link everything to products for checkout</li>
                </ol>
            </div>
        </div>
    );
};

export default Dashboard;
