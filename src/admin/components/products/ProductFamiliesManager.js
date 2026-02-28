import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { Button, TextControl, SelectControl, PanelBody, PanelRow } from '@wordpress/components';
import WPEditorField from '../shared/WPEditorField';

const ProductFamiliesManager = ({ productFamilies, brands, fetchProductFamilies }) => {
    const [name, setName] = useState('');
    const [brandId, setBrandId] = useState('');
    const [description, setDescription] = useState('');
    const [imageId, setImageId] = useState(0);
    const [imageUrl, setImageUrl] = useState('');
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
            const data = { name, brand_id: brandId, description, image_id: imageId };
            if (editingId) {
                await apiFetch({ path: `/paint-store/v1/product-families/${editingId}`, method: 'PUT', data });
            } else {
                await apiFetch({ path: '/paint-store/v1/product-families', method: 'POST', data });
            }
            setName(''); setBrandId(''); setDescription(''); setImageId(0); setImageUrl(''); setEditingId(null);
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
    };
    const handleCancelEdit = () => {
        setEditingId(null); setName(''); setBrandId(''); setDescription('');
        setImageId(0); setImageUrl('');
    };
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
                    <thead><tr><th style={{ width: '50px' }}>ID</th><th style={{ width: '70px' }}>Image</th><th>Name</th><th>Brand</th><th>Description</th><th style={{ width: '150px' }}>Actions</th></tr></thead>
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
                                <td><div dangerouslySetInnerHTML={{ __html: item.description || '-' }} /></td>
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
