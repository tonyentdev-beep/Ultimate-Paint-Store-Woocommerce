import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { Button, TextControl, TextareaControl, PanelBody, PanelRow } from '@wordpress/components';

const ProductTypesManager = ({ productTypes, fetchProductTypes }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const handleSave = async () => {
        if (!name) return;
        setIsSaving(true);
        try {
            if (editingId) {
                await apiFetch({ path: `/paint-store/v1/product-types/${editingId}`, method: 'PUT', data: { name, description } });
            } else {
                await apiFetch({ path: '/paint-store/v1/product-types', method: 'POST', data: { name, description } });
            }
            setName(''); setDescription(''); setEditingId(null); fetchProductTypes();
        } catch (error) {
            console.error('Error saving product type:', error);
            alert('Error saving product type: ' + (error.message || JSON.stringify(error)));
        }
        setIsSaving(false);
    };

    const handleEdit = (item) => { setEditingId(item.id); setName(item.name); setDescription(item.description || ''); };
    const handleCancelEdit = () => { setEditingId(null); setName(''); setDescription(''); };
    const handleDelete = async (id) => {
        if (!confirm('Are you sure? This will not delete associated makes/families, but they will be unlinked.')) return;
        try {
            await apiFetch({ path: `/paint-store/v1/product-types/${id}`, method: 'DELETE' });
            if (editingId === id) handleCancelEdit();
            fetchProductTypes();
        } catch (error) { alert('Error: ' + (error.message || JSON.stringify(error))); }
    };

    return (
        <div className="product-types-manager">
            <PanelBody title={editingId ? "Edit Product Type" : "Add New Product Type"} initialOpen={true}>
                <PanelRow>
                    <TextControl label="Type Name (e.g., Coatings, Tools)" value={name} onChange={setName} />
                </PanelRow>
                <PanelRow>
                    <TextareaControl label="Description" value={description} onChange={setDescription} rows={2} />
                </PanelRow>
                <div style={{ padding: '10px 20px 20px', display: 'flex', gap: '10px' }}>
                    <Button variant="primary" onClick={handleSave} isBusy={isSaving} disabled={!name || isSaving}>
                        {editingId ? 'Update Type' : 'Add Type'}
                    </Button>
                    {editingId && <Button variant="secondary" onClick={handleCancelEdit}>Cancel Edit</Button>}
                </div>
            </PanelBody>
            <h3 style={{ marginTop: '30px' }}>Existing Product Types</h3>
            <table className="wp-list-table widefat fixed striped" style={{ marginTop: '10px' }}>
                <thead><tr><th style={{ width: '50px' }}>ID</th><th>Name</th><th>Slug</th><th>Description</th><th style={{ width: '150px' }}>Actions</th></tr></thead>
                <tbody>
                    {(!productTypes || productTypes.length === 0) ? (
                        <tr><td colSpan="5">No product types found. Add "Coatings" and "Tools" to get started.</td></tr>
                    ) : productTypes.map(item => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td><strong>{item.name}</strong></td>
                            <td><code>{item.slug}</code></td>
                            <td style={{ fontSize: '12px', color: '#666' }}>{item.description || '—'}</td>
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
    );
};

export default ProductTypesManager;
