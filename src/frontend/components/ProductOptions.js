import { useState } from '@wordpress/element';
import FulfillmentOptions from './FulfillmentOptions';

const getSheenStyle = (sheenSlug, baseColor) => {
    const color = baseColor || '#f0f0f0';
    let bgImage = 'none';
    const slug = sheenSlug.toLowerCase();

    if (slug.includes('eggshell')) {
        bgImage = `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15) 0%, transparent 60%)`;
    } else if (slug.includes('satin')) {
        bgImage = `linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 40%)`;
    } else if (slug.includes('semi-gloss')) {
        bgImage = `linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 20%, transparent 100%)`;
    } else if (slug.includes('gloss')) {
        bgImage = `linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.3) 15%, transparent 15%, transparent 100%)`;
    }

    return {
        backgroundColor: color,
        backgroundImage: bgImage,
        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05)'
    };
};

const SHEEN_DESCRIPTIONS = {
    'flat': 'No shine, hides imperfections',
    'matte': 'No shine, hides imperfections',
    'eggshell': 'Soft, velvety low sheen',
    'satin': 'Smooth pearl-like finish',
    'semi-gloss': 'Durable, easy to clean',
    'gloss': 'High shine, very durable',
    'high-gloss': 'Maximum shine & durability'
};

const getSheenDescription = (slug, name) => {
    const s = (slug || '').toLowerCase();
    const n = (name || '').toLowerCase();
    for (const [key, desc] of Object.entries(SHEEN_DESCRIPTIONS)) {
        if (s.includes(key) || n.includes(key)) return desc;
    }
    return '';
};

const SIZE_IMAGES = {
    'quart': {
        active: '/wp-content/uploads/2026/03/66697456.avif',
        inactive: '/wp-content/uploads/2026/03/66697455.avif',
        fallbackDesc: '100 square feet'
    },
    '1-gallon': {
        active: '/wp-content/uploads/2026/03/66697469.avif',
        inactive: '/wp-content/uploads/2026/03/66697468.avif',
        fallbackDesc: '400 square feet'
    },
    '5-gallon': {
        active: '/wp-content/uploads/2026/03/66697465.avif',
        inactive: '/wp-content/uploads/2026/03/66697457.avif',
        fallbackDesc: '2000 square feet'
    }
};

const getSizeData = (slug, name) => {
    const s = (slug || '').toLowerCase();
    const n = (name || '').toLowerCase();

    if ((s.includes('5') && s.includes('gallon')) || (n.includes('5') && n.includes('gallon'))) {
        return SIZE_IMAGES['5-gallon'];
    } else if ((s.includes('1') && s.includes('gallon')) || (n.includes('1') && n.includes('gallon')) || s === 'gallon' || n === 'gallon') {
        return SIZE_IMAGES['1-gallon'];
    } else if (s.includes('quart') || n.includes('quart')) {
        return SIZE_IMAGES['quart'];
    }

    return { active: null, inactive: null, fallbackDesc: '' };
};

const PAINT_SHEEN_DATA = [
    { name: 'Flat / Matte', sheen: '0-5', durability: '★★☆☆☆', bestFor: 'Ceilings, low-traffic areas', cleanability: 'Difficult to clean', look: 'Smooth, no reflection' },
    { name: 'Eggshell', sheen: '10-25', durability: '★★★☆☆', bestFor: 'Living rooms, bedrooms', cleanability: 'Easy to wipe', look: 'Soft, warm glow' },
    { name: 'Satin', sheen: '25-35', durability: '★★★★☆', bestFor: 'Kitchens, bathrooms, hallways', cleanability: 'Very easy to clean', look: 'Smooth, pearl-like' },
    { name: 'Semi-Gloss', sheen: '35-70', durability: '★★★★★', bestFor: 'Trim, doors, cabinets', cleanability: 'Excellent, scrub-friendly', look: 'Noticeable shine' },
    { name: 'Gloss', sheen: '70-100', durability: '★★★★★', bestFor: 'Accent pieces, furniture', cleanability: 'Easiest to clean', look: 'High shine, mirror-like' }
];

const STAIN_SHEEN_DATA = [
    { name: 'Flat / Matte', sheen: '0-5', durability: '★★☆☆☆', bestFor: 'Natural wood look', cleanability: 'Low', look: 'No reflection, raw feel' },
    { name: 'Satin', sheen: '25-35', durability: '★★★★☆', bestFor: 'Decks, fences, siding', cleanability: 'Moderate', look: 'Subtle sheen, enriched grain' },
    { name: 'Semi-Gloss', sheen: '35-70', durability: '★★★★★', bestFor: 'Outdoor furniture, railings', cleanability: 'High', look: 'Visible sheen, protective' },
    { name: 'Gloss', sheen: '70-100', durability: '★★★★★', bestFor: 'Marine, high-wear surfaces', cleanability: 'Highest', look: 'High shine, wet look' }
];

