import { useState, useMemo } from '@wordpress/element';

const ColorBrowser = ({ colors, selectedColor, onColorSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredColors = useMemo(() => {
        if (!searchTerm) return colors;
        const lower = searchTerm.toLowerCase();
        return colors.filter(c =>
            c.name.toLowerCase().includes(lower) ||
            c.color_code.toLowerCase().includes(lower)
        );
    }, [colors, searchTerm]);

    return (
        <div className="ps-color-browser">
            <h3>Select a Color</h3>
            <input
                type="text"
                placeholder="Search colors by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '10px', marginBottom: '15px' }}
            />

            <div className="ps-color-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
                {filteredColors.map(color => (
                    <div
                        key={color.id}
                        className={`ps-color-swatch ${selectedColor?.id === color.id ? 'selected' : ''}`}
                        onClick={() => onColorSelect(color)}
                        style={{
                            cursor: 'pointer',
                            border: selectedColor?.id === color.id ? '2px solid #000' : '1px solid #ddd',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            textAlign: 'center',
                            fontSize: '11px',
                            boxShadow: selectedColor?.id === color.id ? '0 0 5px rgba(0,0,0,0.3)' : 'none'
                        }}
                    >
                        <div style={{ backgroundColor: color.hex_value, height: '60px', width: '100%' }}></div>
                        <div style={{ padding: '5px' }}>
                            <div style={{ fontWeight: 'bold' }}>{color.color_code}</div>
                            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{color.name}</div>
                        </div>
                    </div>
                ))}
                {filteredColors.length === 0 && <p>No colors found.</p>}
            </div>
        </div>
    );
};

export default ColorBrowser;
