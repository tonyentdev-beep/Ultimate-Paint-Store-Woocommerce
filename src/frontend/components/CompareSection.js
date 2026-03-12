import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';

const CompareSection = ({ familyData }) => {
    const [familiesList, setFamiliesList] = useState([]);
    const [comparisonId, setComparisonId] = useState('');
    const [comparisonData, setComparisonData] = useState(null);
    const [isLoadingList, setIsLoadingList] = useState(true);
    const [isLoadingCompare, setIsLoadingCompare] = useState(false);

    useEffect(() => {
        apiFetch({ path: '/paint-store/v1/public/product-families-list' })
            .then(res => setFamiliesList(res))
            .catch(err => console.error(err))
            .finally(() => setIsLoadingList(false));
    }, []);

    useEffect(() => {
        if (!comparisonId) {
            setComparisonData(null);
            return;
        }
        setIsLoadingCompare(true);
        apiFetch({ path: `/paint-store/v1/public/product-families/${comparisonId}` })
            .then(res => setComparisonData(res))
            .catch(err => console.error(err))
            .finally(() => setIsLoadingCompare(false));
    }, [comparisonId]);

    // Check if compare attributes exist
    if (!familyData || !familyData.family || !familyData.family.compare_attributes) {
        return null;
    }

    const family = familyData.family;
    const compare = family.compare_attributes || {};
    const reviewStats = familyData.review_stats;
    const sheens = familyData.attributes?.sheens || [];
    const sizes = familyData.attributes?.sizes || [];
    const variations = familyData.variations || [];

    // Check if the object is empty
    if (Object.keys(compare).length === 0) return null;

    let priceString = 'N/A';
    if (variations.length > 0) {
        const prices = variations.map(v => parseFloat(v.price)).filter(p => !isNaN(p));
        if (prices.length > 0) {
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            priceString = minPrice === maxPrice ? `$${minPrice.toFixed(2)}` : `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;
        }
    }

    const renderBoolean = (val) => {
        return val ? <span style={{ color: '#2ecc71', fontSize: '18px' }}>✅</span> : <span style={{ color: '#e74c3c', fontSize: '18px' }}>❌</span>;
    };

    // --- Comparison Parsers ---
    const compFamily = comparisonData?.family || {};
    const compCompare = compFamily.compare_attributes || {};
    const compReviewStats = comparisonData?.review_stats;
    const compSheens = comparisonData?.attributes?.sheens || [];
    const compSizes = comparisonData?.attributes?.sizes || [];
    const compVariations = comparisonData?.variations || [];

    let compPriceString = 'N/A';
    if (compVariations.length > 0) {
        const prices = compVariations.map(v => parseFloat(v.price)).filter(p => !isNaN(p));
        if (prices.length > 0) {
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            compPriceString = minPrice === maxPrice ? `$${minPrice.toFixed(2)}` : `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;
        }
    }

    const renderCompCellContent = (type, key) => {
        if (!comparisonId) return <span style={{ color: '#999', fontStyle: 'italic', fontSize: '14px' }}>Select a product above to compare</span>;
        if (isLoadingCompare) return <span style={{ color: '#666', fontStyle: 'italic', fontSize: '14px' }}>Loading specifications...</span>;

        if (type === 'price') return <span style={{ fontWeight: 'bold' }}>{compPriceString}</span>;
        if (type === 'rating') {
            return compReviewStats && compReviewStats.total > 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ color: '#ffb400', fontSize: '18px', letterSpacing: '1px' }}>
                        {'★'.repeat(Math.round(compReviewStats.average))}{'☆'.repeat(5 - Math.round(compReviewStats.average))}
                    </span>
                    <span style={{ fontSize: '14px', color: '#666' }}>({compReviewStats.total})</span>
                </div>
            ) : 'No reviews yet';
        }
        if (type === 'sheens') return compSheens.map(s => s.name).join(', ') || 'N/A';
        if (type === 'sizes') return compSizes.map(s => s.name).join(', ') || 'N/A';
        if (type === 'string') return compCompare[key] || 'N/A';
        if (type === 'boolean') return renderBoolean(compCompare[key] === true || compCompare[key] === '1');

        return 'N/A';
    };

    const CompTd = ({ type, dataKey, isSubItem }) => (
        <td style={{ padding: isSubItem ? '10px 20px' : '15px 20px', background: '#fafbfc', borderLeft: '1px solid #eaeaea' }}>
            {renderCompCellContent(type, dataKey)}
        </td>
    );

    return (
        <div id="compare" style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', boxSizing: 'border-box' }}>
            <h2 style={{ fontSize: '28px', color: '#00598E', marginBottom: '20px', textAlign: 'center' }}>Product Specifications</h2>

            <div style={{ overflowX: 'auto', paddingBottom: '20px' }}>
                <table style={{ minWidth: '800px', width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: '#fff', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderRadius: '8px', overflow: 'hidden' }}>
                    <thead>
                        <tr style={{ background: '#f5fbff', borderBottom: '2px solid #00598E' }}>
                            <th style={{ padding: '20px', width: '25%', fontSize: '16px', color: '#333' }}>Feature</th>
                            <th style={{ padding: '20px', width: '37.5%', fontSize: '18px', color: '#00598E' }}>{family.name}</th>
                            <th style={{ padding: '20px', width: '37.5%', fontSize: '16px', background: '#edf7ff', borderLeft: '1px solid #d4ebf2' }}>
                                <select
                                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #b8dae6', background: '#fff', color: '#333', fontSize: '15px', cursor: 'pointer' }}
                                    value={comparisonId}
                                    onChange={(e) => setComparisonId(e.target.value)}
                                    disabled={isLoadingList}
                                >
                                    <option value="">-- Select Product to Compare --</option>
                                    {familiesList.map(f => (
                                        <option key={f.id} value={f.id} disabled={f.id === family.id.toString()}>
                                            {f.name}
                                        </option>
                                    ))}
                                </select>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '15px 20px', fontWeight: 'bold', color: '#555' }}>Price Range</td>
                            <td style={{ padding: '15px 20px', fontSize: '16px', fontWeight: 'bold' }}>{priceString}</td>
                            <CompTd type="price" />
                        </tr>
                        <tr style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '15px 20px', fontWeight: 'bold', color: '#555' }}>Average Rating</td>
                            <td style={{ padding: '15px 20px', fontSize: '16px' }}>
                                {reviewStats && reviewStats.total > 0 ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <span style={{ color: '#ffb400', fontSize: '18px', letterSpacing: '1px' }}>
                                            {'★'.repeat(Math.round(reviewStats.average))}{'☆'.repeat(5 - Math.round(reviewStats.average))}
                                        </span>
                                        <span style={{ fontSize: '14px', color: '#666' }}>({reviewStats.total})</span>
                                    </div>
                                ) : 'No reviews yet'}
                            </td>
                            <CompTd type="rating" />
                        </tr>
                        <tr style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '15px 20px', fontWeight: 'bold', color: '#555' }}>Available Sheens</td>
                            <td style={{ padding: '15px 20px' }}>{sheens.map(s => s.name).join(', ') || 'N/A'}</td>
                            <CompTd type="sheens" />
                        </tr>
                        <tr style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '15px 20px', fontWeight: 'bold', color: '#555' }}>Available Sizes</td>
                            <td style={{ padding: '15px 20px' }}>{sizes.map(s => s.name).join(', ') || 'N/A'}</td>
                            <CompTd type="sizes" />
                        </tr>

                        {(compare.resin_type || comparisonId) && (
                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '15px 20px', fontWeight: 'bold', color: '#555' }}>Resin Type</td>
                                <td style={{ padding: '15px 20px' }}>{compare.resin_type || 'N/A'}</td>
                                <CompTd type="string" dataKey="resin_type" />
                            </tr>
                        )}
                        {(compare.use_location || comparisonId) && (
                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '15px 20px', fontWeight: 'bold', color: '#555' }}>Use Location</td>
                                <td style={{ padding: '15px 20px' }}>{compare.use_location || 'N/A'}</td>
                                <CompTd type="string" dataKey="use_location" />
                            </tr>
                        )}
                        {(compare.max_coverage_area || comparisonId) && (
                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '15px 20px', fontWeight: 'bold', color: '#555' }}>Max Coverage Area</td>
                                <td style={{ padding: '15px 20px' }}>{compare.max_coverage_area || 'N/A'}</td>
                                <CompTd type="string" dataKey="max_coverage_area" />
                            </tr>
                        )}
                        {(compare.dry_to_touch || comparisonId) && (
                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '15px 20px', fontWeight: 'bold', color: '#555' }}>Dry to Touch</td>
                                <td style={{ padding: '15px 20px' }}>{compare.dry_to_touch || 'N/A'}</td>
                                <CompTd type="string" dataKey="dry_to_touch" />
                            </tr>
                        )}
                        <tr style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '15px 20px', fontWeight: 'bold', color: '#555' }}>Mildew Resistant</td>
                            <td style={{ padding: '15px 20px' }}>{renderBoolean(compare.mildew_resistant)}</td>
                            <CompTd type="boolean" dataKey="mildew_resistant" />
                        </tr>
                        <tr style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '15px 20px', fontWeight: 'bold', color: '#555' }}>Washable</td>
                            <td style={{ padding: '15px 20px' }}>{renderBoolean(compare.washable)}</td>
                            <CompTd type="boolean" dataKey="washable" />
                        </tr>
                        <tr style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '15px 20px', fontWeight: 'bold', color: '#555' }}>Pre-Tinted</td>
                            <td style={{ padding: '15px 20px' }}>{renderBoolean(compare.pre_tinted)}</td>
                            <CompTd type="boolean" dataKey="pre_tinted" />
                        </tr>
                        <tr style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '15px 20px', fontWeight: 'bold', color: '#555' }}>GREENGUARD Gold Certified</td>
                            <td style={{ padding: '15px 20px' }}>{renderBoolean(compare.greenguard_gold)}</td>
                            <CompTd type="boolean" dataKey="greenguard_gold" />
                        </tr>

                        <tr style={{ background: '#fcfcfc' }}>
                            <td colSpan="3" style={{ padding: '15px 20px', fontWeight: 'bold', color: '#333', borderBottom: '1px solid #ddd' }}>For Use On:</td>
                        </tr>

                        <tr style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '10px 20px 10px 40px', color: '#666' }}>Trim</td>
                            <td style={{ padding: '10px 20px' }}>{renderBoolean(compare.for_use_on_trim)}</td>
                            <CompTd type="boolean" dataKey="for_use_on_trim" isSubItem={true} />
                        </tr>
                        <tr style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '10px 20px 10px 40px', color: '#666' }}>Wood</td>
                            <td style={{ padding: '10px 20px' }}>{renderBoolean(compare.for_use_on_wood)}</td>
                            <CompTd type="boolean" dataKey="for_use_on_wood" isSubItem={true} />
                        </tr>
                        <tr style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '10px 20px 10px 40px', color: '#666' }}>Metal</td>
                            <td style={{ padding: '10px 20px' }}>{renderBoolean(compare.for_use_on_metal)}</td>
                            <CompTd type="boolean" dataKey="for_use_on_metal" isSubItem={true} />
                        </tr>
                        <tr style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '10px 20px 10px 40px', color: '#666' }}>Drywall</td>
                            <td style={{ padding: '10px 20px' }}>{renderBoolean(compare.for_use_on_drywall)}</td>
                            <CompTd type="boolean" dataKey="for_use_on_drywall" isSubItem={true} />
                        </tr>
                        <tr style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '10px 20px 10px 40px', color: '#666' }}>Concrete/Masonry</td>
                            <td style={{ padding: '10px 20px' }}>{renderBoolean(compare.for_use_on_concrete)}</td>
                            <CompTd type="boolean" dataKey="for_use_on_concrete" isSubItem={true} />
                        </tr>
                        <tr style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '10px 20px 10px 40px', color: '#666' }}>Ceilings</td>
                            <td style={{ padding: '10px 20px' }}>{renderBoolean(compare.for_use_on_ceilings)}</td>
                            <CompTd type="boolean" dataKey="for_use_on_ceilings" isSubItem={true} />
                        </tr>
                        <tr style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '10px 20px 10px 40px', color: '#666' }}>Cabinets</td>
                            <td style={{ padding: '10px 20px' }}>{renderBoolean(compare.for_use_on_cabinets)}</td>
                            <CompTd type="boolean" dataKey="for_use_on_cabinets" isSubItem={true} />
                        </tr>
                        <tr style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '10px 20px 10px 40px', color: '#666' }}>Furniture</td>
                            <td style={{ padding: '10px 20px' }}>{renderBoolean(compare.for_use_on_furniture)}</td>
                            <CompTd type="boolean" dataKey="for_use_on_furniture" isSubItem={true} />
                        </tr>
                        <tr style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '10px 20px 10px 40px', color: '#666' }}>Fiberglass</td>
                            <td style={{ padding: '10px 20px' }}>{renderBoolean(compare.for_use_on_fiberglass)}</td>
                            <CompTd type="boolean" dataKey="for_use_on_fiberglass" isSubItem={true} />
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CompareSection;
