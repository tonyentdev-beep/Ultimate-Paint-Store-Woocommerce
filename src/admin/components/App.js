import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import ColorFamilies from './colors/ColorFamilies';
import ColorsManager from './colors/ColorsManager';
import BrandsManager from './colors/BrandsManager';
import ColorImporter from './colors/ColorImporter';
import BasesManager from './products/BasesManager';
import ProductFamiliesManager from './products/ProductFamiliesManager';
import ProductCategoriesManager from './products/ProductCategoriesManager';
import SizesManager from './products/SizesManager';
import SheensManager from './products/SheensManager';
import SurfaceTypesManager from './products/SurfaceTypesManager';
import SceneImagesManager from './products/SceneImagesManager';
import ProductBrandsManager from './products/ProductBrandsManager';
import Dashboard from './Dashboard';
import Settings from './Settings';

const App = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [activeColorSubTab, setActiveColorSubTab] = useState('brands');
    const [activeProductSubTab, setActiveProductSubTab] = useState('bases');

    // Shared State
    const [brands, setBrands] = useState([]);
    const [families, setFamilies] = useState([]);
    const [bases, setBases] = useState([]);
    const [colors, setColors] = useState([]);
    const [productFamilies, setProductFamilies] = useState([]);
    const [productCategories, setProductCategories] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [sheens, setSheens] = useState([]);
    const [surfaceTypes, setSurfaceTypes] = useState([]);
    const [sceneImages, setSceneImages] = useState([]);
    const [productBrands, setProductBrands] = useState([]);

    // Initial Fetch All
    useEffect(() => {
        fetchBrands();
        fetchFamilies();
        fetchBases();
        fetchColors();
        fetchProductFamilies();
        fetchProductCategories();
        fetchSizes();
        fetchSheens();
        fetchSurfaceTypes();
        fetchSceneImages();
        fetchProductBrands();
    }, []);

    const fetchBrands = async () => {
        try { const data = await apiFetch({ path: '/paint-store/v1/brands' }); setBrands(data); }
        catch (error) { console.error('Error fetching brands:', error); }
    };
    const fetchFamilies = async () => {
        try { const data = await apiFetch({ path: '/paint-store/v1/families' }); setFamilies(data); }
        catch (error) { console.error('Error fetching families:', error); }
    };
    const fetchBases = async () => {
        try { const data = await apiFetch({ path: '/paint-store/v1/bases' }); setBases(data); }
        catch (error) { console.error('Error fetching bases:', error); }
    };
    const fetchColors = async () => {
        try { const data = await apiFetch({ path: '/paint-store/v1/colors' }); setColors(data); }
        catch (error) { console.error('Error fetching colors:', error); }
    };
    const fetchProductFamilies = async () => {
        try { const data = await apiFetch({ path: '/paint-store/v1/product-families' }); setProductFamilies(data); }
        catch (error) { console.error('Error fetching product families:', error); }
    };
    const fetchProductCategories = async () => {
        try { const data = await apiFetch({ path: '/paint-store/v1/product-categories' }); setProductCategories(data); }
        catch (error) { console.error('Error fetching product categories:', error); }
    };
    const fetchSizes = async () => {
        try { const data = await apiFetch({ path: '/paint-store/v1/sizes' }); setSizes(data); }
        catch (error) { console.error('Error fetching sizes:', error); }
    };
    const fetchSheens = async () => {
        try { const data = await apiFetch({ path: '/paint-store/v1/sheens' }); setSheens(data); }
        catch (error) { console.error('Error fetching sheens:', error); }
    };
    const fetchSurfaceTypes = async () => {
        try { const data = await apiFetch({ path: '/paint-store/v1/surface-types' }); setSurfaceTypes(data); }
        catch (error) { console.error('Error fetching surface types:', error); }
    };
    const fetchSceneImages = async () => {
        try { const data = await apiFetch({ path: '/paint-store/v1/scene-images' }); setSceneImages(data); }
        catch (error) { console.error('Error fetching scene images:', error); }
    };
    const fetchProductBrands = async () => {
        try { const data = await apiFetch({ path: '/paint-store/v1/product-brands' }); setProductBrands(data); }
        catch (error) { console.error('Error fetching product brands:', error); }
    };


    const productSubTabs = [
        { key: 'product-brands', label: 'Product Brands' },
        { key: 'bases', label: 'Paint Bases' },
        { key: 'product-families', label: 'Product Families' },
        { key: 'product-categories', label: 'Product Categories' },
        { key: 'sizes', label: 'Sizes' },
        { key: 'sheens', label: 'Sheens' },
        { key: 'surface-types', label: 'Surface Types' },
        { key: 'scene-images', label: 'Scene Images' },
    ];

    return (
        <div className="paint-store-admin-wrap">
            <h1>Paint Store Management</h1>

            <div className="nav-tab-wrapper" style={{ marginBottom: '20px' }}>
                <button
                    className={`nav-tab ${activeTab === 'dashboard' ? 'nav-tab-active' : ''}`}
                    onClick={() => setActiveTab('dashboard')}
                >
                    Dashboard
                </button>
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
                {activeTab === 'dashboard' && (
                    <Dashboard />
                )}

                {activeTab === 'colors' && (
                    <div>
                        <ul className="subsubsub" style={{ marginBottom: '20px', fontSize: '14px' }}>
                            <li>
                                <a href="#" className={activeColorSubTab === 'brands' ? 'current' : ''}
                                    onClick={(e) => { e.preventDefault(); setActiveColorSubTab('brands'); }}>
                                    Paint Brands
                                </a> |
                            </li>
                            <li>
                                <a href="#" className={activeColorSubTab === 'families' ? 'current' : ''}
                                    onClick={(e) => { e.preventDefault(); setActiveColorSubTab('families'); }}>
                                    Color Families
                                </a> |
                            </li>
                            <li>
                                <a href="#" className={activeColorSubTab === 'colors' ? 'current' : ''}
                                    onClick={(e) => { e.preventDefault(); setActiveColorSubTab('colors'); }}>
                                    Specific Colors
                                </a> |
                            </li>
                            <li>
                                <a href="#" className={activeColorSubTab === 'import' ? 'current' : ''}
                                    onClick={(e) => { e.preventDefault(); setActiveColorSubTab('import'); }}>
                                    📥 Import Colors
                                </a>
                            </li>
                        </ul>
                        <div className="clear"></div>

                        {activeColorSubTab === 'brands' && (
                            <BrandsManager brands={brands} fetchBrands={fetchBrands} />
                        )}
                        {activeColorSubTab === 'families' && (
                            <ColorFamilies families={families} fetchFamilies={fetchFamilies} />
                        )}
                        {activeColorSubTab === 'colors' && (
                            <ColorsManager
                                colors={colors}
                                families={families}
                                allBases={bases}
                                brands={brands}
                                fetchColors={fetchColors}
                            />
                        )}
                        {activeColorSubTab === 'import' && (
                            <ColorImporter
                                brands={brands}
                                families={families}
                                allBases={bases}
                                fetchColors={fetchColors}
                            />
                        )}
                    </div>
                )}

                {activeTab === 'products' && (
                    <div>
                        <ul className="subsubsub" style={{ marginBottom: '20px', fontSize: '14px' }}>
                            {productSubTabs.map((tab, idx) => (
                                <li key={tab.key}>
                                    <a href="#"
                                        className={activeProductSubTab === tab.key ? 'current' : ''}
                                        onClick={(e) => { e.preventDefault(); setActiveProductSubTab(tab.key); }}>
                                        {tab.label}
                                    </a>
                                    {idx < productSubTabs.length - 1 ? ' | ' : ''}
                                </li>
                            ))}
                        </ul>
                        <div className="clear"></div>

                        {activeProductSubTab === 'product-brands' && (
                            <ProductBrandsManager productBrands={productBrands} fetchProductBrands={fetchProductBrands} />
                        )}
                        {activeProductSubTab === 'bases' && (
                            <BasesManager bases={bases} fetchBases={fetchBases} />
                        )}
                        {activeProductSubTab === 'product-families' && (
                            <ProductFamiliesManager
                                productFamilies={productFamilies}
                                productBrands={productBrands}
                                sizes={sizes}
                                sheens={sheens}
                                surfaceTypes={surfaceTypes}
                                fetchProductFamilies={fetchProductFamilies}
                            />
                        )}
                        {activeProductSubTab === 'product-categories' && (
                            <ProductCategoriesManager productCategories={productCategories} fetchProductCategories={fetchProductCategories} />
                        )}
                        {activeProductSubTab === 'sizes' && (
                            <SizesManager sizes={sizes} fetchSizes={fetchSizes} />
                        )}
                        {activeProductSubTab === 'sheens' && (
                            <SheensManager sheens={sheens} fetchSheens={fetchSheens} />
                        )}
                        {activeProductSubTab === 'surface-types' && (
                            <SurfaceTypesManager surfaceTypes={surfaceTypes} fetchSurfaceTypes={fetchSurfaceTypes} />
                        )}
                        {activeProductSubTab === 'scene-images' && (
                            <SceneImagesManager sceneImages={sceneImages} fetchSceneImages={fetchSceneImages} />
                        )}
                    </div>
                )}

                {activeTab === 'settings' && (
                    <Settings />
                )}
            </div>
        </div>
    );
};

export default App;
