import { useState, useEffect, useMemo } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

import Visualizer from './components/Visualizer';
import ColorBrowser from './components/ColorBrowser';
import ProductOptions from './components/ProductOptions';
import TopBar from './components/TopBar';
import InnerNav from './components/InnerNav';

const App = ({ familyId }) => {
    const [loading, setLoading] = useState(true);
    const [familyData, setFamilyData] = useState(null);
    const [colors, setColors] = useState([]);
    const [colorFamilies, setColorFamilies] = useState([]);
    const [colorBrands, setColorBrands] = useState([]);

    const [selectedSize, setSelectedSize] = useState('');
    const [selectedSheen, setSelectedSheen] = useState('');
    const [selectedColor, setSelectedColor] = useState(null);
    const [activeImageUrl, setActiveImageUrl] = useState('');
    const [galleryPage, setGalleryPage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const [cartMessage, setCartMessage] = useState('');

    useEffect(() => {
        if (!familyId) return;

        const fetchData = async () => {
            try {
                const [familyResponse, colorsResponse, colorFamiliesResponse, colorBrandsResponse] = await Promise.all([
                    apiFetch({ path: `/paint-store/v1/public/product-families/${familyId}` }),
                    apiFetch({ path: '/paint-store/v1/public/colors' }),
                    apiFetch({ path: '/paint-store/v1/public/color-families' }),
                    apiFetch({ path: '/paint-store/v1/public/brands' })
                ]);
                setFamilyData(familyResponse);
                setColors(colorsResponse);
                setColorFamilies(colorFamiliesResponse);
                setColorBrands(colorBrandsResponse);
            } catch (error) {
                console.error('Error fetching builder data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [familyId]);

    // Set default active image when familyData loads
    useEffect(() => {
        if (familyData && familyData.family) {
            if (familyData.family.gallery_images && familyData.family.gallery_images.length > 0) {
                setActiveImageUrl(familyData.family.gallery_images[0].url);
            } else if (familyData.family.image_url) {
                setActiveImageUrl(familyData.family.image_url);
            }
        }
    }, [familyData]);

    // Dynamic SEO meta description based on selected color
    useEffect(() => {
        if (!selectedColor || !selectedColor.description) return;

        let metaTag = document.querySelector('meta[name="description"]');
        const originalContent = metaTag ? metaTag.getAttribute('content') : null;

        if (!metaTag) {
            metaTag = document.createElement('meta');
            metaTag.setAttribute('name', 'description');
            document.head.appendChild(metaTag);
        }

        const familyName = familyData?.family?.name || '';
        metaTag.setAttribute('content', `${selectedColor.name} - ${selectedColor.description} | ${familyName}`);

        // Restore original on cleanup
        return () => {
            if (originalContent !== null) {
                metaTag.setAttribute('content', originalContent);
            } else if (metaTag.parentNode) {
                metaTag.parentNode.removeChild(metaTag);
            }
        };
    }, [selectedColor, familyData]);

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
        if (!hasPhysicalProducts) return { sizes: [], sheens: [] };

        // Build unique sizes and sheens from the physical products being considered
        const sourceProducts = shouldFilter ? validProducts : familyData.ps_products;

        const sizeMap = {};
        const availableSheenMap = {};
        sourceProducts.forEach(p => {
            if (p.size_slug) sizeMap[p.size_slug] = p.size_name;
            if (p.sheen_slug) availableSheenMap[p.sheen_slug] = p.sheen_name;
        });

        const availableSizes = Object.keys(sizeMap).map(slug => ({ slug, name: sizeMap[slug] }));
        const availableSheens = Object.keys(availableSheenMap).map(slug => ({ slug, name: availableSheenMap[slug] }));

        // Ensure we ONLY show sizes explicitly allowed by the Family Rules (if they are defined)
        let sizes = availableSizes;
        if (familyData.family.explicit_size_ids && familyData.family.explicit_size_ids.length > 0) {
            const allowedSizeSlugs = familyData.ps_products
                .filter(p => familyData.family.explicit_size_ids.includes(p.size_id))
                .map(p => p.size_slug);
            sizes = availableSizes.filter(s => allowedSizeSlugs.includes(s.slug));
        }

        // Ensure we ONLY show sheens explicitly allowed by the Family Rules (if they are defined)
        let sheens = availableSheens;
        if (familyData.family.explicit_sheen_ids && familyData.family.explicit_sheen_ids.length > 0) {
            const allowedSheenSlugs = familyData.ps_products
                .filter(p => familyData.family.explicit_sheen_ids.includes(p.sheen_id))
                .map(p => p.sheen_slug);
            sheens = availableSheens.filter(s => allowedSheenSlugs.includes(s.slug));
        }

        return { sizes, sheens };
    }, [familyData, validProducts, shouldFilter, hasPhysicalProducts]);

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

    // Lifted Add To Cart Logic
    const matchedVariation = useMemo(() => {
        if (!selectedSize || !selectedSheen || !filteredVariations) return null;
        return filteredVariations.find(v =>
            v.attributes &&
            v.attributes.attribute_pa_paint_size === selectedSize &&
            v.attributes.attribute_pa_paint_sheen === selectedSheen
        );
    }, [selectedSize, selectedSheen, filteredVariations]);

    const matchedProduct = useMemo(() => {
        if (!selectedSize || !selectedSheen || !validProducts) return null;
        return validProducts.find(p => p.size_slug === selectedSize && p.sheen_slug === selectedSheen);
    }, [selectedSize, selectedSheen, validProducts]);

    const displayPrice = useMemo(() => {
        if (matchedProduct && matchedProduct.price > 0) {
            return '$' + parseFloat(matchedProduct.price).toFixed(2);
        } else if (matchedVariation && matchedVariation.price > 0) {
            return '$' + parseFloat(matchedVariation.price).toFixed(2);
        }
        return '';
    }, [matchedProduct, matchedVariation]);

    const handleAddToCart = async () => {
        if (!selectedSize || !selectedSheen || !selectedColor || !matchedVariation) return;

        setIsAdding(true);
        setCartMessage('');

        try {
            const response = await apiFetch({
                path: '/paint-store/v1/public/add-to-cart',
                method: 'POST',
                data: {
                    product_id: familyData.family.wc_product_id,
                    variation_id: matchedVariation.id,
                    quantity: quantity,
                    color_hex: selectedColor.hex_value,
                    color_name: `${selectedColor.name} (${selectedColor.color_code})`
                }
            });

            if (response.success) {
                setCartMessage('✅ Added to cart successfully!');
                if (typeof jQuery !== 'undefined') {
                    jQuery(document.body).trigger('wc_fragment_refresh');
                    jQuery(document.body).trigger('added_to_cart');
                }
            } else {
                setCartMessage('❌ Failed to add to cart.');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            setCartMessage(`❌ Error: ${error.message || 'Failed to add to cart.'}`);
        }

        setIsAdding(false);
    };

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
        <div className="paint-store-product-builder" style={{ background: '#fff', width: '100%', boxSizing: 'border-box' }}>
            <TopBar
                familyName={familyData.family.name}
                categories={familyData.family.categories}
                displayPrice={displayPrice}
                isAdding={isAdding}
                handleAddToCart={handleAddToCart}
                quantity={quantity}
                setQuantity={setQuantity}
                canAddToCart={!!(selectedSize && selectedSheen && selectedColor && matchedVariation)}
                message={cartMessage}
            />

            <InnerNav />

            {/* Product Images + Colors Section */}
            <div id="review-selections" style={{
                width: '100vw',
                marginLeft: 'calc(-50vw + 50%)',
                boxSizing: 'border-box',
                background: '#fff'
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '100%',
                    margin: '0 auto',
                    display: 'flex',
                    gap: '30px',
                    padding: '30px 20px',
                    alignItems: 'flex-start',
                    boxSizing: 'border-box'
                }}>
                    {/* LEFT COLUMN: 60% - Visualizer + Gallery */}
                    <div style={{ flex: 6, minWidth: 0 }}>
                        <div style={{ position: 'relative' }}>
                            {familyData.family.gallery_images && familyData.family.gallery_images.length > 1 && (
                                <>
                                    {/* Prev Arrow Main */}
                                    {familyData.family.gallery_images.findIndex(img => img.url === activeImageUrl) > 0 && (
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                const idx = familyData.family.gallery_images.findIndex(img => img.url === activeImageUrl);
                                                setActiveImageUrl(familyData.family.gallery_images[idx - 1].url);
                                            }}
                                            style={{
                                                position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', zIndex: 10,
                                                background: 'rgba(255,255,255,0.9)', border: '1px solid #ccc', borderRadius: '50%', width: '40px', height: '40px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', fontSize: '20px'
                                            }}
                                        >
                                            &#8592;
                                        </button>
                                    )}
                                    {/* Next Arrow Main */}
                                    {familyData.family.gallery_images.findIndex(img => img.url === activeImageUrl) < familyData.family.gallery_images.length - 1 && (
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                const idx = familyData.family.gallery_images.findIndex(img => img.url === activeImageUrl);
                                                setActiveImageUrl(familyData.family.gallery_images[idx + 1].url);
                                            }}
                                            style={{
                                                position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', zIndex: 10,
                                                background: 'rgba(255,255,255,0.9)', border: '1px solid #ccc', borderRadius: '50%', width: '40px', height: '40px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', fontSize: '20px'
                                            }}
                                        >
                                            &#8594;
                                        </button>
                                    )}
                                </>
                            )}
                            <Visualizer
                                imageUrl={activeImageUrl}
                                selectedColor={selectedColor}
                            />
                        </div>
                        {familyData.family.gallery_images && familyData.family.gallery_images.length > 1 && (
                            <div style={{ position: 'relative', marginTop: '15px' }}>
                                {/* Left Arrow */}
                                {galleryPage > 0 && (
                                    <button
                                        onClick={(e) => { e.preventDefault(); setGalleryPage(prev => Math.max(0, prev - 1)); }}
                                        style={{
                                            position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 2,
                                            background: 'rgba(255,255,255,0.9)', border: '1px solid #ccc', borderRadius: '50%', width: '30px', height: '30px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        &#8592;
                                    </button>
                                )}

                                {/* Thumbnails Container */}
                                <div style={{ overflow: 'hidden', margin: '0 35px' }}>
                                    <div style={{
                                        display: 'flex', gap: '8px', transition: 'transform 0.3s ease',
                                        transform: `translateX(-${galleryPage * 100}%)`
                                    }}>
                                        {familyData.family.gallery_images.map((img, idx) => (
                                            <img
                                                key={img.id}
                                                src={img.url}
                                                alt={`View ${idx + 1}`}
                                                onClick={() => setActiveImageUrl(img.url)}
                                                style={{
                                                    flex: '0 0 calc(25% - 6px)', // 4 images per page
                                                    height: '70px',
                                                    objectFit: 'contain',
                                                    backgroundColor: '#f9f9f9',
                                                    borderRadius: '6px', cursor: 'pointer',
                                                    border: activeImageUrl === img.url ? '2px solid #00598e' : '1px solid #ddd',
                                                    opacity: activeImageUrl === img.url ? 1 : 0.7,
                                                    transition: 'all 0.2s',
                                                    boxSizing: 'border-box'
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Right Arrow */}
                                {galleryPage < Math.ceil(familyData.family.gallery_images.length / 4) - 1 && (
                                    <button
                                        onClick={(e) => { e.preventDefault(); setGalleryPage(prev => prev + 1); }}
                                        style={{
                                            position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 2,
                                            background: 'rgba(255,255,255,0.9)', border: '1px solid #ccc', borderRadius: '50%', width: '30px', height: '30px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        &#8594;
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Product Options (Size & Sheen) */}
                        <div style={{ marginTop: '30px', background: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
                            <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.2em' }}>Select Options</h3>
                            <ProductOptions
                                attributes={filteredAttributes}
                                selectedSize={selectedSize}
                                setSelectedSize={setSelectedSize}
                                selectedSheen={selectedSheen}
                                setSelectedSheen={setSelectedSheen}
                                selectedColor={selectedColor}
                                shouldFilter={shouldFilter}
                            />
                        </div>

                    </div>

                    {/* RIGHT COLUMN: 40% - Color Browser */}
                    <div style={{ flex: 4, minWidth: 0, overflow: 'hidden', boxSizing: 'border-box' }}>
                        <ColorBrowser
                            colors={colors}
                            colorFamilies={colorFamilies}
                            colorBrands={colorBrands}
                            selectedColor={selectedColor}
                            onColorSelect={setSelectedColor}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
