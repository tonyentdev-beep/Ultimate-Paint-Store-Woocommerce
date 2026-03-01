import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { Button, TextControl, PanelBody, PanelRow } from '@wordpress/components';

const ProductBrandsManager = ({ productBrands, fetchProductBrands }) => {
    const [name, setName] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const handleSave = async () => {
        if (!name) { alert('Name is required.'); return; }
        setIsSaving(true);
        try {
            const data = { name };
            if (editingId) {
                await apiFetch({ path: `/paint-store/v1/product-brands/${editingId}`, method: 'PUT', data });
            } else {
                await apiFetch({ path: '/paint-store/v1/product-brands', method: 'POST', data });
            }
            setName(''); setEditingId(null); fetchProductBrands();
        } catch (error) {
            console.error('Error saving product brand:', error);
            alert('Error saving product brand: ' + (error.message || JSON.stringify(error)));
        }
        setIsSaving(false);
    };

    const handleEdit = (item) => { setEditingId(item.id); setName(item.name); };
    const handleCancelEdit = () => { setEditingId(null); setName(''); };
    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product brand?')) return;
        try {
            await apiFetch({ path: `/paint-store/v1/product-brands/${id}`, method: 'DELETE' });
            if (editingId === id) handleCancelEdit();
            fetchProductBrands();
        } catch (error) { alert('Error deleting product brand: ' + (error.message || JSON.stringify(error))); }
    };

    return (
        <div className="product-brands-manager">
            <PanelBody title={editingId ? "Edit Product Brand" : "Add New Product Brand"} initialOpen={true}>
                <PanelRow>
                    <TextControl
                        label="Brand Name (e.g., Valspar, Behr, Berger)"
                        value={name}
                        onChange={setName}
                        style={{ width: '100%' }}
                    />
                </PanelRow>
                <div style={{ padding: '10px 20px 20px', display: 'flex', gap: '10px' }}>
                    <Button variant="primary" onClick={handleSave} isBusy={isSaving} disabled={!name || isSaving}>
                        {editingId ? 'Update Brand' : 'Add Brand'}
                    </Button>
                    {editingId && <Button variant="secondary" onClick={handleCancelEdit}>Cancel Edit</Button>}
                </div>
            </PanelBody>
            <div style={{ marginTop: '30px' }}>
                <h3>Existing Product Brands</h3>
                <p style={{ color: '#666', fontSize: '13px', marginBottom: '10px' }}>
                    These are the paint manufacturers/brands for products and product families — separate from color brands.
                </p>
                <table className="wp-list-table widefat fixed striped">
                    <thead><tr><th style={{ width: '60px' }}>ID</th><th>Name</th><th style={{ width: '150px' }}>Actions</th></tr></thead>
                    <tbody>
                        {productBrands.length === 0 ? (
                            <tr><td colSpan="3">No product brands found.</td></tr>
                        ) : productBrands.map(item => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td><strong>{item.name}</strong></td>
                                <td>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <Button isSmall variant="secondary" onClick={() => handleEdit(item)}>Edit</Button>
                                        <Button isSmall isDestructive onClick={() => handleDelete(item.id)}>Delete</Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductBrandsManager;
