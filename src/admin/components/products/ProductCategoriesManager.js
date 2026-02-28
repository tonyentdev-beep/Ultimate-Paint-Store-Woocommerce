import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { Button, TextControl, PanelBody, PanelRow } from '@wordpress/components';

const ProductCategoriesManager = ({ productCategories, fetchProductCategories }) => {
    const [name, setName] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const handleSave = async () => {
        if (!name) return;
        setIsSaving(true);
        try {
            if (editingId) {
                await apiFetch({ path: `/paint-store/v1/product-categories/${editingId}`, method: 'PUT', data: { name } });
            } else {
                await apiFetch({ path: '/paint-store/v1/product-categories', method: 'POST', data: { name } });
            }
            setName(''); setEditingId(null); fetchProductCategories();
        } catch (error) {
            console.error('Error saving product category:', error);
            alert('Error saving product category: ' + (error.message || JSON.stringify(error)));
        }
        setIsSaving(false);
    };

    const handleEdit = (item) => { setEditingId(item.id); setName(item.name); };
    const handleCancelEdit = () => { setEditingId(null); setName(''); };
    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product category?')) return;
        try {
            await apiFetch({ path: `/paint-store/v1/product-categories/${id}`, method: 'DELETE' });
            if (editingId === id) handleCancelEdit();
            fetchProductCategories();
        } catch (error) { alert('Error deleting product category: ' + (error.message || JSON.stringify(error))); }
    };

    return (
        <div className="product-categories-manager">
            <PanelBody title={editingId ? "Edit Product Category" : "Add New Product Category"} initialOpen={true}>
                <PanelRow>
                    <TextControl label="Category Name (e.g., Paint, Primer, Paint and Primer)" value={name} onChange={setName} />
                </PanelRow>
                <div style={{ padding: '10px 20px 20px', display: 'flex', gap: '10px' }}>
                    <Button variant="primary" onClick={handleSave} isBusy={isSaving} disabled={!name || isSaving}>
                        {editingId ? 'Update Category' : 'Add Category'}
                    </Button>
                    {editingId && <Button variant="secondary" onClick={handleCancelEdit}>Cancel Edit</Button>}
                </div>
            </PanelBody>
            <div style={{ marginTop: '30px' }}>
                <h3>Existing Product Categories</h3>
                <table className="wp-list-table widefat fixed striped">
                    <thead><tr><th>ID</th><th>Name</th><th>Slug</th><th style={{ width: '150px' }}>Actions</th></tr></thead>
                    <tbody>
                        {productCategories.length === 0 ? (
                            <tr><td colSpan="4">No product categories found.</td></tr>
                        ) : productCategories.map(item => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td><strong>{item.name}</strong></td>
                                <td><code>{item.slug}</code></td>
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

export default ProductCategoriesManager;
