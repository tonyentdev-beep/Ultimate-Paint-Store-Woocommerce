import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { Button, TextControl, SelectControl, PanelBody, PanelRow } from '@wordpress/components';

const ProductsManager = ({
    products,
    productFamilies,
    bases,
    sizes,
    sheens,
    surfaceTypes,
    fetchProducts
}) => {
    const [familyId, setFamilyId] = useState('');
    const [baseId, setBaseId] = useState('');
    const [sizeId, setSizeId] = useState('');
    const [sheenId, setSheenId] = useState('');
    const [surfaceId, setSurfaceId] = useState('');
    const [sku, setSku] = useState('');
    const [price, setPrice] = useState('0.00');
    const [stockQuantity, setStockQuantity] = useState('0');

    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const familyOptions = [
        { label: 'Select Product Family...', value: '' },
        ...productFamilies.map(f => ({ label: f.name, value: f.id.toString() }))
    ];

    const baseOptions = [
        { label: 'Select Base...', value: '' },
        ...bases.map(b => ({ label: b.name, value: b.id.toString() }))
    ];

    const sizeOptions = [
        { label: 'Select Size...', value: '' },
        ...(sizes || []).map(s => ({ label: s.name, value: s.id.toString() }))
    ];

    const sheenOptions = [
        { label: 'Select Sheen...', value: '' },
        ...(sheens || []).map(s => ({ label: s.name, value: s.id.toString() }))
    ];

    const surfaceOptions = [
        { label: 'Select Surface/Project Type...', value: '' },
        ...(surfaceTypes || []).map(s => ({ label: s.name, value: s.id.toString() }))
    ];

    const getFamilyName = (id) => productFamilies.find(f => parseInt(f.id) === parseInt(id))?.name || '-';
    const getBaseName = (id) => bases.find(b => parseInt(b.id) === parseInt(id))?.name || '-';
    const getSizeName = (id) => sizes.find(s => parseInt(s.id) === parseInt(id))?.name || '-';
    const getSheenName = (id) => sheens.find(s => parseInt(s.id) === parseInt(id))?.name || '-';
    const getSurfaceName = (id) => surfaceTypes.find(s => parseInt(s.id) === parseInt(id))?.name || '-';

    const handleSave = async () => {
        if (!familyId || !baseId || !sizeId || !sheenId || !surfaceId) {
            alert('All relation fields are required to map a physical product.');
            return;
        }

        setIsSaving(true);
        try {
            const data = {
                family_id: familyId,
                base_id: baseId,
                size_id: sizeId,
                sheen_id: sheenId,
                surface_id: surfaceId,
                sku: sku,
                price: parseFloat(price) || 0.00,
                stock_quantity: parseInt(stockQuantity, 10) || 0
            };

            if (editingId) {
                await apiFetch({ path: `/paint-store/v1/products/${editingId}`, method: 'PUT', data });
            } else {
                await apiFetch({ path: '/paint-store/v1/products', method: 'POST', data });
            }

            handleCancelEdit();
            fetchProducts();
        } catch (error) {
            console.error('Error saving physical product:', error);
            alert('Error saving physical product: ' + (error.message || JSON.stringify(error)));
        }
        setIsSaving(false);
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        setFamilyId(item.family_id.toString());
        setBaseId(item.base_id.toString());
        setSizeId(item.size_id.toString());
        setSheenId(item.sheen_id.toString());
        setSurfaceId(item.surface_id.toString());
        setSku(item.sku);
        setPrice(item.price.toString());
        setStockQuantity((item.stock_quantity || 0).toString());
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFamilyId('');
        setBaseId('');
        setSizeId('');
        setSheenId('');
        setSurfaceId('');
        setSku('');
        setPrice('0.00');
        setStockQuantity('0');
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this specific SKU?')) return;
        try {
            await apiFetch({ path: `/paint-store/v1/products/${id}`, method: 'DELETE' });
            if (editingId === id) handleCancelEdit();
            fetchProducts();
        } catch (error) {
            alert('Error deleting physical product: ' + (error.message || JSON.stringify(error)));
        }
    };

    return (
        <div className="products-manager">
            <PanelBody title={editingId ? "Edit Physical SKU" : "Add Physical SKU"} initialOpen={true}>
                <PanelRow>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '100%' }}>
                        <SelectControl label="Parent Product Family" value={familyId} options={familyOptions} onChange={setFamilyId} />
                        <SelectControl label="Required Paint Base" value={baseId} options={baseOptions} onChange={setBaseId} />
                    </div>
                </PanelRow>
                <PanelRow>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', width: '100%' }}>
                        <SelectControl label="Size" value={sizeId} options={sizeOptions} onChange={setSizeId} />
                        <SelectControl label="Sheen" value={sheenId} options={sheenOptions} onChange={setSheenId} />
                        <SelectControl label="Surface/Project Type" value={surfaceId} options={surfaceOptions} onChange={setSurfaceId} />
                    </div>
                </PanelRow>
                <PanelRow>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', width: '100%', marginTop: '15px' }}>
                        <TextControl label="SKU (Stock Keeping Unit)" value={sku} onChange={setSku} />
                        <TextControl type="number" step="0.01" label="Base Price ($)" value={price} onChange={setPrice} />
                        <TextControl type="number" step="1" label="Stock Quantity" value={stockQuantity} onChange={setStockQuantity} />
                    </div>
                </PanelRow>

                <div style={{ padding: '20px 0 0 0', display: 'flex', gap: '10px' }}>
                    <Button variant="primary" onClick={handleSave} isBusy={isSaving} disabled={!familyId || !baseId || !sizeId || !sheenId || !surfaceId || isSaving}>
                        {editingId ? 'Update Physical SKU' : 'Add Physical SKU'}
                    </Button>
                    {editingId && <Button variant="secondary" onClick={handleCancelEdit}>Cancel Edit</Button>}
                </div>
            </PanelBody>

            <div style={{ marginTop: '30px' }}>
                <h3 style={{ margin: 0 }}>Physical Products Inventory (SKUs)</h3>
                <p style={{ color: '#666', fontSize: '13px', margin: '5px 0 10px' }}>
                    These explicitly map existing Paint Bases in the real world to specific container Sizes and Sheens.
                </p>
            </div>

            <table className="wp-list-table widefat fixed striped" style={{ marginTop: '10px' }}>
                <thead>
                    <tr>
                        <th style={{ width: '50px' }}>ID</th>
                        <th>Family</th>
                        <th>Base</th>
                        <th>Size</th>
                        <th>Sheen</th>
                        <th>Surface</th>
                        <th>SKU</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th style={{ width: '120px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length === 0 ? (
                        <tr><td colSpan="10">No physical products found.</td></tr>
                    ) : products.map(item => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td><strong>{getFamilyName(item.family_id)}</strong></td>
                            <td>{getBaseName(item.base_id)}</td>
                            <td>{getSizeName(item.size_id)}</td>
                            <td>{getSheenName(item.sheen_id)}</td>
                            <td>{getSurfaceName(item.surface_id)}</td>
                            <td><code>{item.sku || '-'}</code></td>
                            <td>${parseFloat(item.price).toFixed(2)}</td>
                            <td>{item.stock_quantity}</td>
                            <td>
                                <div style={{ display: 'flex', gap: '8px' }}>
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

export default ProductsManager;
