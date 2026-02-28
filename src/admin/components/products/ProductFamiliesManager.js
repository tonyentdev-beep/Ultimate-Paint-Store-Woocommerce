import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { Button, TextControl, TextareaControl, SelectControl, PanelBody, PanelRow } from '@wordpress/components';

const ProductFamiliesManager = ({ productFamilies, brands, fetchProductFamilies }) => {
    const [name, setName] = useState('');
    const [brandId, setBrandId] = useState('');
    const [description, setDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const brandOptions = [
        { label: 'Select a Brand...', value: '' },
        ...brands.map(b => ({ label: b.name, value: b.id }))
    ];

    const getBrandName = (bid) => {
        if (!bid) return '-';
        return brands.find(b => parseInt(b.id) === parseInt(bid))?.name || bid;
    };

    const handleSave = async () => {
        if (!name || !brandId) { alert('Name and Brand are required.'); return; }
        setIsSaving(true);
        try {
            const data = { name, brand_id: brandId, description };
            if (editingId) {
                await apiFetch({ path: `/paint-store/v1/product-families/${editingId}`, method: 'PUT', data });
            } else {
                await apiFetch({ path: '/paint-store/v1/product-families', method: 'POST', data });
            }
            setName(''); setBrandId(''); setDescription(''); setEditingId(null); fetchProductFamilies();
        } catch (error) {
            console.error('Error saving product family:', error);
            alert('Error saving product family: ' + (error.message || JSON.stringify(error)));
        }
        setIsSaving(false);
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        setName(item.name);
        setBrandId(item.brand_id == 0 ? '' : item.brand_id);
        setDescription(item.description || '');
    };
    const handleCancelEdit = () => { setEditingId(null); setName(''); setBrandId(''); setDescription(''); };
    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product family?')) return;
        try {
            await apiFetch({ path: `/paint-store/v1/product-families/${id}`, method: 'DELETE' });
            if (editingId === id) handleCancelEdit();
            fetchProductFamilies();
        } catch (error) { alert('Error deleting product family: ' + (error.message || JSON.stringify(error))); }
    };

    return (
        <div className="product-families-manager">
            <PanelBody title={editingId ? "Edit Product Family" : "Add New Product Family"} initialOpen={true}>
                <PanelRow>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '100%' }}>
                        <TextControl label="Family Name (e.g., Supreme Edge Interior)" value={name} onChange={setName} />
                        <SelectControl label="Brand" value={brandId} options={brandOptions} onChange={setBrandId} />
                    </div>
                </PanelRow>
                <PanelRow>
                    <TextareaControl label="Description (optional)" value={description} onChange={setDescription} />
                </PanelRow>
                <div style={{ padding: '10px 20px 20px', display: 'flex', gap: '10px' }}>
                    <Button variant="primary" onClick={handleSave} isBusy={isSaving} disabled={!name || !brandId || isSaving}>
                        {editingId ? 'Update Family' : 'Add Family'}
                    </Button>
                    {editingId && <Button variant="secondary" onClick={handleCancelEdit}>Cancel Edit</Button>}
                </div>
            </PanelBody>
            <div style={{ marginTop: '30px' }}>
                <h3>Existing Product Families</h3>
                <table className="wp-list-table widefat fixed striped">
                    <thead><tr><th>ID</th><th>Name</th><th>Brand</th><th>Description</th><th style={{ width: '150px' }}>Actions</th></tr></thead>
                    <tbody>
                        {productFamilies.length === 0 ? (
                            <tr><td colSpan="5">No product families found.</td></tr>
                        ) : productFamilies.map(item => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td><strong>{item.name}</strong></td>
                                <td>{getBrandName(item.brand_id)}</td>
                                <td>{item.description || '-'}</td>
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

export default ProductFamiliesManager;
