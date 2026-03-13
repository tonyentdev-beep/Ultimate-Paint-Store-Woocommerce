import { useState, useEffect, useMemo } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

import Visualizer from './components/Visualizer';
import ColorBrowser from './components/ColorBrowser';
import StainBrowser from './components/StainBrowser';
import ProductOptions from './components/ProductOptions';
import ToolOptions from './components/ToolOptions';
import TopBar from './components/TopBar';
import InnerNav from './components/InnerNav';
import OverviewSection from './components/OverviewSection';
import HowToUseSection from './components/HowToUseSection';
import DataSheetsSection from './components/DataSheetsSection';
import CompareSection from './components/CompareSection';
import BrushSpecificationsSection from './components/BrushSpecificationsSection';
import GenericToolOptions from './components/GenericToolOptions';
import QASection from './components/QASection';
import ReviewsSection from './components/ReviewsSection';

const App = ({ familyId }) => {
    const [loading, setLoading] = useState(true);
    const [familyData, setFamilyData] = useState(null);
    const [colors, setColors] = useState([]);
    const [colorFamilies, setColorFamilies] = useState([]);
    const [colorBrands, setColorBrands] = useState([]);

    const [selectedSize, setSelectedSize] = useState('');
    const [selectedSheen, setSelectedSheen] = useState('');
    const [selectedWidth, setSelectedWidth] = useState('');
    const [selectedFulfillment, setSelectedFulfillment] = useState('pickup');
    const [deliveryAddress, setDeliveryAddress] = useState(null);
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

    // Detect if this product family is a Wood Stain
    const isWoodStain = useMemo(() => {
        if (!familyData || !familyData.family || !familyData.family.make_slug) return false;
        const slug = familyData.family.make_slug;
        return slug === 'wood-stains-oil-based' || slug === 'wood-stains-water-based' || slug === 'wood-sealer';
    }, [familyData]);

    const isBrush = useMemo(() => {
        if (!familyData || !familyData.family || !familyData.family.make_slug) return false;
        return familyData.family.make_slug === 'brushes';
    }, [familyData]);

    const isGenericTool = useMemo(() => {
        if (!familyData || !familyData.family || !familyData.family.categories) return false;
        // It's a generic tool if it's in the Tools category but NOT a brush
        const isToolCategory = Array.isArray(familyData.family.categories) 
            ? familyData.family.categories.includes('Tools')
            : (typeof familyData.family.categories === 'string' && familyData.family.categories.includes('Tools'));
        return isToolCategory && !isBrush;
    }, [familyData, isBrush]);

    // Should we apply the smart filter?
    // For Paint: physical SKUs exist AND a color is selected AND the color has base associations
    // For Stains: physical SKUs exist AND a stain is selected
    const shouldFilter = useMemo(() => {
        if (!hasPhysicalProducts) return false;
        if (isBrush || isGenericTool) return false;
        if (!selectedColor) return false;
        if (isWoodStain) return true;
        return selectedColor.base_ids && selectedColor.base_ids.length > 0;
    }, [hasPhysicalProducts, selectedColor, isWoodStain, isBrush, isGenericTool]);

    // Filter ps_products by the selected color's required base_ids (or stain name)
    const validProducts = useMemo(() => {
        if (!hasPhysicalProducts) return [];
        if (!shouldFilter) return familyData.ps_products;
        
        if (isWoodStain) {
            return familyData.ps_products.filter(p => p.color_name === selectedColor.name);
        }
        
        return familyData.ps_products.filter(p =>
            selectedColor.base_ids.includes(p.base_id)
        );
    }, [familyData, selectedColor, hasPhysicalProducts, shouldFilter, isWoodStain]);

    // Derive valid sizes and sheens DIRECTLY from the filtered ps_products
    // Each ps_product now has size_slug, size_name, sheen_slug, sheen_name from the API
    const filteredAttributes = useMemo(() => {
        if (!hasPhysicalProducts) return { sizes: [], sheens: [], widths: [], availableSizeSlugs: [] };

        if (isGenericTool) {
            return { sizes: [], sheens: [], widths: [], availableSizeSlugs: [] };
        }

        if (isBrush) {
            const allWidthMap = {};
            familyData.ps_products.forEach(p => {
                if (p.width_slug) allWidthMap[p.width_slug] = p.width_name;
            });
            const allFamilyWidths = Object.keys(allWidthMap).map(slug => ({ slug, name: allWidthMap[slug] }));
            
            let widths = allFamilyWidths;
            if (familyData.family.explicit_width_ids && familyData.family.explicit_width_ids.length > 0) {
                const allowedWidthSlugs = familyData.ps_products
                    .filter(p => familyData.family.explicit_width_ids.includes(p.width_id))
                    .map(p => p.width_slug);
                widths = allFamilyWidths.filter(s => allowedWidthSlugs.includes(s.slug));
            }
            return { sizes: [], sheens: [], widths, availableSizeSlugs: [] };
        }

        // 1. Get ALL potentially valid sizes for the entire family
        const allSizeMap = {};
        familyData.ps_products.forEach(p => {
            if (p.size_slug) allSizeMap[p.size_slug] = p.size_name;
        });
        const allFamilySizes = Object.keys(allSizeMap).map(slug => ({ slug, name: allSizeMap[slug] }));

        let baseSizes = allFamilySizes;
        if (familyData.family.explicit_size_ids && familyData.family.explicit_size_ids.length > 0) {
            const allowedSizeSlugs = familyData.ps_products
                .filter(p => familyData.family.explicit_size_ids.includes(p.size_id))
                .map(p => p.size_slug);
            baseSizes = allFamilySizes.filter(s => allowedSizeSlugs.includes(s.slug));
        }

        // 2. Identify WHICH of these sizes (and sheens) are available for the *currently selected color*
        const sourceProducts = shouldFilter ? validProducts : familyData.ps_products;

        const sizeMap = {};
        const availableSheenMap = {};
        sourceProducts.forEach(p => {
            if (p.size_slug) sizeMap[p.size_slug] = p.size_name;
            if (p.sheen_slug) availableSheenMap[p.sheen_slug] = p.sheen_name;
        });

        const availableSizeSlugs = Object.keys(sizeMap);
        const availableSheens = Object.keys(availableSheenMap).map(slug => ({ slug, name: availableSheenMap[slug] }));

        // 3. For stains, we show ALL baseSizes (crossing out unavailable). For paint, we only show fully available sizes.
        const sizes = isWoodStain ? baseSizes : baseSizes.filter(s => availableSizeSlugs.includes(s.slug));

        // Ensure we ONLY show sheens explicitly allowed by the Family Rules (if they are defined)
        let sheens = availableSheens;
        if (familyData.family.explicit_sheen_ids && familyData.family.explicit_sheen_ids.length > 0) {
            const allowedSheenSlugs = familyData.ps_products
                .filter(p => familyData.family.explicit_sheen_ids.includes(p.sheen_id))
                .map(p => p.sheen_slug);
            sheens = availableSheens.filter(s => allowedSheenSlugs.includes(s.slug));
        }

        return { sizes, sheens, widths: [], availableSizeSlugs };
    }, [familyData, validProducts, shouldFilter, hasPhysicalProducts, isWoodStain, isBrush, isGenericTool]);

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
        if (!filteredVariations) return null;

        if (isGenericTool) {
            // Generic tools might not even have variations, or they might just match the first available variation if any
            return filteredVariations.length > 0 ? filteredVariations[0] : null;
        }

        if (isBrush) {
            if (!selectedWidth) return null;
            return filteredVariations.find(v => {
                if (!v.attributes) return false;
                // Note: Tools may sync their width to a specific WooCommerce attribute (e.g. pa_paint_size or pa_tool_width)
                // For now we match based on the generic size attribute as implemented in the backend sync.
                return v.attributes.attribute_pa_paint_size === selectedWidth;
            });
        }

        if (!selectedSize) return null;
        if (!isWoodStain && !selectedSheen) return null;

        return filteredVariations.find(v => {
            if (!v.attributes) return false;
            const sizeMatch = v.attributes.attribute_pa_paint_size === selectedSize;
            const sheenMatch = isWoodStain ? (!selectedSheen || v.attributes.attribute_pa_paint_sheen === selectedSheen) : (v.attributes.attribute_pa_paint_sheen === selectedSheen);
            return sizeMatch && sheenMatch;
        });
    }, [selectedSize, selectedSheen, selectedWidth, filteredVariations, isWoodStain, isBrush, isGenericTool]);

    const matchedProduct = useMemo(() => {
        if (!validProducts) return null;

        if (isGenericTool) {
            // Standard single tool product returns the first one in the list
            return validProducts.length > 0 ? validProducts[0] : null;
        }

        if (isBrush) {
            if (!selectedWidth) return null;
            return validProducts.find(p => p.width_slug === selectedWidth);
        }

        if (!selectedSize) return null;
        if (!isWoodStain && !selectedSheen) return null;

        return validProducts.find(p => {
            const sizeMatch = p.size_slug === selectedSize;
            const sheenMatch = isWoodStain ? (!selectedSheen || p.sheen_slug === selectedSheen) : (p.sheen_slug === selectedSheen);
            return sizeMatch && sheenMatch;
        });
    }, [selectedSize, selectedSheen, selectedWidth, validProducts, isWoodStain, isBrush, isGenericTool]);

    // Stock quantity for the specifically matched SKU
    const matchedStockQty = matchedProduct ? parseInt(matchedProduct.stock_quantity, 10) || 0 : 0;

    const displayPrice = useMemo(() => {
        if (matchedProduct && matchedProduct.price > 0) {
            return '$' + parseFloat(matchedProduct.price).toFixed(2);
        } else if (matchedVariation && matchedVariation.price > 0) {
            return '$' + parseFloat(matchedVariation.price).toFixed(2);
        } else if (isWoodStain && selectedColor && validProducts && validProducts.length > 0) {
            let activeProducts = validProducts;
            if (selectedSize) {
                activeProducts = activeProducts.filter(p => p.size_slug === selectedSize);
            }
            if (selectedSheen) {
                activeProducts = activeProducts.filter(p => p.sheen_slug === selectedSheen);
            }
            const prices = activeProducts.map(p => parseFloat(p.price) || 0).filter(p => p > 0);
            if (prices.length > 0) {
                const minPrice = Math.min(...prices);
                const maxPrice = Math.max(...prices);
                if (minPrice === maxPrice) {
                    return '$' + minPrice.toFixed(2);
                } else {
                    return 'From $' + minPrice.toFixed(2);
                }
            }
        }
        return '';
    }, [matchedProduct, matchedVariation, isWoodStain, selectedColor, validProducts, selectedSize, selectedSheen, isBrush, isGenericTool]);

    // Calculate minimum price for each size explicitly for Wood Stains to render on buttons
    const sizePrices = useMemo(() => {
        const pricesMap = {};
        if (isWoodStain && validProducts) {
            validProducts.forEach(p => {
                const pPrice = parseFloat(p.price) || 0;
                if (pPrice > 0 && p.size_slug) {
                    if (!pricesMap[p.size_slug] || pPrice < pricesMap[p.size_slug]) {
                        pricesMap[p.size_slug] = pPrice;
                    }
                }
            });
        }
        return pricesMap;
    }, [isWoodStain, validProducts]);

    const dynamicTitle = useMemo(() => {
        if (!familyData || !familyData.family) return '';
        const baseName = familyData.family.name;
        if (isBrush && selectedWidth) {
            const widthName = filteredAttributes.widths?.find(w => w.slug === selectedWidth)?.name || selectedWidth;
            return `${baseName} - ${widthName}`;
        }
        if (selectedColor && selectedColor.name) {
            return `${baseName} - ${selectedColor.name}`;
        }
        return baseName;
    }, [familyData, selectedColor, isBrush, selectedWidth, filteredAttributes.widths]);

    const displaySku = useMemo(() => {
        if (matchedProduct && matchedProduct.sku) {
            return matchedProduct.sku;
        } else if (matchedVariation && matchedVariation.sku) {
            return matchedVariation.sku;
        }
        return '';
    }, [matchedProduct, matchedVariation]);

    const handleAddToCart = async () => {
        if (isGenericTool) {
            if (!matchedProduct) return;
        } else if (isBrush) {
            if (!selectedWidth || !matchedProduct) return;
        } else {
            if (!selectedSize || !selectedColor || !matchedVariation) return;
            if (!isWoodStain && !selectedSheen) return;
        }

        if (selectedFulfillment === 'delivery' && (!deliveryAddress || !deliveryAddress.address)) {
            setCartMessage('❌ Please select a valid delivery address before adding to cart.');
            return;
        }

        setIsAdding(true);
        setCartMessage('');

        try {
            const formData = new URLSearchParams();
            formData.append('action', 'paint_store_add_to_cart');
            formData.append('product_id', familyData.family.wc_product_id);
            formData.append('variation_id', matchedVariation ? matchedVariation.id : 0);
            formData.append('quantity', quantity);
            
            if (isGenericTool) {
                // Generic tool, no special metadata needed except price
            } else if (isBrush) {
                formData.append('ps_custom_width', matchedProduct.width_name);
            } else {
                formData.append('color_hex', selectedColor.hex_value);
                formData.append('color_name', `${selectedColor.name} (${selectedColor.color_code})`);
            }
            
            formData.append('item_price', matchedProduct?.price || matchedVariation?.price || 0);

            // Fulfillment metadata
            formData.append('fulfillment_method', selectedFulfillment);
            if (selectedFulfillment === 'delivery' && deliveryAddress) {
                formData.append('delivery_address', deliveryAddress.address);
                formData.append('delivery_fee', deliveryAddress.deliveryFee || 0);
            }

            const ajaxUrl = window.paintStoreSettings?.ajaxUrl || '/wp-admin/admin-ajax.php';

            const response = await fetch(ajaxUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                setCartMessage('✅ Added to cart successfully!');
                if (typeof jQuery !== 'undefined') {
                    jQuery(document.body).trigger('wc_fragment_refresh');
                    jQuery(document.body).trigger('added_to_cart');
                }
            } else {
                setCartMessage(`❌ ${data.data?.message || 'Failed to add to cart.'}`);
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            setCartMessage(`❌ Error: ${error.message || 'Failed to add to cart.'}`);
        }

        setIsAdding(false);
    };

    // Calculate global cart validation state for the TopBar
    const canAddToCart = useMemo(() => {
        if (!familyData || !familyData.family) return false;
        if (isGenericTool) return !!matchedProduct;
        if (isBrush) return !!(selectedWidth && matchedProduct);
        return !!(selectedSize && selectedSheen && selectedColor && matchedVariation);
    }, [isGenericTool, isBrush, selectedWidth, matchedProduct, selectedSize, selectedSheen, selectedColor, matchedVariation, familyData]);

    return (
        <div className="paint-store-product-builder" style={{ background: '#fff', width: '100%', boxSizing: 'border-box' }}>
            <TopBar
                familyName={familyData.family.name}
                dynamicTitle={dynamicTitle}
                categories={familyData.family.categories}
                displayPrice={displayPrice}
                isAdding={isAdding}
                handleAddToCart={handleAddToCart}
                quantity={quantity}
                setQuantity={setQuantity}
                canAddToCart={canAddToCart}
                message={cartMessage}
                reviewStats={familyData.review_stats}
            />

            {(!isBrush && !isGenericTool) && <InnerNav />}

            {/* Product Images + Colors Section */}
            <div id="review-selections" style={{
                width: '100vw',
                marginLeft: 'calc(-50vw + 50%)',
                boxSizing: 'border-box',
                background: '#fff'
            }}>
                <div className="ps-product-main-layout" style={{
                    width: '100%',
                    maxWidth: '100%',
                    margin: '0 auto',
                    display: 'flex',
                    gap: '30px',
                    padding: '30px 20px',
                    alignItems: 'flex-start',
                    boxSizing: 'border-box'
                }}>
                    {/* LEFT COLUMN: 60% - Visualizer + Gallery (Sticky) */}
                    <div className="ps-product-left-col" style={{ flex: 6, minWidth: 0, position: 'sticky', top: '20px' }}>
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

                    </div>

                    {/* RIGHT COLUMN: 40% - Color/Stain Browser */}
                    <div className="ps-product-right-col" style={{ flex: 4, minWidth: 0, overflow: 'hidden', boxSizing: 'border-box' }}>
                        
                        {/* Selected Product Title & SKU Display */}
                        <div style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>
                            <h2 style={{ fontSize: '22px', margin: '0 0 8px 0', color: '#111', lineHeight: '1.3' }}>
                                {dynamicTitle}
                            </h2>
                            <div style={{ fontSize: '14px', color: '#666', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontWeight: '600' }}>SKU:</span> 
                                {displaySku ? (
                                    <span style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '2px 8px', borderRadius: '4px' }}>{displaySku}</span>
                                ) : (
                                    <span style={{ fontStyle: 'italic', opacity: 0.7 }}>Select options to view</span>
                                )}
                            </div>
                        </div>

                        {isGenericTool ? (
                            <div style={{ marginTop: '20px', background: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
                                <GenericToolOptions
                                    selectedFulfillment={selectedFulfillment}
                                    setSelectedFulfillment={setSelectedFulfillment}
                                    matchedStockQty={matchedStockQty}
                                    deliveryAddress={deliveryAddress}
                                    onDeliveryAddressChange={setDeliveryAddress}
                                />
                                <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden' }}>
                                            <button 
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                style={{ padding: '10px 15px', background: '#f9f9f9', border: 'none', borderRight: '1px solid #ccc', cursor: 'pointer', fontSize: '16px' }}
                                            >-</button>
                                            <span style={{ padding: '0 20px', fontWeight: 'bold' }}>{quantity}</span>
                                            <button 
                                                onClick={() => setQuantity(quantity + 1)}
                                                style={{ padding: '10px 15px', background: '#f9f9f9', border: 'none', borderLeft: '1px solid #ccc', cursor: 'pointer', fontSize: '16px' }}
                                            >+</button>
                                        </div>
                                        <button 
                                            onClick={handleAddToCart}
                                            disabled={!canAddToCart || isAdding}
                                            style={{
                                                flex: 1,
                                                padding: '14px 24px',
                                                background: (!canAddToCart || isAdding) ? '#ccc' : '#00598e',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '4px',
                                                fontSize: '16px',
                                                fontWeight: 'bold',
                                                cursor: (!canAddToCart || isAdding) ? 'not-allowed' : 'pointer',
                                                transition: 'background 0.2s'
                                            }}
                                        >
                                            {isAdding ? 'Adding to Cart...' : `Add to Cart - ${displayPrice}`}
                                        </button>
                                    </div>
                                    {cartMessage && (
                                        <p style={{ marginTop: '10px', color: cartMessage.includes('❌') ? '#d63638' : '#00a32a', fontWeight: '500' }}>
                                            {cartMessage}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ) : isBrush ? (
                            <div style={{ marginTop: '20px', background: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
                                <ToolOptions
                                    attributes={filteredAttributes}
                                    selectedWidth={selectedWidth}
                                    setSelectedWidth={setSelectedWidth}
                                    selectedFulfillment={selectedFulfillment}
                                    setSelectedFulfillment={setSelectedFulfillment}
                                    matchedStockQty={matchedStockQty}
                                    deliveryAddress={deliveryAddress}
                                    onDeliveryAddressChange={setDeliveryAddress}
                                />
                                <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden' }}>
                                            <button 
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                style={{ padding: '10px 15px', background: '#f9f9f9', border: 'none', borderRight: '1px solid #ccc', cursor: 'pointer', fontSize: '16px' }}
                                            >-</button>
                                            <span style={{ padding: '0 20px', fontWeight: 'bold' }}>{quantity}</span>
                                            <button 
                                                onClick={() => setQuantity(quantity + 1)}
                                                style={{ padding: '10px 15px', background: '#f9f9f9', border: 'none', borderLeft: '1px solid #ccc', cursor: 'pointer', fontSize: '16px' }}
                                            >+</button>
                                        </div>
                                        <button 
                                            onClick={handleAddToCart}
                                            disabled={!canAddToCart || isAdding}
                                            style={{
                                                flex: 1,
                                                padding: '14px 24px',
                                                background: (!canAddToCart || isAdding) ? '#ccc' : '#00598e',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '4px',
                                                fontSize: '16px',
                                                fontWeight: 'bold',
                                                cursor: (!canAddToCart || isAdding) ? 'not-allowed' : 'pointer',
                                                transition: 'background 0.2s'
                                            }}
                                        >
                                            {isAdding ? 'Adding to Cart...' : `Add to Cart - ${displayPrice}`}
                                        </button>
                                    </div>
                                    {cartMessage && (
                                        <p style={{ marginTop: '10px', color: cartMessage.includes('❌') ? '#d63638' : '#00a32a', fontWeight: '500' }}>
                                            {cartMessage}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <>
                                {isWoodStain ? (
                                    <StainBrowser 
                                        psProducts={familyData.ps_products}
                                        selectedStain={selectedColor}
                                        onStainSelect={setSelectedColor}
                                    />
                                ) : (
                                    <ColorBrowser
                                        colors={colors}
                                        colorFamilies={colorFamilies}
                                        colorBrands={colorBrands}
                                        selectedColor={selectedColor}
                                        onColorSelect={setSelectedColor}
                                    />
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
                                        isWoodStain={isWoodStain}
                                        selectedFulfillment={selectedFulfillment}
                                        setSelectedFulfillment={setSelectedFulfillment}
                                        matchedStockQty={matchedStockQty}
                                        deliveryAddress={deliveryAddress}
                                        onDeliveryAddressChange={setDeliveryAddress}
                                        sizePrices={sizePrices}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Overview Section */}
            <OverviewSection description={familyData.family.description} />

            {/* How To Use Section */}
            <HowToUseSection content={familyData.family.how_to_use} />

            {/* Data Sheets Section */}
            <DataSheetsSection datasheets={familyData.family.datasheets} />

            {/* Compare / Specifications Section */}
            {familyData.family.make_slug === 'brushes' ? (
                <BrushSpecificationsSection familyData={familyData} />
            ) : (
                <CompareSection familyData={familyData} />
            )}

            {/* Reviews Section */}
            <ReviewsSection familyId={familyId} />

            {/* Community Q & A Section */}
            <QASection familyData={familyData} />
        </div>
    );
};

export default App;
