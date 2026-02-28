import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { Button, TextControl, PanelBody, PanelRow } from '@wordpress/components';

const BrandsManager = ({ brands, fetchBrands }) => {
    const [newBrandName, setNewBrandName] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const handleSaveBrand = async () => {
        if (!newBrandName) return;
        setIsSaving(true);
        try {
            if (editingId) {
                await apiFetch({
                    path: `/paint-store/v1/brands/${editingId}`,
                    method: 'PUT',
                    data: { name: newBrandName },
                });
            } else {
                await apiFetch({
                    path: '/paint-store/v1/brands',
                    method: 'POST',
                    data: { name: newBrandName },
                });
            }
            setNewBrandName('');
            setEditingId(null);
            fetchBrands(); // Refresh the list
        } catch (error) {
            console.error('Error saving brand:', error);
            alert('Error saving brand: ' + (error.message || JSON.stringify(error)));
        }
        setIsSaving(false);
    };

    const handleEdit = (brand) => {
        setEditingId(brand.id);
        setNewBrandName(brand.name);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setNewBrandName('');
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this brand?')) return;
        try {
            await apiFetch({
                path: `/paint-store/v1/brands/${id}`,
                method: 'DELETE',
            });
            if (editingId === id) handleCancelEdit();
            fetchBrands();
        } catch (error) {
            console.error('Error deleting brand:', error);
            alert('Error deleting brand: ' + (error.message || JSON.stringify(error)));
        }
    };

    return (
        <div className="brands-manager">
            <PanelBody title={editingId ? "Edit Paint Brand" : "Add New Paint Brand"} initialOpen={true}>
                <PanelRow>
                    <TextControl
                        label="Brand Name (e.g., Sherwin Williams, Benjamin Moore)"
                        value={newBrandName}
                        onChange={(value) => setNewBrandName(value)}
                    />
                </PanelRow>
                <div style={{ padding: '10px 20px 20px', display: 'flex', gap: '10px' }}>
                    <Button
                        variant="primary"
                        onClick={handleSaveBrand}
                        isBusy={isSaving}
                        disabled={!newBrandName || isSaving}
                    >
                        {editingId ? 'Update Brand' : 'Add Brand'}
                    </Button>
                    {editingId && (
                        <Button variant="secondary" onClick={handleCancelEdit}>
                            Cancel Edit
                        </Button>
                    )}
                </div>
            </PanelBody>

            <div style={{ marginTop: '30px' }}>
                <h3>Existing Brands</h3>
                <table className="wp-list-table widefat fixed striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th style={{ width: '150px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {brands.length === 0 ? (
                            <tr><td colSpan="3">No brands found. Add some above.</td></tr>
                        ) : (
                            brands.map(brand => (
                                <tr key={brand.id}>
                                    <td>{brand.id}</td>
                                    <td><strong>{brand.name}</strong></td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <Button isSmall variant="secondary" onClick={() => handleEdit(brand)}>Edit</Button>
                                            <Button isSmall isDestructive onClick={() => handleDelete(brand.id)}>Delete</Button>
                                        </div>
                                    </td>
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
