import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { Button, TextControl, TextareaControl, SelectControl, PanelBody, PanelRow } from '@wordpress/components';

const ProductCategoriesManager = ({ productCategories, productMakes, fetchProductCategories }) => {
    const [name, setName] = useState('');
    const [makeId, setMakeId] = useState('');
    const [description, setDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncMessage, setSyncMessage] = useState('');

    const makeOptions = [
        { label: '— Select Product Make —', value: '' },
        ...(productMakes || []).map(m => ({ label: `${m.name} (${m.type_name || ''})`, value: String(m.id) }))
    ];

    const getMakeName = (id) => {
        const m = (productMakes || []).find(x => String(x.id) === String(id));
        return m ? m.name : '—';
    };

    const handleSave = async () => {
        if (!name) return;
        setIsSaving(true);
        try {
            const data = { name, make_id: parseInt(makeId) || 0, description };
            if (editingId) {
                await apiFetch({ path: `/paint-store/v1/product-categories/${editingId}`, method: 'PUT', data });
            } else {
                await apiFetch({ path: '/paint-store/v1/product-categories', method: 'POST', data });
            }
            setName(''); setMakeId(''); setDescription(''); setEditingId(null); fetchProductCategories();
        } catch (error) {
            console.error('Error saving product category:', error);
            alert('Error saving product category: ' + (error.message || JSON.stringify(error)));
        }
        setIsSaving(false);
    };

    const handleEdit = (item) => { setEditingId(item.id); setName(item.name); setMakeId(String(item.make_id || '')); setDescription(item.description || ''); };
    const handleCancelEdit = () => { setEditingId(null); setName(''); setMakeId(''); setDescription(''); };
    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product category?')) return;
        try {
            await apiFetch({ path: `/paint-store/v1/product-categories/${id}`, method: 'DELETE' });
            if (editingId === id) handleCancelEdit();
            fetchProductCategories();
        } catch (error) { alert('Error deleting product category: ' + (error.message || JSON.stringify(error))); }
    };

    const handleSync = async () => {
        setIsSyncing(true);
        setSyncMessage('');
        try {
            const result = await apiFetch({ path: '/paint-store/v1/product-categories/sync', method: 'POST' });
            setSyncMessage(`✅ Synced ${result.synced} categories to WooCommerce!`);
            fetchProductCategories();
            setTimeout(() => setSyncMessage(''), 4000);
        } catch (error) {
            console.error('Error syncing:', error);
            setSyncMessage(`❌ Error: ${error.message || JSON.stringify(error)}`);
        }
        setIsSyncing(false);
    };

    return (
        <div className="product-categories-manager">
            <PanelBody title={editingId ? "Edit Product Category" : "Add New Product Category"} initialOpen={true}>
                <PanelRow>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '100%' }}>
                        <TextControl label="Category Name (e.g., Interior Paint and Primer)" value={name} onChange={setName} />
                        <SelectControl label="Product Make (scope this category)" value={makeId} options={makeOptions} onChange={setMakeId} />
                    </div>
                </PanelRow>
                <PanelRow>
                    <TextareaControl label="Description (SEO meta text)" value={description} onChange={setDescription} rows={3} />
                </PanelRow>
                <div style={{ padding: '10px 20px 20px', display: 'flex', gap: '10px' }}>
                    <Button variant="primary" onClick={handleSave} isBusy={isSaving} disabled={!name || isSaving}>
                        {editingId ? 'Update Category' : 'Add Category'}
                    </Button>
                    {editingId && <Button variant="secondary" onClick={handleCancelEdit}>Cancel Edit</Button>}
                </div>
            </PanelBody>
            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h3 style={{ margin: 0 }}>Existing Product Categories</h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {syncMessage && <span style={{ fontSize: '13px', color: syncMessage.includes('✅') ? '#3c763d' : '#a94442' }}>{syncMessage}</span>}
                    <Button variant="secondary" onClick={handleSync} isBusy={isSyncing} disabled={isSyncing}>
                        🔄 Sync with WooCommerce
                    </Button>
                </div>
            </div>
            <table className="wp-list-table widefat fixed striped" style={{ marginTop: '10px' }}>
                <thead><tr><th>ID</th><th>Name</th><th>Product Make</th><th>Slug</th><th>WooCommerce Sync</th><th style={{ width: '150px' }}>Actions</th></tr></thead>
                <tbody>
                    {productCategories.length === 0 ? (
                        <tr><td colSpan="6">No product categories found.</td></tr>
                    ) : productCategories.map(item => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td><strong>{item.name}</strong></td>
                            <td>
                                {parseInt(item.make_id) > 0 ? (
                                    <span style={{ background: '#f0f6ff', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 600 }}>
                                        {getMakeName(item.make_id)}
                                    </span>
                                ) : <span style={{ color: '#999', fontSize: '12px' }}>Unassigned</span>}
                            </td>
                            <td><code>{item.slug}</code></td>
                            <td>
                                {parseInt(item.wc_category_id) > 0 ? (
                                    <span style={{ color: '#3c763d', fontSize: '12px' }}>✓ Synced (ID: {item.wc_category_id})</span>
                                ) : (
                                    <span style={{ color: '#a94442', fontSize: '12px' }}>Not synced</span>
                                )}
                            </td>
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

export default ProductCategoriesManager;
