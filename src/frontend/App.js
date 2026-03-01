import { useState, useEffect, useMemo } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

import Visualizer from './components/Visualizer';
import ColorBrowser from './components/ColorBrowser';
import ProductOptions from './components/ProductOptions';
import AddToCart from './components/AddToCart';

const App = ({ familyId }) => {
    const [loading, setLoading] = useState(true);
    const [familyData, setFamilyData] = useState(null);
    const [colors, setColors] = useState([]);

    // User Selections
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedSheen, setSelectedSheen] = useState('');
    const [selectedColor, setSelectedColor] = useState(null);

    useEffect(() => {
        if (!familyId) return;

        const fetchData = async () => {
            try {
                const [familyResponse, colorsResponse] = await Promise.all([
                    apiFetch({ path: `/paint-store/v1/public/product-families/${familyId}` }),
                    apiFetch({ path: '/paint-store/v1/public/colors' })
                ]);
                setFamilyData(familyResponse);
                setColors(colorsResponse);
            } catch (error) {
                console.error('Error fetching builder data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [familyId]);

    // When a color is selected, filter the ps_products to only those
    // whose base_id matches one of the color's required base_ids.
    // Then filter the WooCommerce variations to only those whose
    // variation ID matches a valid ps_product's woo_product_id.
    const validProducts = useMemo(() => {
        if (!familyData || !familyData.ps_products) return [];
        if (!selectedColor || !selectedColor.base_ids || selectedColor.base_ids.length === 0) {
            // No color selected yet — show all products
            return familyData.ps_products;
        }
        return familyData.ps_products.filter(p =>
            selectedColor.base_ids.includes(p.base_id)
        );
    }, [familyData, selectedColor]);

    // Extract valid WooCommerce variation IDs from the filtered physical products
    const validVariationIds = useMemo(() => {
        return validProducts
            .map(p => p.woo_product_id)
            .filter(id => id > 0);
    }, [validProducts]);

    // Filter the WooCommerce variations to only those that are valid
    const filteredVariations = useMemo(() => {
        if (!familyData || !familyData.variations) return [];
        if (validVariationIds.length === 0) return familyData.variations;
        return familyData.variations.filter(v => validVariationIds.includes(v.id));
    }, [familyData, validVariationIds]);

    // Build filtered attributes (sizes and sheens) from the filtered variations
    const filteredAttributes = useMemo(() => {
        if (!familyData || !familyData.attributes) return { sizes: [], sheens: [] };

        // Extract the unique size slugs and sheen slugs from filtered variations
        const validSizeSlugs = new Set();
        const validSheenSlugs = new Set();
        filteredVariations.forEach(v => {
            if (v.attributes && v.attributes.attribute_pa_paint_size) {
                validSizeSlugs.add(v.attributes.attribute_pa_paint_size);
            }
            if (v.attributes && v.attributes.attribute_pa_paint_sheen) {
                validSheenSlugs.add(v.attributes.attribute_pa_paint_sheen);
            }
        });

        // If no filtered variations yet (e.g. no color selected), show all
        const sizes = validSizeSlugs.size > 0
            ? familyData.attributes.sizes.filter(s => validSizeSlugs.has(s.slug))
            : familyData.attributes.sizes;
        const sheens = validSheenSlugs.size > 0
            ? familyData.attributes.sheens.filter(s => validSheenSlugs.has(s.slug))
            : familyData.attributes.sheens;

        return { sizes, sheens };
    }, [familyData, filteredVariations]);

    // Reset size/sheen when color changes and they become unavailable
    useEffect(() => {
        if (selectedSize && !filteredAttributes.sizes.find(s => s.slug === selectedSize)) {
            setSelectedSize('');
        }
        if (selectedSheen && !filteredAttributes.sheens.find(s => s.slug === selectedSheen)) {
            setSelectedSheen('');
        }
    }, [filteredAttributes]);

    if (!familyId) {
        return <div className="ps-builder-error">Error: No Product Family ID provided.</div>;
    }

    if (loading) {
        return <div className="ps-builder-loading" style={{ padding: '40px', textAlign: 'center' }}>Loading Product Data...</div>;
    }

    if (!familyData || !familyData.family) {
        return <div className="ps-builder-error">Error: Failed to load Product Family data.</div>;
    }

    return (
        <div className="paint-store-product-builder">
            <h2 style={{ marginBottom: '5px' }}>{familyData.family.name}</h2>
            <p style={{ color: '#666', marginTop: 0 }} dangerouslySetInnerHTML={{ __html: familyData.family.description }} />

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', marginTop: '30px' }}>
                <div style={{ flex: '1 1 300px', maxWidth: '400px' }}>
                    <Visualizer
                        imageUrl={familyData.family.image_url}
                        selectedColor={selectedColor}
                    />
                    <ProductOptions
                        attributes={filteredAttributes}
                        selectedSize={selectedSize}
                        setSelectedSize={setSelectedSize}
                        selectedSheen={selectedSheen}
                        setSelectedSheen={setSelectedSheen}
                        selectedColor={selectedColor}
                    />
                    <AddToCart
                        familyId={familyData.family.wc_product_id}
                        variations={filteredVariations}
                        selectedSize={selectedSize}
                        selectedSheen={selectedSheen}
                        selectedColor={selectedColor}
                    />
                </div>
                <div style={{ flex: '2 1 400px' }}>
                    <ColorBrowser
                        colors={colors}
                        selectedColor={selectedColor}
                        onColorSelect={setSelectedColor}
                    />
                </div>
            </div>
        </div>
    );
};

export default App;
