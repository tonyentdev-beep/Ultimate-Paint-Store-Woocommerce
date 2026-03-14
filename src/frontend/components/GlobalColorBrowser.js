import { useState, useEffect, useMemo, useRef } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { useFavorites } from '../hooks/useFavorites';
import ColorCard from './ColorCard';

export default function GlobalColorBrowser() {
    const [colorFamilies, setColorFamilies] = useState([]);
    const [colors, setColors] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Pagination and Filtering State
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [perPage] = useState(48); // 48 is a good dense grid size
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedFamilyId, setSelectedFamilyId] = useState(0);

    const { toggleFavorite, isFavorite } = useFavorites();

    const isInitialMount = useRef(true);

    // Initial Load - Families
    useEffect(() => {
        const fetchFamilies = async () => {
            try {
                const families = await apiFetch({ path: '/paint-store/v1/public/color-families' });
                setColorFamilies(families);
            } catch (error) {
                console.error('Error fetching color families:', error);
            }
        };
        fetchFamilies();
    }, []);

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPage(1); // Reset page on new search
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Handle family selection
    const handleFamilyClick = (familyId) => {
        setSelectedFamilyId(familyId === selectedFamilyId ? 0 : familyId);
        setPage(1); // Reset to page 1
    };

    // Fetch Colors with filters
    useEffect(() => {
        const fetchColors = async () => {
            setLoading(true);
            try {
                let path = `/paint-store/v1/public/colors?per_page=${perPage}&page=${page}`;
                
                if (selectedFamilyId > 0) {
                    path += `&family_id=${selectedFamilyId}`;
                }
                if (debouncedSearch) {
                    path += `&search=${encodeURIComponent(debouncedSearch)}`;
                }

                const response = await apiFetch({ path });
                
                if (response && response.items) {
                    setColors(response.items);
                    setTotalPages(response.total_pages);
                    setTotalItems(response.total_items);
                } else if (Array.isArray(response)) {
                    // Fallback to array if pagination is broken
                    setColors(response);
                    setTotalPages(1);
                    setTotalItems(response.length);
                }
            } catch (error) {
                console.error('Error fetching colors:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchColors();
    }, [page, perPage, selectedFamilyId, debouncedSearch]);

    // Scroll to top on page change
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        window.scrollTo({ top: document.querySelector('.ps-global-color-browser')?.offsetTop - 100 || 0, behavior: 'smooth' });
    }, [page]);

    // Derived family counts (Requires API to return counts or we just show them without counts)
    // We'll just show the family list

    return (
        <div className="ps-global-color-browser" style={{ 
            maxWidth: '1440px', 
            margin: '0 auto', 
            padding: '40px 20px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        }}>
            
            <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '15px', color: '#111' }}>
                    Browse Colors
                </h1>
                <p style={{ fontSize: '18px', color: '#555', maxWidth: '600px', margin: '0 auto' }}>
                    Explore our extensive palette of colors to find the perfect shade for your next project.
                </p>
            </div>

            <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
                
                {/* Sidebar - Filters */}
                <div style={{ 
                    flex: '0 0 280px', 
                    position: 'sticky', 
                    top: '20px',
                    marginRight: '10px'
                }}>
                    <div style={{ marginBottom: '30px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', borderBottom: '2px solid #00598e', paddingBottom: '10px', marginBottom: '15px' }}>
                            Search Colors
                        </h3>
                        <div style={{ position: 'relative' }}>
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Color name or code..."
                                style={{
                                    width: '100%',
                                    padding: '12px 15px',
                                    border: '1px solid #ccc',
                                    borderRadius: '6px',
                                    fontSize: '15px',
                                    boxSizing: 'border-box'
                                }}
                            />
                            {searchQuery && (
                                <button 
                                    onClick={() => setSearchQuery('')}
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'transparent',
                                        border: 'none',
                                        fontSize: '16px',
                                        color: '#999',
                                        cursor: 'pointer'
                                    }}
                                >
                                    &times;
                                </button>
                            )}
                        </div>
                    </div>

                    <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', borderBottom: '2px solid #00598e', paddingBottom: '10px', marginBottom: '15px' }}>
                            Color Families
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <button
                                onClick={() => handleFamilyClick(0)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '10px 15px',
                                    background: selectedFamilyId === 0 ? '#f0f7fb' : 'transparent',
                                    border: '1px solid',
                                    borderColor: selectedFamilyId === 0 ? '#00598e' : '#eee',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    fontWeight: selectedFamilyId === 0 ? '600' : '400',
                                    color: selectedFamilyId === 0 ? '#00598e' : '#333',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <span>All Color Families</span>
                            </button>
                            
                            {colorFamilies.map(family => (
                                <button
                                    key={family.id}
                                    onClick={() => handleFamilyClick(parseInt(family.id, 10))}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        gap: '12px',
                                        padding: '10px 15px',
                                        background: selectedFamilyId === parseInt(family.id, 10) ? '#f0f7fb' : 'transparent',
                                        border: '1px solid',
                                        borderColor: selectedFamilyId === parseInt(family.id, 10) ? '#00598e' : '#eee',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        fontWeight: selectedFamilyId === parseInt(family.id, 10) ? '600' : '400',
                                        color: selectedFamilyId === parseInt(family.id, 10) ? '#00598e' : '#333',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{ 
                                        width: '20px', 
                                        height: '20px', 
                                        borderRadius: '50%',
                                        background: family.hex_representative || '#ccc',
                                        border: '1px solid rgba(0,0,0,0.1)'
                                    }}></div>
                                    <span>{family.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content - Grid */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        marginBottom: '20px',
                        paddingBottom: '15px',
                        borderBottom: '1px solid #eee'
                    }}>
                        <div style={{ fontSize: '16px', color: '#555' }}>
                            {loading ? 'Searching...' : <>Showing <strong>{totalItems}</strong> result{totalItems !== 1 ? 's' : ''}</>}
                        </div>
                    </div>

                    {loading ? (
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
                            gap: '20px' 
                        }}>
                            {[...Array(16)].map((_, i) => (
                                <div key={i} style={{ aspectRatio: '4 / 3', background: '#f5f5f5', borderRadius: '0', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
                            ))}
                        </div>
                    ) : colors.length > 0 ? (
                        <>
                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', 
                                gap: '25px',
                                marginBottom: '40px'
                            }}>
                                {colors.map(color => (
                                    <ColorCard key={color.id} color={color} />
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '40px' }}>
                                    <button 
                                        onClick={() => setPage(Math.max(1, page - 1))}
                                        disabled={page === 1}
                                        style={{
                                            padding: '10px 20px',
                                            background: page === 1 ? '#f5f5f5' : '#fff',
                                            color: page === 1 ? '#aaa' : '#333',
                                            border: '1px solid #ccc',
                                            borderRadius: '6px',
                                            cursor: page === 1 ? 'not-allowed' : 'pointer',
                                            fontWeight: '500'
                                        }}
                                    >
                                        Previous
                                    </button>
                                    
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        {[...Array(totalPages)].map((_, i) => {
                                            const pageNum = i + 1;
                                            // Simple pagination logic, show +/- 2 pages
                                            if (
                                                pageNum === 1 || 
                                                pageNum === totalPages || 
                                                (pageNum >= page - 2 && pageNum <= page + 2)
                                            ) {
                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => setPage(pageNum)}
                                                        style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            background: page === pageNum ? '#00598e' : '#fff',
                                                            color: page === pageNum ? '#fff' : '#333',
                                                            border: '1px solid',
                                                            borderColor: page === pageNum ? '#00598e' : '#ccc',
                                                            borderRadius: '6px',
                                                            cursor: 'pointer',
                                                            fontWeight: 'bold'
                                                        }}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            } else if (
                                                pageNum === page - 3 || 
                                                pageNum === page + 3
                                            ) {
                                                return <span key={pageNum} style={{ color: '#999' }}>...</span>;
                                            }
                                            return null;
                                        })}
                                    </div>

                                    <button 
                                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                                        disabled={page === totalPages}
                                        style={{
                                            padding: '10px 20px',
                                            background: page === totalPages ? '#f5f5f5' : '#fff',
                                            color: page === totalPages ? '#aaa' : '#333',
                                            border: '1px solid #ccc',
                                            borderRadius: '6px',
                                            cursor: page === totalPages ? 'not-allowed' : 'pointer',
                                            fontWeight: '500'
                                        }}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#f9f9f9', borderRadius: '8px' }}>
                            <div style={{ fontSize: '48px', marginBottom: '15px' }}>🎨</div>
                            <h3 style={{ fontSize: '20px', margin: '0 0 10px 0', color: '#333' }}>No colors found</h3>
                            <p style={{ color: '#666', margin: 0 }}>Try adjusting your search or selecting a different color family.</p>
                            <button 
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedFamilyId(0);
                                }}
                                style={{ marginTop: '20px', padding: '10px 20px', background: '#00598e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}

                </div>
            </div>
            <style>
                {`
                @keyframes pulse {
                    0% { opacity: 0.6; }
                    50% { opacity: 1; }
                    100% { opacity: 0.6; }
                }
                `}
            </style>
        </div>
    );
};
