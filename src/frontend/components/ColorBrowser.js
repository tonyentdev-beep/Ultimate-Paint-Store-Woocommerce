import { useState, useMemo, useEffect } from '@wordpress/element';

const ColorBrowser = ({ colors, colorFamilies, colorBrands, selectedColor, onColorSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [visibleCount, setVisibleCount] = useState(10);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedFamilyId, setSelectedFamilyId] = useState('');
    const [selectedBrandId, setSelectedBrandId] = useState('');

    const filteredColors = useMemo(() => {
        let result = colors;

        // 1. Filter by Search Term
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            result = result.filter(c =>
                c.name.toLowerCase().includes(lower) ||
                (c.color_code && c.color_code.toLowerCase().includes(lower))
            );
        }

        // 2. Filter by Family
        if (selectedFamilyId) {
            const fId = parseInt(selectedFamilyId, 10);
            result = result.filter(c => parseInt(c.family_id, 10) === fId);
        }

        // 3. Filter by Brand
        if (selectedBrandId) {
            const bId = parseInt(selectedBrandId, 10);
            result = result.filter(c => parseInt(c.brand_id, 10) === bId);
        }

        return result;
    }, [colors, searchTerm, selectedFamilyId, selectedBrandId]);

    // Reset pagination when search or filters change
    useEffect(() => {
        setVisibleCount(10);
    }, [searchTerm, selectedFamilyId, selectedBrandId]);

    const visibleColors = filteredColors.slice(0, visibleCount);

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        // If scrolled within 100px of the bottom, load more
        if (scrollHeight - scrollTop - clientHeight < 100) {
            setVisibleCount(prev => Math.min(prev + 50, filteredColors.length));
        }
    };

    return (
        <div className="ps-color-browser" style={{ width: '100%', overflow: 'hidden', boxSizing: 'border-box' }}>
            {/* Search + Filter */}
            <div style={{ marginBottom: '15px' }}>
                <div style={{ position: 'relative', marginBottom: '10px' }}>
                    <svg
                        width="18" height="18" viewBox="0 0 18 18" fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                    >
                        <circle cx="7.5" cy="7.5" r="6" stroke="#999" strokeWidth="2" />
                        <path d="M12 12L16 16" stroke="#999" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search by Color Name, Number or Family..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px 12px 12px 38px',
                            border: '1px solid #ccc',
                            borderRadius: '6px',
                            fontSize: '14px',
                            boxSizing: 'border-box',
                            outline: 'none'
                        }}
                    />
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '10px 18px',
                        border: '1px solid #ccc',
                        borderRadius: '6px',
                        background: '#fff',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#002E5D'
                    }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1H13L8.5 6.5V11L5.5 13V6.5L1 1Z" fill="#002E5D" />
                    </svg>
                    Filter {(selectedFamilyId || selectedBrandId) ? '(Active)' : ''}
                </button>
            </div>

            {/* Filter Dropdowns */}
            {showFilters && (
                <div style={{
                    display: 'flex',
                    gap: '15px',
                    marginBottom: '15px',
                    padding: '15px',
                    background: '#f9f9f9',
                    border: '1px solid #eee',
                    borderRadius: '8px'
                }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px', color: '#555' }}>Color Family</label>
                        <select
                            value={selectedFamilyId}
                            onChange={(e) => setSelectedFamilyId(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '6px',
                                fontSize: '14px',
                                background: '#fff'
                            }}
                        >
                            <option value="">All Families</option>
                            {colorFamilies && colorFamilies.map(fam => (
                                <option key={fam.id} value={fam.id}>{fam.name}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px', color: '#555' }}>Brand</label>
                        <select
                            value={selectedBrandId}
                            onChange={(e) => setSelectedBrandId(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '6px',
                                fontSize: '14px',
                                background: '#fff'
                            }}
                        >
                            <option value="">All Brands</option>
                            {colorBrands && colorBrands.map(brand => (
                                <option key={brand.id} value={brand.id}>{brand.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {/* Selected color indicator */}
            {selectedColor && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 15px',
                    background: '#f5f5f5',
                    borderRadius: '8px',
                    marginBottom: '15px'
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: selectedColor.hex_value,
                        border: '3px solid #fff',
                        boxShadow: '0 0 0 2px #00598e',
                        flexShrink: 0
                    }} />
                    <div>
                        <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#111' }}>{selectedColor.name}</div>
                        <div style={{ fontSize: '13px', color: '#555' }}>{selectedColor.color_code}</div>
                        {selectedColor.description && (
                            <div style={{ fontSize: '13px', color: '#666', marginTop: '6px', lineHeight: '1.4' }}>{selectedColor.description}</div>
                        )}
                    </div>
                </div>
            )}

            <div
                onScroll={visibleCount > 10 ? handleScroll : undefined}
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: '2px',
                    maxHeight: visibleCount > 10 ? '500px' : 'none',
                    overflowY: visibleCount > 10 ? 'auto' : 'visible',
                    paddingRight: visibleCount > 10 ? '5px' : '0'
                }}
            >
                {visibleColors.map(color => (
                    <div
                        key={color.id}
                        onClick={() => onColorSelect(color)}
                        style={{
                            cursor: 'pointer',
                            textAlign: 'center',
                            padding: '4px',
                            borderRadius: '6px',
                            border: selectedColor?.id === color.id ? '2px solid #00598e' : '2px solid transparent',
                            transition: 'border-color 0.2s'
                        }}
                    >
                        <div style={{
                            height: '70px',
                            borderRadius: '6px',
                            border: '1px solid #e0e0e0', // Light grey border
                            padding: '5px', // 5px space between border and color
                            marginBottom: '6px',
                            backgroundColor: '#fff', // Ensure the gap is always white
                            boxSizing: 'border-box'
                        }}>
                            <div style={{
                                backgroundColor: color.hex_value,
                                width: '100%',
                                height: '100%',
                                borderRadius: '4px' // Slightly smaller inner radius
                            }} />
                        </div>
                        <div style={{
                            fontSize: '11px',
                            color: '#333',
                            lineHeight: '1.3',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>
                            {color.name}
                        </div>
                    </div>
                ))}
            </div>

            {/* See More */}
            {visibleCount === 10 && filteredColors.length > 10 && (
                <div style={{ textAlign: 'center', marginTop: '15px' }}>
                    <button
                        onClick={() => setVisibleCount(60)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#00598e',
                            fontWeight: '600',
                            fontSize: '14px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px'
                        }}
                    >
                        ▼ See More
                    </button>
                </div>
            )}
        </div>
    );
};

export default ColorBrowser;
