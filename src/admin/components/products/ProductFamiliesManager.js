import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { Button, TextControl, SelectControl, CheckboxControl, PanelBody, PanelRow } from '@wordpress/components';
import WPEditorField from '../shared/WPEditorField';

const ProductFamiliesManager = ({ productFamilies, productBrands, productCategories, surfaceTypes, sceneImages, sheens, sizes, fetchProductFamilies }) => {
    const [name, setName] = useState('');
    const [brandId, setBrandId] = useState('');
    const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
    const [selectedSurfaceTypeIds, setSelectedSurfaceTypeIds] = useState([]);
    const [selectedSceneIds, setSelectedSceneIds] = useState([]);
    const [selectedSheenIds, setSelectedSheenIds] = useState([]);
    const [selectedSizeIds, setSelectedSizeIds] = useState([]);
    const [description, setDescription] = useState('');
    const [shortDescription, setShortDescription] = useState('');
    const [howToUse, setHowToUse] = useState('');
    const [datasheets, setDatasheets] = useState([]);
    const [galleryImages, setGalleryImages] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [syncingId, setSyncingId] = useState(null);

    const brandOptions = [
        { label: 'Select a Brand...', value: '' },
        ...productBrands.map(b => ({ label: b.name, value: b.id }))
    ];

    const getBrandName = (bid) => {
        if (!bid) return '-';
        return productBrands.find(b => parseInt(b.id) === parseInt(bid))?.name || bid;
    };

    const getCategoryNames = (ids) => {
        if (!ids || ids.length === 0) return '-';
        return ids.map(id => productCategories.find(c => parseInt(c.id) === parseInt(id))?.name).filter(Boolean).join(', ');
    };

    const getSurfaceTypeNames = (ids) => {
        if (!ids || ids.length === 0) return '-';
        return ids.map(id => surfaceTypes.find(s => parseInt(s.id) === parseInt(id))?.name).filter(Boolean).join(', ');
    };

    const getSheenNames = (ids) => {
        if (!ids || ids.length === 0) return '-';
        return ids.map(id => sheens.find(s => parseInt(s.id) === parseInt(id))?.name).filter(Boolean).join(', ');
    };

    const getSizeNames = (ids) => {
        if (!ids || ids.length === 0) return '-';
        return ids.map(id => sizes.find(s => parseInt(s.id) === parseInt(id))?.name).filter(Boolean).join(', ');
    };

    const toggleCategoryId = (id) => {
        const numId = parseInt(id);
        setSelectedCategoryIds(prev =>
            prev.includes(numId) ? prev.filter(x => x !== numId) : [...prev, numId]
        );
    };

    const toggleSurfaceTypeId = (id) => {
        const numId = parseInt(id);
        setSelectedSurfaceTypeIds(prev =>
            prev.includes(numId) ? prev.filter(x => x !== numId) : [...prev, numId]
        );
    };

    const toggleSceneId = (id) => {
        const numId = parseInt(id);
        setSelectedSceneIds(prev =>
            prev.includes(numId) ? prev.filter(x => x !== numId) : [...prev, numId]
        );
    };

    const toggleSheenId = (id) => {
        const numId = parseInt(id);
        setSelectedSheenIds(prev =>
            prev.includes(numId) ? prev.filter(x => x !== numId) : [...prev, numId]
        );
    };

    const toggleSizeId = (id) => {
        const numId = parseInt(id);
        setSelectedSizeIds(prev =>
            prev.includes(numId) ? prev.filter(x => x !== numId) : [...prev, numId]
        );
    };

    const openGalleryUploader = () => {
        const frame = wp.media({
            title: 'Select Product Family Images',
            button: { text: 'Add to Gallery' },
            multiple: true,
            library: { type: 'image' },
        });
        frame.on('select', () => {
            const attachments = frame.state().get('selection').toJSON();
            const newImages = attachments.map(att => ({
                id: att.id,
                url: att.sizes?.medium?.url || att.url
            }));
            setGalleryImages(prev => [...prev, ...newImages]);
        });
        frame.open();
    };

    const removeGalleryImage = (index) => {
        setGalleryImages(prev => prev.filter((_, i) => i !== index));
    };

    const addDatasheetRow = () => {
        setDatasheets([...datasheets, { product_number: '', sheen: '', base_color: '', container_size: '', sds_file_id: 0, sds_file_url: '', pds_file_id: 0, pds_file_url: '' }]);
    };

    const updateDatasheetRow = (index, field, value) => {
        const newDatasheets = [...datasheets];
        newDatasheets[index][field] = value;
        setDatasheets(newDatasheets);
    };

    const removeDatasheetRow = (index) => {
        const newDatasheets = [...datasheets];
        newDatasheets.splice(index, 1);
        setDatasheets(newDatasheets);
    };

    const openPdfUploader = (index, type) => {
        const frame = wp.media({
            title: `Select ${type.toUpperCase()} PDF`,
            button: { text: `Use this ${type.toUpperCase()}` },
            multiple: false,
            library: { type: 'application/pdf' },
        });
        frame.on('select', () => {
            const attachment = frame.state().get('selection').first().toJSON();
            const newDatasheets = [...datasheets];
            newDatasheets[index][`${type}_file_id`] = attachment.id;
            newDatasheets[index][`${type}_file_url`] = attachment.url;
            setDatasheets(newDatasheets);
        });
        frame.open();
    };

    const removePdf = (index, type) => {
        const newDatasheets = [...datasheets];
        newDatasheets[index][`${type}_file_id`] = 0;
        newDatasheets[index][`${type}_file_url`] = '';
        setDatasheets(newDatasheets);
    };

    const handleSave = async () => {
        if (!name || !brandId) { alert('Name and Brand are required.'); return; }
        setIsSaving(true);
        try {
            const data = {
                name,
                brand_id: brandId,
                category_ids: selectedCategoryIds,
                surface_type_ids: selectedSurfaceTypeIds,
                scene_ids: selectedSceneIds,
                sheen_ids: selectedSheenIds,
                size_ids: selectedSizeIds,
                description,
                short_description: shortDescription,
                how_to_use: howToUse,
                datasheets: datasheets,
                gallery_image_ids: galleryImages.map(img => img.id)
            };
            if (editingId) {
                await apiFetch({ path: `/paint-store/v1/product-families/${editingId}`, method: 'PUT', data });
            } else {
                await apiFetch({ path: '/paint-store/v1/product-families', method: 'POST', data });
            }
            resetForm();
            fetchProductFamilies();
        } catch (error) {
            console.error('Error saving product family:', error);
            alert('Error saving product family: ' + (error.message || JSON.stringify(error)));
        }
        setIsSaving(false);
    };

    const resetForm = () => {
        setName(''); setBrandId(''); setSelectedCategoryIds([]); setSelectedSurfaceTypeIds([]); setSelectedSceneIds([]); setSelectedSheenIds([]); setSelectedSizeIds([]);
        setDescription(''); setShortDescription(''); setHowToUse(''); setDatasheets([]); setGalleryImages([]); setEditingId(null);
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        setName(item.name);
        setBrandId(item.brand_id == 0 ? '' : item.brand_id);
        setSelectedCategoryIds(item.category_ids || []);
        setSelectedSurfaceTypeIds(item.surface_type_ids || []);
        setSelectedSceneIds(item.scene_ids || []);
        setSelectedSheenIds(item.sheen_ids || []);
        setSelectedSizeIds(item.size_ids || []);
        setDescription(item.description || '');
        setShortDescription(item.short_description || '');
        setHowToUse(item.how_to_use || '');
        setDatasheets(item.datasheets || []);
        setGalleryImages(item.gallery_images || []);
    };

    const handleCancelEdit = () => resetForm();

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
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '100%' }}>
                        <div>
                            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Categories</label>
                            <div style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '10px', maxHeight: '150px', overflowY: 'auto', background: '#fafafa' }}>
                                {productCategories.length === 0 ? (
                                    <span style={{ color: '#999', fontSize: '13px' }}>No categories created yet.</span>
                                ) : productCategories.map(cat => (
                                    <CheckboxControl
                                        key={cat.id}
                                        label={cat.name}
                                        checked={selectedCategoryIds.includes(parseInt(cat.id))}
                                        onChange={() => toggleCategoryId(cat.id)}
                                        __nextHasNoMarginBottom
                                    />
                                ))}
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Surface Types</label>
                            <div style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '10px', maxHeight: '150px', overflowY: 'auto', background: '#fafafa' }}>
                                {surfaceTypes.length === 0 ? (
                                    <span style={{ color: '#999', fontSize: '13px' }}>No surface types created yet.</span>
                                ) : surfaceTypes.map(st => (
                                    <CheckboxControl
                                        key={st.id}
                                        label={st.name}
                                        checked={selectedSurfaceTypeIds.includes(parseInt(st.id))}
                                        onChange={() => toggleSurfaceTypeId(st.id)}
                                        __nextHasNoMarginBottom
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </PanelRow>
                <PanelRow>
                    <div style={{ width: '100%' }}>
                        <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Scene Images (for gallery slider)</label>
                        <div style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '10px', maxHeight: '150px', overflowY: 'auto', background: '#fafafa' }}>
                            {(!sceneImages || sceneImages.length === 0) ? (
                                <span style={{ color: '#999', fontSize: '13px' }}>No scene images created yet.</span>
                            ) : sceneImages.map(scene => (
                                <CheckboxControl
                                    key={scene.id}
                                    label={scene.name}
                                    checked={selectedSceneIds.includes(parseInt(scene.id))}
                                    onChange={() => toggleSceneId(scene.id)}
                                    __nextHasNoMarginBottom
                                />
                            ))}
                        </div>
                    </div>
                </PanelRow>
                <PanelRow>
                    <div style={{ width: '100%' }}>
                        <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Available Sheens</label>
                        <p style={{ color: '#666', fontSize: '12px', margin: '0 0 10px 0' }}>Select the sheens that this product family is physically available in.</p>
                        <div style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '10px', maxHeight: '150px', overflowY: 'auto', background: '#fafafa' }}>
                            {(!sheens || sheens.length === 0) ? (
                                <span style={{ color: '#999', fontSize: '13px' }}>No sheens created yet.</span>
                            ) : sheens.map(sheen => (
                                <CheckboxControl
                                    key={sheen.id}
                                    label={sheen.name}
                                    checked={selectedSheenIds.includes(parseInt(sheen.id))}
                                    onChange={() => toggleSheenId(sheen.id)}
                                    __nextHasNoMarginBottom
                                />
                            ))}
                        </div>
                    </div>
                </PanelRow>
                <PanelRow>
                    <div style={{ width: '100%' }}>
                        <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Available Sizes</label>
                        <p style={{ color: '#666', fontSize: '12px', margin: '0 0 10px 0' }}>Select the sizes that this product family is physically available in.</p>
                        <div style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '10px', maxHeight: '150px', overflowY: 'auto', background: '#fafafa' }}>
                            {(!sizes || sizes.length === 0) ? (
                                <span style={{ color: '#999', fontSize: '13px' }}>No sizes created yet.</span>
                            ) : sizes.map(size => (
                                <CheckboxControl
                                    key={size.id}
                                    label={size.name}
                                    checked={selectedSizeIds.includes(parseInt(size.id))}
                                    onChange={() => toggleSizeId(size.id)}
                                    __nextHasNoMarginBottom
                                />
                            ))}
                        </div>
                    </div>
                </PanelRow>
                <PanelRow>
                    <div style={{ width: '100%' }}>
                        <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Family Images (first image = PLP thumbnail)</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'flex-start' }}>
                            {galleryImages.map((img, index) => (
                                <div key={img.id} style={{ position: 'relative', border: index === 0 ? '3px solid #0073aa' : '1px solid #ddd', borderRadius: '6px', overflow: 'hidden' }}>
                                    <img
                                        src={img.url}
                                        alt={`Gallery ${index + 1}`}
                                        style={{ width: '100px', height: '100px', objectFit: 'cover', display: 'block' }}
                                    />
                                    {index === 0 && (
                                        <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#0073aa', color: '#fff', fontSize: '10px', textAlign: 'center', padding: '2px 0' }}>Thumbnail</span>
                                    )}
                                    <Button
                                        isSmall
                                        isDestructive
                                        onClick={() => removeGalleryImage(index)}
                                        style={{ position: 'absolute', top: '-4px', right: '-4px', borderRadius: '50%', minWidth: '20px', height: '20px', padding: 0, fontSize: '11px', lineHeight: '20px' }}
                                    >
                                        ✕
                                    </Button>
                                </div>
                            ))}
                            <div
                                onClick={openGalleryUploader}
                                style={{
                                    width: '100px', height: '100px', border: '2px dashed #ccc', borderRadius: '6px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                    color: '#999', fontSize: '12px', textAlign: 'center',
                                    transition: 'border-color 0.2s',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#0073aa'}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#ccc'}
                            >
                                <span>📷<br />Add</span>
                            </div>
                        </div>
                    </div>
                </PanelRow>
                <PanelRow>
                    <WPEditorField
                        id="ps-product-family-short-desc"
                        label="Short Description (displayed above the product builder)"
                        value={shortDescription}
                        onChange={setShortDescription}
                    />
                </PanelRow>
                <PanelRow>
                    <WPEditorField
                        id="ps-product-family-desc"
                        label="Full Description (optional)"
                        value={description}
                        onChange={setDescription}
                    />
                </PanelRow>
                <PanelRow>
                    <WPEditorField
                        id="ps-product-family-how-to-use"
                        label="How to Use (Application Instructions)"
                        value={howToUse}
                        onChange={setHowToUse}
                    />
                </PanelRow>
                <PanelRow>
                    <div style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <label style={{ fontWeight: 600 }}>Datasheets (SDS/PDS)</label>
                            <Button isSmall variant="secondary" onClick={addDatasheetRow}>+ Add Datasheet Row</Button>
                        </div>
                        {datasheets.length === 0 ? (
                            <p style={{ color: '#666', fontSize: '13px', fontStyle: 'italic' }}>No datasheets added yet. Click the button above to add one.</p>
                        ) : (
                            <div style={{ border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
                                <table className="wp-list-table widefat striped" style={{ margin: 0, border: 'none' }}>
                                    <thead>
                                        <tr>
                                            <th>Product #</th>
                                            <th>Sheen</th>
                                            <th>Base/Color</th>
                                            <th>Container Size</th>
                                            <th>SDS File</th>
                                            <th>PDS File</th>
                                            <th style={{ width: '50px' }}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {datasheets.map((row, index) => (
                                            <tr key={index}>
                                                <td><TextControl value={row.product_number} onChange={(val) => updateDatasheetRow(index, 'product_number', val)} __nextHasNoMarginBottom /></td>
                                                <td><TextControl value={row.sheen} onChange={(val) => updateDatasheetRow(index, 'sheen', val)} __nextHasNoMarginBottom /></td>
                                                <td><TextControl value={row.base_color} onChange={(val) => updateDatasheetRow(index, 'base_color', val)} __nextHasNoMarginBottom /></td>
                                                <td><TextControl value={row.container_size} onChange={(val) => updateDatasheetRow(index, 'container_size', val)} __nextHasNoMarginBottom /></td>
                                                <td>
                                                    {row.sds_file_url ? (
                                                        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                                            <a href={row.sds_file_url} target="_blank" rel="noreferrer" title="View PDF">📄</a>
                                                            <Button isSmall isDestructive variant="tertiary" onClick={() => removePdf(index, 'sds')} style={{ padding: '0 5px' }}>Remove</Button>
                                                        </div>
                                                    ) : (
                                                        <Button isSmall variant="secondary" onClick={() => openPdfUploader(index, 'sds')}>Upload SDS</Button>
                                                    )}
                                                </td>
                                                <td>
                                                    {row.pds_file_url ? (
                                                        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                                            <a href={row.pds_file_url} target="_blank" rel="noreferrer" title="View PDF">📄</a>
                                                            <Button isSmall isDestructive variant="tertiary" onClick={() => removePdf(index, 'pds')} style={{ padding: '0 5px' }}>Remove</Button>
                                                        </div>
                                                    ) : (
                                                        <Button isSmall variant="secondary" onClick={() => openPdfUploader(index, 'pds')}>Upload PDS</Button>
                                                    )}
                                                </td>
                                                <td>
                                                    <Button isSmall isDestructive onClick={() => removeDatasheetRow(index)}>X</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </PanelRow>
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
                <thead><tr><th style={{ width: '40px' }}>ID</th><th style={{ width: '50px' }}>Image</th><th>Name</th><th>Brand</th><th>Categories</th><th>Surface Types</th><th>Sheens</th><th>Sizes</th><th>WooCommerce</th><th style={{ width: '180px' }}>Actions</th></tr></thead>
                <tbody>
                    {productFamilies.length === 0 ? (
                        <tr><td colSpan="8">No product families found.</td></tr>
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
                            <td style={{ fontSize: '12px' }}>{getCategoryNames(item.category_ids)}</td>
                            <td style={{ fontSize: '12px' }}>{getSurfaceTypeNames(item.surface_type_ids)}</td>
                            <td style={{ fontSize: '12px' }}>{getSheenNames(item.sheen_ids)}</td>
                            <td style={{ fontSize: '12px' }}>{getSizeNames(item.size_ids)}</td>
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
