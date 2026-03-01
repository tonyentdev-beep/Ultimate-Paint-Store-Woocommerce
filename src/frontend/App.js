import { useState, useEffect } from '@wordpress/element';
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
                        attributes={familyData.attributes}
                        selectedSize={selectedSize}
                        setSelectedSize={setSelectedSize}
                        selectedSheen={selectedSheen}
                        setSelectedSheen={setSelectedSheen}
                    />
                    <AddToCart
                        familyId={familyData.family.wc_product_id}
                        variations={familyData.variations}
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
