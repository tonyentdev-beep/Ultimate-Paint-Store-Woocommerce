import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { Button, TextControl, PanelBody, PanelRow } from '@wordpress/components';

const BrandsManager = ({ brands, fetchBrands }) => {
    const [newBrandName, setNewBrandName] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleCreateBrand = async () => {
        if (!newBrandName) return;
        setIsSaving(true);
        try {
            await apiFetch({
                path: '/paint-store/v1/brands',
                method: 'POST',
                data: {
                    name: newBrandName
                },
            });
            setNewBrandName('');
            fetchBrands(); // Refresh the list
        } catch (error) {
            console.error('Error creating brand:', error);
        }
        setIsSaving(false);
    };

    return (
        <div className="brands-manager">
            <PanelBody title="Add New Paint Brand" initialOpen={true}>
                <PanelRow>
                    <TextControl
                        label="Brand Name (e.g., Sherwin Williams, Benjamin Moore)"
                        value={newBrandName}
                        onChange={(value) => setNewBrandName(value)}
                    />
                </PanelRow>
                <div style={{ padding: '10px 20px 20px' }}>
                    <Button
                        variant="primary"
                        onClick={handleCreateBrand}
                        isBusy={isSaving}
                        disabled={!newBrandName || isSaving}
                    >
                        Add Brand
                    </Button>
                </div>
            </PanelBody>

            <div style={{ marginTop: '30px' }}>
                <h3>Existing Brands</h3>
                <table className="wp-list-table widefat fixed striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {brands.length === 0 ? (
                            <tr><td colSpan="2">No brands found. Add some above.</td></tr>
                        ) : (
                            brands.map(brand => (
                                <tr key={brand.id}>
                                    <td>{brand.id}</td>
                                    <td><strong>{brand.name}</strong></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BrandsManager;
