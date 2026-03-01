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

    // Do we have explicit physical products defined for this family?
    const hasPhysicalProducts = familyData && familyData.ps_products && familyData.ps_products.length > 0;

    // Should we apply the smart filter?
    // Only if: physical SKUs exist AND a color is selected AND the color has base associations
    const shouldFilter = hasPhysicalProducts
        && selectedColor
        && selectedColor.base_ids
        && selectedColor.base_ids.length > 0;

    // Filter ps_products by the selected color's required base_ids
    const validProducts = useMemo(() => {
        if (!hasPhysicalProducts) return [];
        if (!shouldFilter) return familyData.ps_products;
        return familyData.ps_products.filter(p =>
            selectedColor.base_ids.includes(p.base_id)
        );
    }, [familyData, selectedColor, hasPhysicalProducts, shouldFilter]);

    // Derive valid sizes and sheens DIRECTLY from the filtered ps_products
    // Each ps_product now has size_slug, size_name, sheen_slug, sheen_name from the API
    const filteredAttributes = useMemo(() => {
        if (!familyData || !familyData.attributes) return { sizes: [], sheens: [] };

        // If not filtering, show all WooCommerce attributes as normal
        if (!shouldFilter) {
            return familyData.attributes;
        }

        // Build unique sizes and sheens from the valid physical products
        const sizeMap = {};
        const sheenMap = {};
        validProducts.forEach(p => {
            if (p.size_slug) sizeMap[p.size_slug] = p.size_name;
            if (p.sheen_slug) sheenMap[p.sheen_slug] = p.sheen_name;
        });

        const sizes = Object.keys(sizeMap).map(slug => ({ slug, name: sizeMap[slug] }));
        const sheens = Object.keys(sheenMap).map(slug => ({ slug, name: sheenMap[slug] }));

        // If the filter produced no sizes/sheens (no matching physical products),
        // fall back to showing everything
        if (sizes.length === 0 && sheens.length === 0) {
            return familyData.attributes;
        }

        return { sizes, sheens };
    }, [familyData, validProducts, shouldFilter]);

    // Filter WooCommerce variations to only those matching the valid size/sheen slugs
    const filteredVariations = useMemo(() => {
        if (!familyData || !familyData.variations) return [];
        if (!shouldFilter) return familyData.variations;

        const validSizeSlugs = new Set(filteredAttributes.sizes.map(s => s.slug));
        const validSheenSlugs = new Set(filteredAttributes.sheens.map(s => s.slug));

        const filtered = familyData.variations.filter(v => {
            const vSize = v.attributes && v.attributes.attribute_pa_paint_size;
            const vSheen = v.attributes && v.attributes.attribute_pa_paint_sheen;
            const sizeOk = !vSize || validSizeSlugs.has(vSize);
            const sheenOk = !vSheen || validSheenSlugs.has(vSheen);
            return sizeOk && sheenOk;
        });

        return filtered.length > 0 ? filtered : familyData.variations;
    }, [familyData, filteredAttributes, shouldFilter]);

    // Reset size/sheen when color changes and they become unavailable
    useEffect(() => {
        if (shouldFilter) {
            if (selectedSize && !filteredAttributes.sizes.find(s => s.slug === selectedSize)) {
                setSelectedSize('');
            }
            if (selectedSheen && !filteredAttributes.sheens.find(s => s.slug === selectedSheen)) {
                setSelectedSheen('');
            }
        }
    }, [filteredAttributes, shouldFilter]);

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
                        shouldFilter={shouldFilter}
                    />
                    <AddToCart
                        familyId={familyData.family.wc_product_id}
                        variations={filteredVariations}
                        selectedSize={selectedSize}
                        selectedSheen={selectedSheen}
                        selectedColor={selectedColor}
                        validProducts={validProducts}
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
