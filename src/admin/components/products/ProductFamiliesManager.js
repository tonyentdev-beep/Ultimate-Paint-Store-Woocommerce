import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { Button, TextControl, SelectControl, PanelBody, PanelRow } from '@wordpress/components';
import WPEditorField from '../shared/WPEditorField';

const ProductFamiliesManager = ({ productFamilies, productBrands, sizes, sheens, surfaceTypes, fetchProductFamilies }) => {
    const [name, setName] = useState('');
    const [brandId, setBrandId] = useState('');
    const [description, setDescription] = useState('');
    const [imageId, setImageId] = useState(0);
    const [imageUrl, setImageUrl] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [syncingId, setSyncingId] = useState(null);

    // New generic feature arrays
    const [sizeIds, setSizeIds] = useState([]);
    const [sheenIds, setSheenIds] = useState([]);
    const [surfaceIds, setSurfaceIds] = useState([]);

    const brandOptions = [
        { label: 'Select a Brand...', value: '' },
        ...productBrands.map(b => ({ label: b.name, value: b.id }))
    ];

    const sizeOptions = (sizes || []).map(s => ({ label: s.name, value: s.id.toString() }));
    const sheenOptions = (sheens || []).map(s => ({ label: s.name, value: s.id.toString() }));
    const surfaceOptions = (surfaceTypes || []).map(s => ({ label: s.name, value: s.id.toString() }));

    const getBrandName = (bid) => {
        if (!bid) return '-';
        return productBrands.find(b => parseInt(b.id) === parseInt(bid))?.name || bid;
    };

    const openMediaUploader = () => {
        const frame = wp.media({
            title: 'Select Product Family Image',
            button: { text: 'Use this image' },
            multiple: false,
            library: { type: 'image' },
        });
        frame.on('select', () => {
            const attachment = frame.state().get('selection').first().toJSON();
            setImageId(attachment.id);
            setImageUrl(attachment.sizes?.medium?.url || attachment.url);
        });
        frame.open();
    };

    const removeImage = () => {
        setImageId(0);
        setImageUrl('');
    };

    const handleSave = async () => {
        if (!name || !brandId) { alert('Name and Brand are required.'); return; }
        setIsSaving(true);
        try {
            const data = {
                name,
                brand_id: brandId,
                description,
                image_id: imageId,
                size_ids: sizeIds,
                sheen_ids: sheenIds,
                surface_ids: surfaceIds
            };
            if (editingId) {
                await apiFetch({ path: `/paint-store/v1/product-families/${editingId}`, method: 'PUT', data });
            } else {
                await apiFetch({ path: '/paint-store/v1/product-families', method: 'POST', data });
            }
            setName(''); setBrandId(''); setDescription(''); setImageId(0); setImageUrl(''); setEditingId(null);
            setSizeIds([]); setSheenIds([]); setSurfaceIds([]);
            fetchProductFamilies();
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
        setImageId(item.image_id ? parseInt(item.image_id) : 0);
        setImageUrl(item.image_url || '');

        setSizeIds(item.size_ids ? item.size_ids.map(id => id.toString()) : []);
        setSheenIds(item.sheen_ids ? item.sheen_ids.map(id => id.toString()) : []);
        setSurfaceIds(item.surface_ids ? item.surface_ids.map(id => id.toString()) : []);
    };
    const handleCancelEdit = () => {
        setEditingId(null); setName(''); setBrandId(''); setDescription('');
        setImageId(0); setImageUrl('');
        setSizeIds([]); setSheenIds([]); setSurfaceIds([]);
    };
    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product family?')) return;
        try {
            await apiFetch({ path: `/paint-store/v1/product-families/${id}`, method: 'DELETE' });
            if (editingId === id) handleCancelEdit();
            fetchProductFamilies();
        } catch (error) { alert('Error deleting product family: ' + (error.message || JSON.stringify(error))); }
    };

    const handleSync = async (id) => {
        setSyncingId(id);
        try {
            const result = await apiFetch({ path: `/paint-store/v1/product-families/${id}/sync`, method: 'POST' });
            alert(`✅ Synced to WooCommerce! Product ID: ${result.wc_product_id}`);
            fetchProductFamilies();
        } catch (error) {
            console.error('Error syncing product family:', error);
            alert(`❌ Error syncing: ${error.message || JSON.stringify(error)}`);
        }
        setSyncingId(null);
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
                    <div style={{ width: '100%' }}>
                        <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Family Image</label>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                            {imageUrl ? (
                                <div style={{ position: 'relative' }}>
                                    <img
                                        src={imageUrl}
                                        alt="Product family"
                                        style={{ maxWidth: '150px', maxHeight: '150px', borderRadius: '6px', border: '1px solid #ddd', objectFit: 'cover' }}
                                    />
                                    <Button
                                        isSmall
                                        isDestructive
                                        onClick={removeImage}
                                        style={{ position: 'absolute', top: '-8px', right: '-8px', borderRadius: '50%', minWidth: '24px', height: '24px', padding: 0 }}
                                    >
                                        ✕
                                    </Button>
                                </div>
                            ) : (
                                <div
                                    onClick={openMediaUploader}
                                    style={{
                                        width: '150px', height: '150px', border: '2px dashed #ccc', borderRadius: '6px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                        color: '#999', fontSize: '13px', textAlign: 'center', padding: '10px',
                                        transition: 'border-color 0.2s',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#0073aa'}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#ccc'}
                                >
                                    <span>📷<br />Click to upload</span>
                                </div>
                            )}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <Button variant="secondary" onClick={openMediaUploader}>
                                    {imageUrl ? 'Change Image' : 'Upload Image'}
                                </Button>
                                {imageUrl && (
                                    <Button variant="tertiary" isDestructive onClick={removeImage}>Remove Image</Button>
                                )}
                            </div>
                        </div>
                    </div>
                </PanelRow>
                <PanelRow>
                    <WPEditorField
                        id="ps-product-family-desc"
                        label="Description (optional)"
                        value={description}
                        onChange={setDescription}
                    />
                </PanelRow>
                <div style={{ marginTop: '20px', borderTop: '1px solid #ddd', paddingTop: '15px' }}>
                    <h4 style={{ margin: '0 0 15px 0' }}>Available Variations</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', width: '100%' }}>
                        <SelectControl
                            label="Available Sizes"
                            multiple
                            value={sizeIds}
                            options={sizeOptions}
                            onChange={(vals) => setSizeIds(vals)}
                            help="Hold CMD/CTRL to select multiple"
                        />
                        <SelectControl
                            label="Available Sheens"
                            multiple
                            value={sheenIds}
                            options={sheenOptions}
                            onChange={(vals) => setSheenIds(vals)}
                            help="Hold CMD/CTRL to select multiple"
                        />
                        <SelectControl
                            label="Suitable Surface Types (Projects)"
                            multiple
                            value={surfaceIds}
                            options={surfaceOptions}
                            onChange={(vals) => setSurfaceIds(vals)}
                            help="Hold CMD/CTRL to select multiple"
                        />
                    </div>
                </div>
                <div style={{ padding: '10px 20px 20px', display: 'flex', gap: '10px' }}>
                    <Button variant="primary" onClick={handleSave} isBusy={isSaving} disabled={!name || !brandId || isSaving}>
                        {editingId ? 'Update Family' : 'Add Family'}
                    </Button>
                    {editingId && <Button variant="secondary" onClick={handleCancelEdit}>Cancel Edit</Button>}
                </div>
            </PanelBody>
            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h3 style={{ margin: 0 }}>Existing Product Families</h3>
                    <p style={{ color: '#666', fontSize: '13px', margin: '5px 0 10px' }}>
                        Click "WooSync" to generate a WooCommerce Variable Product with Size and Sheen variations.
                    </p>
                </div>
            </div>
            <table className="wp-list-table widefat fixed striped" style={{ marginTop: '10px' }}>
                <thead><tr><th style={{ width: '40px' }}>ID</th><th style={{ width: '50px' }}>Image</th><th>Name</th><th>Brand</th><th>WooCommerce</th><th style={{ width: '180px' }}>Actions</th></tr></thead>
                <tbody>
                    {productFamilies.length === 0 ? (
                        <tr><td colSpan="6">No product families found.</td></tr>
                    ) : productFamilies.map(item => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>
                                {item.image_url ? (
                                    <img src={item.image_url} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                                ) : (
                                    <span style={{ color: '#999', fontSize: '11px' }}>No image</span>
                                )}
                            </td>
                            <td><strong>{item.name}</strong></td>
                            <td>{getBrandName(item.brand_id)}</td>
                            <td>
                                {parseInt(item.wc_product_id) > 0 ? (
                                    <a href={`/wp-admin/post.php?post=${item.wc_product_id}&action=edit`} target="_blank" rel="noreferrer" style={{ color: '#3c763d', fontSize: '12px', textDecoration: 'none', fontWeight: 'bold' }}>
                                        ✓ See Product #{item.wc_product_id}
                                    </a>
                                ) : (
                                    <span style={{ color: '#a94442', fontSize: '12px' }}>Not synced</span>
                                )}
                            </td>
                            <td>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    <Button isSmall variant="primary" onClick={() => handleSync(item.id)} isBusy={syncingId === item.id} disabled={syncingId !== null}>
                                        WooSync
                                    </Button>
                                    <Button isSmall variant="secondary" onClick={() => handleEdit(item)} disabled={syncingId !== null}>Edit</Button>
                                    <Button isSmall isDestructive onClick={() => handleDelete(item.id)} disabled={syncingId !== null}>Delete</Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductFamiliesManager;
