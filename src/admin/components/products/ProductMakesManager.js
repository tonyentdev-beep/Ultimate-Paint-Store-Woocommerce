import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { Button, TextControl, TextareaControl, SelectControl, PanelBody, PanelRow } from '@wordpress/components';

const ProductMakesManager = ({ productMakes, productTypes, fetchProductMakes }) => {
    const [name, setName] = useState('');
    const [productTypeId, setProductTypeId] = useState('');
    const [description, setDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const typeOptions = [
        { label: '— Select Product Type —', value: '' },
        ...(productTypes || []).map(t => ({ label: t.name, value: String(t.id) }))
    ];

    const getTypeName = (typeId) => {
        const t = (productTypes || []).find(x => String(x.id) === String(typeId));
        return t ? t.name : '—';
    };

    const handleSave = async () => {
        if (!name || !productTypeId) return;
        setIsSaving(true);
        try {
            const data = { name, product_type_id: parseInt(productTypeId), description };
            if (editingId) {
                await apiFetch({ path: `/paint-store/v1/product-makes/${editingId}`, method: 'PUT', data });
            } else {
                await apiFetch({ path: '/paint-store/v1/product-makes', method: 'POST', data });
            }
            setName(''); setProductTypeId(''); setDescription(''); setEditingId(null); fetchProductMakes();
        } catch (error) {
            console.error('Error saving product make:', error);
            alert('Error saving product make: ' + (error.message || JSON.stringify(error)));
        }
        setIsSaving(false);
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        setName(item.name);
        setProductTypeId(String(item.product_type_id));
        setDescription(item.description || '');
    };
    const handleCancelEdit = () => { setEditingId(null); setName(''); setProductTypeId(''); setDescription(''); };
    const handleDelete = async (id) => {
        if (!confirm('Are you sure? Categories and families under this make will be unlinked.')) return;
        try {
            await apiFetch({ path: `/paint-store/v1/product-makes/${id}`, method: 'DELETE' });
            if (editingId === id) handleCancelEdit();
            fetchProductMakes();
        } catch (error) { alert('Error: ' + (error.message || JSON.stringify(error))); }
    };

    return (
        <div className="product-makes-manager">
            <PanelBody title={editingId ? "Edit Product Make" : "Add New Product Make"} initialOpen={true}>
                <PanelRow>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '100%' }}>
                        <TextControl label="Make Name (e.g., Architectural Paints, Brushes)" value={name} onChange={setName} />
                        <SelectControl label="Product Type" value={productTypeId} options={typeOptions} onChange={setProductTypeId} />
                    </div>
                </PanelRow>
                <PanelRow>
                    <TextareaControl label="Description" value={description} onChange={setDescription} rows={2} />
                </PanelRow>
                <div style={{ padding: '10px 20px 20px', display: 'flex', gap: '10px' }}>
                    <Button variant="primary" onClick={handleSave} isBusy={isSaving} disabled={!name || !productTypeId || isSaving}>
                        {editingId ? 'Update Make' : 'Add Make'}
                    </Button>
                    {editingId && <Button variant="secondary" onClick={handleCancelEdit}>Cancel Edit</Button>}
                </div>
            </PanelBody>
            <h3 style={{ marginTop: '30px' }}>Existing Product Makes</h3>
            <table className="wp-list-table widefat fixed striped" style={{ marginTop: '10px' }}>
                <thead><tr><th style={{ width: '50px' }}>ID</th><th>Name</th><th>Product Type</th><th>Slug</th><th>Description</th><th style={{ width: '150px' }}>Actions</th></tr></thead>
                <tbody>
                    {(!productMakes || productMakes.length === 0) ? (
                        <tr><td colSpan="6">No product makes found. Create Product Types first, then add makes.</td></tr>
                    ) : productMakes.map(item => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td><strong>{item.name}</strong></td>
                            <td>
                                <span style={{
                                    background: item.type_name === 'Tools' ? '#e8f0fe' : '#e8f5e9',
                                    color: item.type_name === 'Tools' ? '#174ea6' : '#2e7d32',
                                    padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 600
                                }}>
                                    {item.type_name || getTypeName(item.product_type_id)}
                                </span>
                            </td>
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

export default ProductMakesManager;
