import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { Button, TextControl, SelectControl, CheckboxControl, PanelBody, PanelRow } from '@wordpress/components';
import WPEditorField from '../shared/WPEditorField';

const ProductFamiliesManager = ({ productFamilies, productBrands, productCategories, surfaceTypes, sceneImages, sheens, sizes, colors, productMakes, toolAttributes, fetchProductFamilies }) => {
    const [name, setName] = useState('');
    const [brandId, setBrandId] = useState('');
    const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
    const [selectedSurfaceTypeIds, setSelectedSurfaceTypeIds] = useState([]);
    const [selectedSceneIds, setSelectedSceneIds] = useState([]);
    const [selectedSheenIds, setSelectedSheenIds] = useState([]);
    const [selectedSizeIds, setSelectedSizeIds] = useState([]);
    const [selectedWidthIds, setSelectedWidthIds] = useState([]);
    const [description, setDescription] = useState('');
    const [shortDescription, setShortDescription] = useState('');
    const [howToUse, setHowToUse] = useState('');
    const [datasheets, setDatasheets] = useState([]);
    const [galleryImages, setGalleryImages] = useState([]);
    const [makeId, setMakeId] = useState('');
    const [selectedFamilyColorIds, setSelectedFamilyColorIds] = useState([]);
    const [familyColorSearch, setFamilyColorSearch] = useState('');

    // Brush Tool Properties (now foreign-key IDs)
    const [toolHandleShapeId, setToolHandleShapeId] = useState('0');
    const [toolBristleMaterialId, setToolBristleMaterialId] = useState('0');
    const [toolHeadShapeId, setToolHeadShapeId] = useState('0');
    const [toolHandleLengthId, setToolHandleLengthId] = useState('0');
    const [toolHandleMaterialId, setToolHandleMaterialId] = useState('0');
    const [toolStiffnessId, setToolStiffnessId] = useState('0');
    const [toolPaintCompatId, setToolPaintCompatId] = useState('0');
    const [toolFerruleMaterialId, setToolFerruleMaterialId] = useState('0');

    // Helper: build <SelectControl> options for a given attribute_type
    const toolAttrOptions = (type) => [
        { label: '— Select —', value: '0' },
        ...((toolAttributes || []).filter(a => a.attribute_type === type).map(a => ({ label: a.name, value: String(a.id) })))
    ];

    // Derive the selected make's slug for conditional sections
    const selectedMake = (productMakes || []).find(m => String(m.id) === String(makeId));
    const selectedMakeSlug = selectedMake ? selectedMake.slug : '';

    // Compare Attributes State
    const [compareAttributes, setCompareAttributes] = useState({
        resin_type: '',
        mildew_resistant: false,
        for_use_on_trim: false,
        pre_tinted: false,
        washable: false,
        for_use_on_wood: false,
        use_location: '',
        max_coverage_area: '',
        dry_to_touch: '',
        greenguard_gold: false,
        for_use_on_metal: false,
        for_use_on_drywall: false,
        for_use_on_concrete: false,
        for_use_on_ceilings: false,
        for_use_on_cabinets: false,
        for_use_on_furniture: false,
        for_use_on_fiberglass: false,
    });

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

    const toggleWidthId = (id) => {
        const numId = parseInt(id);
        setSelectedWidthIds(prev =>
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
                make_id: parseInt(makeId) || 0,
                category_ids: selectedCategoryIds,
                surface_type_ids: selectedSurfaceTypeIds,
                scene_ids: selectedSceneIds,
                sheen_ids: selectedSheenIds,
                size_ids: selectedSizeIds,
                width_ids: selectedWidthIds,
                description,
                short_description: shortDescription,
                how_to_use: howToUse,
                datasheets: datasheets,
                gallery_image_ids: galleryImages.map(img => img.id),
                compare_attributes: JSON.stringify(compareAttributes),
                family_color_ids: selectedMakeSlug === 'wood-stains' || selectedMakeSlug === 'specialty-coatings' ? selectedFamilyColorIds : [],
                tool_handle_shape_id: selectedMakeSlug === 'brushes' ? parseInt(toolHandleShapeId) || 0 : 0,
                tool_bristle_material_id: selectedMakeSlug === 'brushes' ? parseInt(toolBristleMaterialId) || 0 : 0,
                tool_head_shape_id: selectedMakeSlug === 'brushes' ? parseInt(toolHeadShapeId) || 0 : 0,
                tool_handle_length_id: selectedMakeSlug === 'brushes' ? parseInt(toolHandleLengthId) || 0 : 0,
                tool_handle_material_id: selectedMakeSlug === 'brushes' ? parseInt(toolHandleMaterialId) || 0 : 0,
                tool_stiffness_id: selectedMakeSlug === 'brushes' ? parseInt(toolStiffnessId) || 0 : 0,
                tool_paint_compat_id: selectedMakeSlug === 'brushes' ? parseInt(toolPaintCompatId) || 0 : 0,
                tool_ferrule_material_id: selectedMakeSlug === 'brushes' ? parseInt(toolFerruleMaterialId) || 0 : 0
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
        setName(''); setBrandId(''); setSelectedCategoryIds([]); setSelectedSurfaceTypeIds([]); setSelectedSceneIds([]); setSelectedSheenIds([]); setSelectedSizeIds([]); setSelectedWidthIds([]);
        setDescription(''); setShortDescription(''); setHowToUse(''); setDatasheets([]); setGalleryImages([]);
        setMakeId(''); setSelectedFamilyColorIds([]); setFamilyColorSearch('');
        setToolHandleShapeId('0'); setToolBristleMaterialId('0'); setToolHeadShapeId('0'); setToolHandleLengthId('0'); setToolHandleMaterialId('0'); setToolStiffnessId('0'); setToolPaintCompatId('0'); setToolFerruleMaterialId('0');
        setCompareAttributes({
            resin_type: '', mildew_resistant: false, for_use_on_trim: false, pre_tinted: false, washable: false, for_use_on_wood: false,
            use_location: '', max_coverage_area: '', dry_to_touch: '', greenguard_gold: false, for_use_on_metal: false, for_use_on_drywall: false,
            for_use_on_concrete: false, for_use_on_ceilings: false, for_use_on_cabinets: false, for_use_on_furniture: false, for_use_on_fiberglass: false,
        });
        setEditingId(null);
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
        setSelectedWidthIds(item.width_ids || []);
        setMakeId(item.make_id == 0 ? '' : String(item.make_id));
        setSelectedFamilyColorIds(item.family_color_ids || []);
        setFamilyColorSearch('');
        setDescription(item.description || '');
        setShortDescription(item.short_description || '');
        setHowToUse(item.how_to_use || '');
        setDatasheets(item.datasheets || []);
        setGalleryImages(item.gallery_images || []);

        // Hydrate Brush Properties (FK IDs)
        setToolHandleShapeId(String(item.tool_handle_shape_id || 0));
        setToolBristleMaterialId(String(item.tool_bristle_material_id || 0));
        setToolHeadShapeId(String(item.tool_head_shape_id || 0));
        setToolHandleLengthId(String(item.tool_handle_length_id || 0));
        setToolHandleMaterialId(String(item.tool_handle_material_id || 0));
        setToolStiffnessId(String(item.tool_stiffness_id || 0));
        setToolPaintCompatId(String(item.tool_paint_compat_id || 0));
        setToolFerruleMaterialId(String(item.tool_ferrule_material_id || 0));

        // Parse Compare Attributes
        let parsedAttrs = {};
        if (item.compare_attributes) {
            try {
                parsedAttrs = typeof item.compare_attributes === 'string' ? JSON.parse(item.compare_attributes) : item.compare_attributes;
            } catch (e) { console.error("Error parsing compare attributes", e); }
        }
        setCompareAttributes({
            resin_type: parsedAttrs.resin_type || '',
            mildew_resistant: !!parsedAttrs.mildew_resistant,
            for_use_on_trim: !!parsedAttrs.for_use_on_trim,
            pre_tinted: !!parsedAttrs.pre_tinted,
            washable: !!parsedAttrs.washable,
            for_use_on_wood: !!parsedAttrs.for_use_on_wood,
            use_location: parsedAttrs.use_location || '',
            max_coverage_area: parsedAttrs.max_coverage_area || '',
            dry_to_touch: parsedAttrs.dry_to_touch || '',
            greenguard_gold: !!parsedAttrs.greenguard_gold,
            for_use_on_metal: !!parsedAttrs.for_use_on_metal,
            for_use_on_drywall: !!parsedAttrs.for_use_on_drywall,
            for_use_on_concrete: !!parsedAttrs.for_use_on_concrete,
            for_use_on_ceilings: !!parsedAttrs.for_use_on_ceilings,
            for_use_on_cabinets: !!parsedAttrs.for_use_on_cabinets,
            for_use_on_furniture: !!parsedAttrs.for_use_on_furniture,
            for_use_on_fiberglass: !!parsedAttrs.for_use_on_fiberglass,
        });
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
                    <div style={{ width: '100%', background: '#f0f6ff', border: '1px solid #b8d4f0', borderRadius: '6px', padding: '15px', marginBottom: '5px' }}>
                        <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#1e3a5f' }}>{"\ud83c\udff7\ufe0f"} Product Classification</h3>
                        <SelectControl
                            label="Product Make"
                            value={makeId}
                            options={[
                                { label: '— Select Product Make —', value: '' },
                                ...(productMakes || []).map(m => ({ label: `${m.name} (${m.type_name || ''})`, value: String(m.id) }))
                            ]}
                            onChange={setMakeId}
                        />
                    </div>
                </PanelRow>
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

                {/* Wood Stain / Specialty Color Mapping */}
                {(selectedMakeSlug === 'wood-stains' || selectedMakeSlug === 'specialty-coatings' || selectedMakeSlug === 'wood-protective-finish' || selectedMakeSlug === 'wood-sealer') && (
                    <PanelRow>
                        <div style={{ width: '100%', background: '#fff8e6', border: '1px solid #f0d060', borderRadius: '6px', padding: '15px' }}>
                            <h3 style={{ margin: '0 0 8px 0', fontSize: '15px', color: '#8b6914' }}>{'\ud83e\udeb5'} Assign Specific Colors to This Family</h3>
                            <p style={{ color: '#666', fontSize: '12px', margin: '0 0 12px 0' }}>Search and select the exact colors available for this product family. Only these colors will appear on the product page.</p>
                            <TextControl
                                label="Search Colors"
                                value={familyColorSearch}
                                onChange={setFamilyColorSearch}
                                placeholder="Type to filter colors by name or code..."
                            />
                            <div style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '10px', maxHeight: '200px', overflowY: 'auto', background: '#fff' }}>
                                {(!colors || colors.length === 0) ? (
                                    <span style={{ color: '#999', fontSize: '13px' }}>No colors have been created yet. Go to Colors & Families to add colors first.</span>
                                ) : (() => {
                                    const filtered = colors.filter(c => {
                                        if (!familyColorSearch) return true;
                                        const q = familyColorSearch.toLowerCase();
                                        return (c.name && c.name.toLowerCase().includes(q)) || (c.color_code && c.color_code.toLowerCase().includes(q));
                                    });
                                    if (filtered.length === 0) return <span style={{ color: '#999', fontSize: '13px' }}>No colors match your search.</span>;
                                    return filtered.slice(0, 100).map(c => (
                                        <CheckboxControl
                                            key={c.id}
                                            label={<span>{c.hex_value && <span style={{ display: 'inline-block', width: '14px', height: '14px', borderRadius: '3px', background: c.hex_value, border: '1px solid #ccc', marginRight: '6px', verticalAlign: 'middle' }}></span>}{c.name} {c.color_code ? `(${c.color_code})` : ''}</span>}
                                            checked={selectedFamilyColorIds.includes(parseInt(c.id))}
                                            onChange={() => {
                                                const numId = parseInt(c.id);
                                                setSelectedFamilyColorIds(prev => prev.includes(numId) ? prev.filter(x => x !== numId) : [...prev, numId]);
                                            }}
                                            __nextHasNoMarginBottom
                                        />
                                    ));
                                })()}
                            </div>
                            {selectedFamilyColorIds.length > 0 && (
                                <p style={{ marginTop: '8px', fontSize: '12px', color: '#555' }}>{'\u2705'} {selectedFamilyColorIds.length} color(s) selected</p>
                            )}
                        </div>
                    </PanelRow>
                )}

                {/* Brush Tool Attributes Mapping */}
                {selectedMakeSlug === 'brushes' && (
                    <PanelRow>
                        <div style={{ width: '100%', background: '#f4f9f4', border: '1px solid #c8e6c9', borderRadius: '6px', padding: '15px' }}>
                            <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#2e7d32' }}>🖌️ Brush Specification Attributes</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <SelectControl label="Handle Shape" value={toolHandleShapeId} options={toolAttrOptions('handle_shape')} onChange={setToolHandleShapeId} />
                                <SelectControl label="Bristle Material" value={toolBristleMaterialId} options={toolAttrOptions('bristle_material')} onChange={setToolBristleMaterialId} />
                                <SelectControl label="Head Shape" value={toolHeadShapeId} options={toolAttrOptions('head_shape')} onChange={setToolHeadShapeId} />
                                <SelectControl label="Handle Length" value={toolHandleLengthId} options={toolAttrOptions('handle_length')} onChange={setToolHandleLengthId} />
                                <SelectControl label="Handle Material" value={toolHandleMaterialId} options={toolAttrOptions('handle_material')} onChange={setToolHandleMaterialId} />
                                <SelectControl label="Stiffness / Texture" value={toolStiffnessId} options={toolAttrOptions('texture')} onChange={setToolStiffnessId} />
                                <SelectControl label="Brush Type" value={toolPaintCompatId} options={toolAttrOptions('brush_type')} onChange={setToolPaintCompatId} />
                                <SelectControl label="Ferrule Material" value={toolFerruleMaterialId} options={toolAttrOptions('ferrule_material')} onChange={setToolFerruleMaterialId} />
                            </div>
                            <div style={{ marginTop: '20px' }}>
                                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Available Brush Widths</label>
                                <p style={{ color: '#666', fontSize: '12px', margin: '0 0 10px 0' }}>Select the widths that this brush family is available in.</p>
                                <div style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '10px', maxHeight: '150px', overflowY: 'auto', background: '#fafafa', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))' }}>
                                    {(toolAttributes || []).filter(a => a.attribute_type === 'width').map(width => (
                                        <CheckboxControl
                                            key={width.id}
                                            label={width.name}
                                            checked={selectedWidthIds.includes(parseInt(width.id))}
                                            onChange={() => toggleWidthId(width.id)}
                                            __nextHasNoMarginBottom
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </PanelRow>
                )}

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

                <PanelRow>
                    <div style={{ width: '100%', background: '#f5fbff', border: '1px solid #7ebef2', borderRadius: '4px', padding: '15px' }}>
                        <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#00598E' }}>Compare Specifications</h3>
                        <p style={{ color: '#555', fontSize: '13px', margin: '0 0 20px 0' }}>These attributes appear in the side-by-side product comparison feature on the frontend.</p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                            <TextControl label="Resin Type (e.g. 100% Acrylic)" value={compareAttributes.resin_type} onChange={(v) => setCompareAttributes({ ...compareAttributes, resin_type: v })} />
                            <TextControl label="Use Location (e.g. Interior)" value={compareAttributes.use_location} onChange={(v) => setCompareAttributes({ ...compareAttributes, use_location: v })} />
                            <TextControl label="Max Coverage Area (e.g. 400 Sq. Ft.)" value={compareAttributes.max_coverage_area} onChange={(v) => setCompareAttributes({ ...compareAttributes, max_coverage_area: v })} />
                            <TextControl label="Dry to Touch (e.g. 1 Hour)" value={compareAttributes.dry_to_touch} onChange={(v) => setCompareAttributes({ ...compareAttributes, dry_to_touch: v })} />

                            <div style={{ padding: '10px 0' }}>
                                <CheckboxControl label="Mildew Resistant" checked={compareAttributes.mildew_resistant} onChange={(v) => setCompareAttributes({ ...compareAttributes, mildew_resistant: v })} />
                                <CheckboxControl label="Washable" checked={compareAttributes.washable} onChange={(v) => setCompareAttributes({ ...compareAttributes, washable: v })} />
                            </div>
                            <div style={{ padding: '10px 0' }}>
                                <CheckboxControl label="Pre-Tinted" checked={compareAttributes.pre_tinted} onChange={(v) => setCompareAttributes({ ...compareAttributes, pre_tinted: v })} />
                                <CheckboxControl label="GREENGUARD Gold Certified" checked={compareAttributes.greenguard_gold} onChange={(v) => setCompareAttributes({ ...compareAttributes, greenguard_gold: v })} />
                            </div>
                        </div>

                        <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>For Use On:</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', background: '#fff', padding: '15px', border: '1px solid #ddd', borderRadius: '4px' }}>
                            <CheckboxControl label="Trim" checked={compareAttributes.for_use_on_trim} onChange={(v) => setCompareAttributes({ ...compareAttributes, for_use_on_trim: v })} />
                            <CheckboxControl label="Wood" checked={compareAttributes.for_use_on_wood} onChange={(v) => setCompareAttributes({ ...compareAttributes, for_use_on_wood: v })} />
                            <CheckboxControl label="Metal" checked={compareAttributes.for_use_on_metal} onChange={(v) => setCompareAttributes({ ...compareAttributes, for_use_on_metal: v })} />
                            <CheckboxControl label="Drywall" checked={compareAttributes.for_use_on_drywall} onChange={(v) => setCompareAttributes({ ...compareAttributes, for_use_on_drywall: v })} />
                            <CheckboxControl label="Concrete/Masonry" checked={compareAttributes.for_use_on_concrete} onChange={(v) => setCompareAttributes({ ...compareAttributes, for_use_on_concrete: v })} />
                            <CheckboxControl label="Ceilings" checked={compareAttributes.for_use_on_ceilings} onChange={(v) => setCompareAttributes({ ...compareAttributes, for_use_on_ceilings: v })} />
                            <CheckboxControl label="Cabinets" checked={compareAttributes.for_use_on_cabinets} onChange={(v) => setCompareAttributes({ ...compareAttributes, for_use_on_cabinets: v })} />
                            <CheckboxControl label="Furniture" checked={compareAttributes.for_use_on_furniture} onChange={(v) => setCompareAttributes({ ...compareAttributes, for_use_on_furniture: v })} />
                            <CheckboxControl label="Fiberglass" checked={compareAttributes.for_use_on_fiberglass} onChange={(v) => setCompareAttributes({ ...compareAttributes, for_use_on_fiberglass: v })} />
                        </div>
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
                <thead><tr><th style={{ width: '40px' }}>ID</th><th style={{ width: '50px' }}>Image</th><th>Name</th><th>Type</th><th>Brand</th><th>Categories</th><th>Sheens</th><th>Sizes</th><th>WooCommerce</th><th style={{ width: '180px' }}>Actions</th></tr></thead>
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
                            <td style={{ fontSize: '12px' }}>
                                {(() => {
                                    const make = (productMakes || []).find(m => String(m.id) === String(item.make_id));
                                    if (!make) return <span style={{ color: '#999', fontSize: '11px' }}>Unassigned</span>;
                                    const isTools = make.type_name === 'Tools';
                                    return (
                                        <span style={{ background: isTools ? '#e8f0fe' : '#e8f5e9', color: isTools ? '#174ea6' : '#2e7d32', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 600 }}>
                                            {make.name}
                                        </span>
                                    );
                                })()}
                            </td>
                            <td>{getBrandName(item.brand_id)}</td>
                            <td style={{ fontSize: '12px' }}>{getCategoryNames(item.category_ids)}</td>
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
