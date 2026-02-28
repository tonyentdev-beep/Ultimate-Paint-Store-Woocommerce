import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import ColorFamilies from './colors/ColorFamilies';
import ColorsManager from './colors/ColorsManager';
import BrandsManager from './colors/BrandsManager';
import BasesManager from './products/BasesManager';

const App = () => {
    const [activeTab, setActiveTab] = useState('colors');

    // Shared State
    const [brands, setBrands] = useState([]);
    const [families, setFamilies] = useState([]);
    const [bases, setBases] = useState([]);
    const [colors, setColors] = useState([]);

    // Initial Fetch All
    useEffect(() => {
        fetchBrands();
        fetchFamilies();
        fetchBases();
        fetchColors();
    }, []);

    const fetchBrands = async () => {
        try {
            const data = await apiFetch({ path: '/paint-store/v1/brands' });
            setBrands(data);
        } catch (error) {
            console.error('Error fetching brands:', error);
        }
    };

    const fetchFamilies = async () => {
        try {
            const data = await apiFetch({ path: '/paint-store/v1/families' });
            setFamilies(data);
        } catch (error) {
            console.error('Error fetching families:', error);
        }
    };

    const fetchBases = async () => {
        try {
            const data = await apiFetch({ path: '/paint-store/v1/bases' });
            setBases(data);
        } catch (error) {
            console.error('Error fetching bases:', error);
        }
    };

    const fetchColors = async () => {
        try {
            const data = await apiFetch({ path: '/paint-store/v1/colors' });
            setColors(data);
        } catch (error) {
            console.error('Error fetching colors:', error);
        }
    };

    return (
        <div className="paint-store-admin-wrap">
            <h1>Paint Store Management</h1>

            <div className="nav-tab-wrapper" style={{ marginBottom: '20px' }}>
                <button
                    className={`nav-tab ${activeTab === 'colors' ? 'nav-tab-active' : ''}`}
                    onClick={() => setActiveTab('colors')}
                >
                    Colors & Families
                </button>
                <button
                    className={`nav-tab ${activeTab === 'products' ? 'nav-tab-active' : ''}`}
                    onClick={() => setActiveTab('products')}
                >
                    Products & Bases
                </button>
                <button
                    className={`nav-tab ${activeTab === 'settings' ? 'nav-tab-active' : ''}`}
                    onClick={() => setActiveTab('settings')}
                >
                    Settings
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'colors' && (
                    <div>
                        <BrandsManager brands={brands} fetchBrands={fetchBrands} />
                        <hr style={{ margin: '40px 0' }} />
                        <ColorFamilies families={families} fetchFamilies={fetchFamilies} />
                        <hr style={{ margin: '40px 0' }} />
                        <ColorsManager
                            colors={colors}
                            families={families}
                            allBases={bases}
                            brands={brands}
                            fetchColors={fetchColors}
                        />
                    </div>
                )}

                {activeTab === 'products' && (
                    <div>
                        <BasesManager bases={bases} fetchBases={fetchBases} />
                        <hr style={{ margin: '40px 0' }} />
                        <h2>Manage Products (Coming Soon)</h2>
                        <p>Product mapping interface will go here.</p>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div>
                        <h2>Store Settings</h2>
                        <p>General store settings.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