const SheenCompareModal = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('paint');
    if (!isOpen) return null;

    const data = activeTab === 'paint' ? PAINT_SHEEN_DATA : STAIN_SHEEN_DATA;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 10000,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }} onClick={onClose}>
            <div style={{
                background: '#fff', borderRadius: '16px', width: '90%', maxWidth: '750px',
                maxHeight: '85vh', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                display: 'flex', flexDirection: 'column'
            }} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '20px 24px', borderBottom: '1px solid #eee'
                }}>
                    <h2 style={{ margin: 0, fontSize: '20px', color: '#002E5D' }}>Help Me Choose a Sheen</h2>
                    <button onClick={onClose} style={{
                        background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer',
                        color: '#999', lineHeight: 1, padding: '4px'
                    }}>&times;</button>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', borderBottom: '2px solid #eee', padding: '0 24px' }}>
                    <button onClick={() => setActiveTab('paint')} style={{
                        padding: '12px 20px', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: '600',
                        background: 'none', color: activeTab === 'paint' ? '#00598e' : '#666',
                        borderBottom: activeTab === 'paint' ? '3px solid #00598e' : '3px solid transparent',
                        marginBottom: '-2px', transition: 'all 0.2s'
                    }}>Compare Paint Sheen</button>
                    <button onClick={() => setActiveTab('stain')} style={{
                        padding: '12px 20px', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: '600',
                        background: 'none', color: activeTab === 'stain' ? '#00598e' : '#666',
                        borderBottom: activeTab === 'stain' ? '3px solid #00598e' : '3px solid transparent',
                        marginBottom: '-2px', transition: 'all 0.2s'
                    }}>Compare Stain Sheen</button>
                </div>

                {/* Table */}
                <div style={{ padding: '20px 24px', overflowY: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #002E5D' }}>
                                <th style={{ textAlign: 'left', padding: '10px 8px', color: '#002E5D' }}>Sheen</th>
                                <th style={{ textAlign: 'left', padding: '10px 8px', color: '#002E5D' }}>Sheen Level</th>
                                <th style={{ textAlign: 'left', padding: '10px 8px', color: '#002E5D' }}>Durability</th>
                                <th style={{ textAlign: 'left', padding: '10px 8px', color: '#002E5D' }}>Best For</th>
                                <th style={{ textAlign: 'left', padding: '10px 8px', color: '#002E5D' }}>Clean</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, i) => (
                                <tr key={i} style={{
                                    borderBottom: '1px solid #eee',
                                    backgroundColor: i % 2 === 0 ? '#f9fbfd' : '#fff'
                                }}>
                                    <td style={{ padding: '12px 8px', fontWeight: '600', color: '#333' }}>{row.name}</td>
                                    <td style={{ padding: '12px 8px', color: '#666' }}>{row.sheen}</td>
                                    <td style={{ padding: '12px 8px' }}>{row.durability}</td>
                                    <td style={{ padding: '12px 8px', color: '#666' }}>{row.bestFor}</td>
                                    <td style={{ padding: '12px 8px', color: '#666' }}>{row.cleanability}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const ProductOptions = ({ attributes, selectedSize, setSelectedSize, selectedSheen, setSelectedSheen, selectedColor, shouldFilter, isWoodStain = false, selectedFulfillment, setSelectedFulfillment, matchedStockQty, deliveryAddress, onDeliveryAddressChange, sizePrices = {} }) => {
    const hasSizes = attributes.sizes && attributes.sizes.length > 0;
    const hasSheens = attributes.sheens && attributes.sheens.length > 0;
    const [showSheenModal, setShowSheenModal] = useState(false);

    return (
        <div className="ps-product-options">
            {hasSizes && (
                <div style={{ marginBottom: '25px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px' }}>Size</label>
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        {attributes.sizes.map(size => {
                            const isSelected = selectedSize === size.slug;
                            const isAvailable = !isWoodStain || (attributes.availableSizeSlugs && attributes.availableSizeSlugs.includes(size.slug));
                            const sizeData = getSizeData(size.slug, size.name);
                            const imgUrl = isSelected && sizeData.active ? sizeData.active : sizeData.inactive;

                            return (
                                <div
                                    key={size.slug}
                                    onClick={() => {
                                        if (isAvailable) setSelectedSize(size.slug);
                                    }}
                                    style={isWoodStain ? {
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '12px 24px',
                                        borderRadius: '50px',
                                        border: isSelected ? '2px solid #00598e' : '1px solid #ccc',
                                        backgroundColor: isSelected ? '#00598e' : (isAvailable ? '#fff' : '#fafafa'),
                                        backgroundImage: !isAvailable ? 'linear-gradient(to top right, transparent calc(50% - 1px), #999 calc(50% - 1px), #999 calc(50% + 1px), transparent calc(50% + 1px))' : 'none',
                                        color: isSelected ? '#fff' : (isAvailable ? '#666' : '#aaa'),
                                        fontWeight: '500',
                                        fontSize: '15px',
                                        cursor: isAvailable ? 'pointer' : 'not-allowed',
                                        transition: 'all 0.2s ease-in-out',
                                        boxShadow: isSelected ? '0 4px 12px rgba(0,89,142,0.2)' : 'none',
                                    } : {
                                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                                        cursor: 'pointer', width: '130px', textAlign: 'center'
                                    }}
                                >
                                    {!isWoodStain ? (
                                        <>
                                            <div style={{
                                                width: '110px', height: '110px', borderRadius: '12px',
                                                border: isSelected ? '2px solid #00598e' : '1px solid #ccc',
                                                padding: '10px',
                                                boxSizing: 'border-box',
                                                marginBottom: '10px',
                                                transition: 'all 0.2s ease-in-out',
                                                backgroundColor: '#fff',
                                                boxShadow: isSelected ? '0 4px 12px rgba(0,89,142,0.2)' : '0 2px 5px rgba(0,0,0,0.05)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                {imgUrl ? (
                                                    <img src={imgUrl} alt={size.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                                ) : (
                                                    <div style={{ color: '#ccc', fontSize: '24px' }}>?</div>
                                                )}
                                            </div>
                                            <div style={{ fontWeight: '500', fontSize: '15px', marginBottom: '4px', color: '#111' }}>
                                                {size.name}
                                            </div>
                                            <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.3' }}>
                                                {size.description || sizeData.fallbackDesc}
                                            </div>
                                        </>
                                    ) : (
                                        <span>
                                            {size.name}
                                            {isAvailable && sizePrices && sizePrices[size.slug] && (
                                                <span style={{ marginLeft: '6px', fontSize: '13px', opacity: 0.85 }}>
                                                    (${parseFloat(sizePrices[size.slug]).toFixed(2)})
                                                </span>
                                            )}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {hasSheens && (!isWoodStain || attributes.sheens.length > 1) && (
                <div style={{ marginBottom: '25px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <label style={{ fontWeight: 'bold' }}>
                            {isWoodStain ? 'Opacity / Finish' : 'Sheen'}
                        </label>
                        {!isWoodStain && (
                        <button
                            onClick={() => setShowSheenModal(true)}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: '#00598e', fontSize: '14px', fontWeight: '500', padding: 0
                            }}
                        >
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                width: '20px', height: '20px', borderRadius: '50%',
                                border: '2px solid #00598e', fontSize: '13px', fontWeight: 'bold'
                            }}>i</span>
                            Help Me Choose
                        </button>
                        )}
                    </div>
                    {!isWoodStain && <SheenCompareModal isOpen={showSheenModal} onClose={() => setShowSheenModal(false)} />}
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        {attributes.sheens.map(sheen => {
                            const isSelected = selectedSheen === sheen.slug;
                            const desc = sheen.description || getSheenDescription(sheen.slug, sheen.name);
                            return (
                                <div
                                    key={sheen.slug}
                                    onClick={() => setSelectedSheen(sheen.slug)}
                                    style={{
                                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                                        cursor: 'pointer', width: '130px', textAlign: 'center'
                                    }}
                                >
                                    <div style={{
                                        width: '110px', height: '110px', borderRadius: '12px',
                                        border: isSelected ? '3px solid #00598e' : '1px solid #ccc',
                                        padding: '4px',
                                        boxSizing: 'border-box',
                                        marginBottom: '10px',
                                        transition: 'all 0.2s ease-in-out',
                                        backgroundColor: '#fff',
                                        boxShadow: isSelected ? '0 4px 12px rgba(0,89,142,0.2)' : '0 2px 5px rgba(0,0,0,0.05)'
                                    }}>
                                        {isWoodStain ? (
                                        <div style={{
                                            width: '100%', height: '100%', borderRadius: '6px',
                                            backgroundColor: '#f4f4f4',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: '#666', fontSize: '11px', textAlign: 'center', padding: '10px',
                                            boxSizing: 'border-box'
                                        }}>
                                            {sheen.name}
                                        </div>
                                        ) : (
                                        <div style={{
                                            ...getSheenStyle(sheen.slug, selectedColor?.hex_value),
                                            width: '100%', height: '100%', borderRadius: '6px'
                                        }} />
                                        )}
                                    </div>
                                    <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px', color: '#333' }}>
                                        {sheen.name}
                                    </div>
                                    {desc && (
                                        <div style={{ fontSize: '12px', color: '#666', lineHeight: '1.3' }}>
                                            {desc}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {shouldFilter && selectedColor && !hasSizes && !hasSheens && (
                <p style={{ color: '#c33', fontStyle: 'italic', margin: '0 0 15px 0' }}>
                    No product options are available for this color combination.
                </p>
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

export default ProductOptions;
