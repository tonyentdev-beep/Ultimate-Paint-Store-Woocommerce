import { useState } from '@wordpress/element';
import ColorFamilies from './colors/ColorFamilies';

const App = () => {
    const [activeTab, setActiveTab] = useState('colors');

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
                        <ColorFamilies />
                    </div>
                )}

                {activeTab === 'products' && (
                    <div>
                        <h2>Manage Products</h2>
                        <p>Product mapping and bases interface will go here.</p>
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
