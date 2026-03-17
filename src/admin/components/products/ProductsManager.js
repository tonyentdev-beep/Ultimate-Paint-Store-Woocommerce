import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { Button, TextControl, TextareaControl, SelectControl, PanelBody, PanelRow } from '@wordpress/components';

const WOOD_STAIN_SLUGS = ['wood-stains-oil-based', 'wood-stains-water-based', 'wood-sealer', 'wood-stain-markers', 'wood-protective-finish'];
const BRUSH_SLUGS = ['brushes'];
const PRIMER_SLUGS = ['primers', 'primer'];

const ProductsManager = ({
    products,
    productFamilies,
    productMakes,
    bases,
    sizes,
    sheens,
    surfaceTypes,
    toolAttributes,
    fetchProducts
}) => {
    const [familyId, setFamilyId] = useState('');
    const [baseId, setBaseId] = useState('');
    const [sizeId, setSizeId] = useState('');
    const [sheenId, setSheenId] = useState('');
    const [surfaceId, setSurfaceId] = useState('');
    const [widthId, setWidthId] = useState('');
    const [sku, setSku] = useState('');
    const [price, setPrice] = useState('0.00');
    const [stockQuantity, setStockQuantity] = useState('0');
    const [description, setDescription] = useState('');

    // Wood stain-specific fields
    const [colorName, setColorName] = useState('');
    const [opacity, setOpacity] = useState('');
    const [stainImages, setStainImages] = useState([]);

    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Import State
    const [csvFile, setCsvFile] = useState(null);
    const [isImporting, setIsImporting] = useState(false);
    const [importLog, setImportLog] = useState([]);

    // Filters
    const [filterFamilyId, setFilterFamilyId] = useState('');
    const [filterBaseId, setFilterBaseId] = useState('');
    const [filterSizeId, setFilterSizeId] = useState('');
    const [filterSheenId, setFilterSheenId] = useState('');
    const [filterSurfaceId, setFilterSurfaceId] = useState('');
    const [filterSku, setFilterSku] = useState('');

    // Derive if selected family is a wood stain make
    const selectedFamily = productFamilies.find(f => String(f.id) === String(familyId));
    const selectedMake = selectedFamily ? (productMakes || []).find(m => String(m.id) === String(selectedFamily.make_id)) : null;
    const isWoodStain = selectedMake ? WOOD_STAIN_SLUGS.includes(selectedMake.slug) : false;
    const isBrush = selectedMake ? BRUSH_SLUGS.includes(selectedMake.slug) : false;
    const isPrimer = selectedMake ? PRIMER_SLUGS.includes(selectedMake.slug) : false;

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

    const widthOptions = [
        { label: 'Select Width...', value: '' },
        ...((toolAttributes || [])
            .filter(a => a.attribute_type === 'width' && (selectedFamily?.width_ids || []).includes(parseInt(a.id)))
            .map(a => ({ label: a.name, value: a.id.toString() })))
    ];

    const opacityOptions = [
        { label: '— Select Opacity —', value: '' },
        { label: 'Transparent', value: 'transparent' },
        { label: 'Semi-Transparent', value: 'semi-transparent' },
        { label: 'Solid', value: 'solid' },
    ];

    const getFamilyName = (id) => productFamilies.find(f => parseInt(f.id) === parseInt(id))?.name || '-';
    const getBaseName = (id) => bases.find(b => parseInt(b.id) === parseInt(id))?.name || '-';
    const getSizeName = (id) => sizes.find(s => parseInt(s.id) === parseInt(id))?.name || '-';
    const getSizeLiters = (id) => {
        const sizeObj = sizes.find(s => parseInt(s.id) === parseInt(id));
        return sizeObj ? parseFloat(sizeObj.liters || 0) : 0;
    };
    const getSheenName = (id) => sheens.find(s => parseInt(s.id) === parseInt(id))?.name || '-';
    const getSurfaceName = (id) => surfaceTypes.find(s => parseInt(s.id) === parseInt(id))?.name || '-';
    const getWidthName = (id) => (toolAttributes || []).find(a => parseInt(a.id) === parseInt(id))?.name || '-';

    const getFamilyMakeSlug = (familyIdVal) => {
        const fam = productFamilies.find(f => parseInt(f.id) === parseInt(familyIdVal));
        if (!fam) return '';
        const make = (productMakes || []).find(m => String(m.id) === String(fam.make_id));
        return make ? make.slug : '';
    };

    const filteredProducts = products.filter(p => {
        if (filterFamilyId && p.family_id.toString() !== filterFamilyId) return false;
        if (filterBaseId && p.base_id.toString() !== filterBaseId) return false;
        if (filterSizeId && p.size_id.toString() !== filterSizeId) return false;
        if (filterSheenId && p.sheen_id.toString() !== filterSheenId) return false;
        if (filterSurfaceId && p.surface_id.toString() !== filterSurfaceId) return false;
        if (filterSku && !p.sku.toLowerCase().includes(filterSku.toLowerCase())) return false;
        return true;
    });

    // WordPress media uploader for stain images
    const openStainImageUploader = () => {
        const frame = wp.media({
            title: 'Select Stain Color Images',
            multiple: true,
            library: { type: 'image' }
        });
        frame.on('select', () => {
            const attachments = frame.state().get('selection').map(a => a.toJSON());
            const newImages = attachments.map(a => ({ id: a.id, url: a.url }));
            
            // Append avoiding duplicates
            setStainImages(prev => {
                const combined = [...prev, ...newImages];
                const uniqueIds = new Set();
                return combined.filter(img => {
                    if (uniqueIds.has(img.id)) return false;
                    uniqueIds.add(img.id);
                    return true;
                });
            });
        });
        frame.open();
    };

    const removeStainImage = (idToRemove) => {
        setStainImages(prev => prev.filter(img => img.id !== idToRemove));
    };

    const handleSave = async () => {
        if (!familyId) { alert('Product Family is required.'); return; }

        if (isBrush) {
            if (!widthId) { alert('Size (width) is required for brush SKUs.'); return; }
        } else if (isWoodStain) {
            if (!sizeId || !surfaceId) { alert('Size and Surface/Project Type are required.'); return; }
        } else if (isPrimer) {
            if (!sizeId || !surfaceId) { alert('Size and Surface/Project Type are required for primers.'); return; }
        } else {
            if (!baseId || !sizeId || !sheenId || !surfaceId) {
                alert('All relation fields are required to map a physical product.');
                return;
            }
        }

        setIsSaving(true);
        try {
            const data = {
                family_id: familyId,
                base_id: (isWoodStain || isBrush || isPrimer) ? 0 : baseId,
                size_id: isBrush ? 0 : sizeId,
                sheen_id: (isWoodStain || isBrush || isPrimer) ? 0 : sheenId,
                surface_id: isBrush ? 0 : surfaceId,
                width_id: isBrush ? widthId : 0,
                sku: sku,
                price: parseFloat(price) || 0.00,
                description: description,
                stock_quantity: parseInt(stockQuantity, 10) || 0,
                color_name: isWoodStain ? colorName : '',
                opacity: isWoodStain ? opacity : '',
                stain_image_ids: isWoodStain ? stainImages.map(img => img.id) : []
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
        setWidthId(item.width_id ? item.width_id.toString() : '');
        setSku(item.sku);
        setPrice(item.price.toString());
        setDescription(item.description || '');
        setStockQuantity((item.stock_quantity || 0).toString());
        setColorName(item.color_name || '');
        setOpacity(item.opacity || '');
        setStainImages(item.stain_images || []);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFamilyId('');
        setBaseId('');
        setSizeId('');
        setSheenId('');
        setSurfaceId('');
        setWidthId('');
        setSku('');
        setPrice('0.00');
        setDescription('');
        setStockQuantity('0');
        setColorName('');
        setOpacity('');
        setStainImages([]);
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

    // --- CSV Import Logic ---
    const handleCsvUpload = (event) => {
        const file = event.target.files[0];
        if (file) { setCsvFile(file); setImportLog([]); }
    };

    const processCsv = () => {
        if (!csvFile) return;
        setIsImporting(true);
        setImportLog(['Starting CSV import...']);
        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target.result;
            const lines = text.split('\n').filter(line => line.trim() !== '');
            if (lines.length < 2) { setImportLog(prev => [...prev, 'Error: Empty or invalid CSV.']); setIsImporting(false); return; }
            const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
            const expectedHeaders = ['sku', 'price', 'family', 'base', 'size', 'sheen', 'surface type'];
            const missingHeaders = expectedHeaders.filter(eh => !headers.some(h => h.includes(eh)));
            if (missingHeaders.length > 0) { setImportLog(prev => [...prev, `Error: Missing columns: ${missingHeaders.join(', ')}`]); setIsImporting(false); return; }
            const getColIndex = (colName) => headers.findIndex(h => h.includes(colName));
            const skuIdx = getColIndex('sku'); const priceIdx = getColIndex('price');
            const familyIdx = getColIndex('family'); const baseIdx = getColIndex('base');
            const sizeIdx = getColIndex('size'); const sheenIdx = getColIndex('sheen');
            const surfaceIdx = getColIndex('surface type');
            const parsedProducts = [];
            for (let i = 1; i < lines.length; i++) {
                if (!lines[i].trim()) continue;
                const row = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.replace(/^"|"$/g, '').trim());
                if (row.length < headers.length) { setImportLog(prev => [...prev, `Row ${i + 1}: Skipping, invalid column count.`]); continue; }
                const matchName = (arr, name) => arr.find(item => item.name.toLowerCase() === (name || '').toLowerCase());
                const fFamily = matchName(productFamilies, row[familyIdx]);
                const fBase = matchName(bases, row[baseIdx]);
                const fSize = matchName(sizes, row[sizeIdx]);
                const fSheen = matchName(sheens, row[sheenIdx]);
                const fSurface = matchName(surfaceTypes, row[surfaceIdx]);
                if (!fFamily || !fBase || !fSize || !fSheen || !fSurface) { setImportLog(prev => [...prev, `Row ${i + 1}: Skipped SKU ${row[skuIdx]} — unresolvable relation.`]); continue; }
                parsedProducts.push({ sku: row[skuIdx], price: parseFloat(row[priceIdx]) || 0, family_id: fFamily.id, base_id: fBase.id, size_id: fSize.id, sheen_id: fSheen.id, surface_id: fSurface.id });
            }
            if (parsedProducts.length === 0) { setImportLog(prev => [...prev, 'No valid rows found.']); setIsImporting(false); return; }
            setImportLog(prev => [...prev, `Found ${parsedProducts.length} valid rows. Sending...`]);
            try {
                const response = await apiFetch({ path: '/paint-store/v1/products/bulk-import', method: 'POST', data: { products: parsedProducts } });
                if (response.success) {
                    setImportLog(prev => [...prev, `Success: Imported ${response.imported} products.`]);
                    if (response.errors?.length > 0) setImportLog(prev => [...prev, 'Errors:', ...response.errors]);
                    fetchProducts();
                } else { setImportLog(prev => [...prev, 'Import failed.']); }
            } catch (error) { setImportLog(prev => [...prev, `API Error: ${error.message || JSON.stringify(error)}`]); }
            setIsImporting(false);
        };
        reader.onerror = () => { setImportLog(prev => [...prev, 'Error reading file.']); setIsImporting(false); };
        reader.readAsText(csvFile);
    };

    const canSave = isBrush
        ? !!familyId && !!widthId && !isSaving
        : isWoodStain
            ? !!familyId && !!sizeId && !!surfaceId && !isSaving
            : isPrimer
                ? !!familyId && !!sizeId && !!surfaceId && !isSaving
                : !!familyId && !!baseId && !!sizeId && !!sheenId && !!surfaceId && !isSaving;

    return (
        <div className="products-manager">
            <PanelBody title={editingId ? "Edit Physical SKU" : "Add Physical SKU"} initialOpen={true}>

                {/* Step 1: Always select family first */}
                <PanelRow>
                    <div style={{ width: '100%' }}>
                        <SelectControl label="Parent Product Family" value={familyId} options={familyOptions} onChange={(v) => { setFamilyId(v); }} />
                        {selectedMake && (
                            <p style={{ margin: '-8px 0 10px', fontSize: '12px', color: '#666' }}>
                                Make: <strong style={{ background: isBrush ? '#e3f2fd' : isWoodStain ? '#fff3cd' : isPrimer ? '#e1bee7' : '#e8f5e9', padding: '2px 8px', borderRadius: '10px', fontSize: '11px' }}>{selectedMake.name}</strong>
                                {isWoodStain && <span style={{ marginLeft: '10px', color: '#8b6914', fontStyle: 'italic' }}>🪵 Wood Stain/Sealer form</span>}
                                {isBrush && <span style={{ marginLeft: '10px', color: '#1565c0', fontStyle: 'italic' }}>🖌️ Brush SKU form</span>}
                                {isPrimer && <span style={{ marginLeft: '10px', color: '#6a1b9a', fontStyle: 'italic' }}>💡 Primer form (Size only)</span>}
                            </p>
                        )}
                    </div>
                </PanelRow>

                {familyId && !isWoodStain && !isBrush && !isPrimer && (
                    <>
                        {/* Architectural Paint Form — existing layout */}
                        <PanelRow>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '100%' }}>
                                <SelectControl label="Required Paint Base" value={baseId} options={baseOptions} onChange={setBaseId} />
                                <SelectControl label="Sheen" value={sheenId} options={sheenOptions} onChange={setSheenId} />
                            </div>
                        </PanelRow>
                        <PanelRow>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', width: '100%' }}>
                                <SelectControl label="Size" value={sizeId} options={sizeOptions} onChange={setSizeId} />
                                <SelectControl label="Surface/Project Type" value={surfaceId} options={surfaceOptions} onChange={setSurfaceId} />
                                <TextControl label="SKU (Stock Keeping Unit)" value={sku} onChange={setSku} />
                            </div>
                        </PanelRow>
                        <PanelRow>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', width: '100%', marginTop: '5px' }}>
                                <TextControl type="number" step="0.01" label="Base Price ($)" value={price} onChange={setPrice} />
                                <TextControl type="number" step="1" label="Stock Quantity" value={stockQuantity} onChange={setStockQuantity} />
                            </div>
                        </PanelRow>
                    </>
                )}

                {familyId && isPrimer && (
                    <>
                        <PanelRow>
                            <div style={{ width: '100%', background: '#faf5ff', border: '1px solid #d1c4e9', borderRadius: '6px', padding: '15px', marginBottom: '5px' }}>
                                <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#6a1b9a' }}>💡 Primer SKU Details</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                                    <SelectControl label="Size" value={sizeId} options={sizeOptions} onChange={setSizeId} />
                                    <SelectControl label="Surface/Project Type" value={surfaceId} options={surfaceOptions} onChange={setSurfaceId} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginTop: '15px' }}>
                                    <TextControl label="SKU (Stock Keeping Unit)" value={sku} onChange={setSku} />
                                    <TextControl type="number" step="0.01" label="Base Price ($)" value={price} onChange={setPrice} />
                                    <TextControl type="number" step="1" label="Stock Quantity" value={stockQuantity} onChange={setStockQuantity} />
                                </div>
                            </div>
                        </PanelRow>
                    </>
                )}

                {familyId && isWoodStain && (
                    <>
                        {/* Wood Stain / Sealer Form */}
                        <PanelRow>
                            <div style={{ width: '100%', background: '#fffbeb', border: '1px solid #f0d060', borderRadius: '6px', padding: '15px', marginBottom: '5px' }}>
                                <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#8b6914' }}>🪵 Wood Stain / Sealer SKU Details</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                                    <SelectControl label="Size" value={sizeId} options={sizeOptions} onChange={setSizeId} />
                                    <SelectControl label="Surface/Project Type" value={surfaceId} options={surfaceOptions} onChange={setSurfaceId} />
                                    <SelectControl label="Opacity" value={opacity} options={opacityOptions} onChange={setOpacity} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '20px', marginTop: '15px' }}>
                                    <TextControl label="Color Name (e.g. Early American)" value={colorName} onChange={setColorName} />
                                    <TextControl label="SKU (Stock Keeping Unit)" value={sku} onChange={setSku} />
                                    <TextControl type="number" step="0.01" label="Color Price ($)" value={price} onChange={setPrice} />
                                    <TextControl type="number" step="1" label="Stock Quantity" value={stockQuantity} onChange={setStockQuantity} />
                                </div>
                                <div style={{ marginTop: '15px' }}>
                                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Stain Color Images (First image is primary variation swatch)</label>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '15px' }}>
                                        {stainImages.map((img, index) => (
                                            <div key={img.id} style={{ position: 'relative' }}>
                                                <img src={img.url} alt={`Stain color ${index + 1}`} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: index === 0 ? '2px solid #2e7d32' : '2px solid #e0c060' }} />
                                                {index === 0 && <span style={{ position: 'absolute', bottom: '-8px', left: '50%', transform: 'translateX(-50%)', background: '#2e7d32', color: '#fff', fontSize: '9px', padding: '2px 6px', borderRadius: '4px', whiteSpace: 'nowrap' }}>Primary</span>}
                                                <button
                                                    onClick={() => removeStainImage(img.id)}
                                                    style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#d63638', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px', lineHeight: '20px', textAlign: 'center' }}
                                                    title="Remove Image"
                                                >×</button>
                                            </div>
                                        ))}
                                        <div
                                            onClick={openStainImageUploader}
                                            style={{ width: '80px', height: '80px', border: '2px dashed #ccc', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#fafafa', fontSize: '24px', color: '#999' }}
                                            title="Add Images"
                                        >+</div>
                                        <Button variant="secondary" onClick={openStainImageUploader} style={{ marginLeft: '10px' }}>
                                            {stainImages.length > 0 ? 'Add More Images' : 'Upload Images'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </PanelRow>
                    </>
                )}

                {familyId && isBrush && (
                    <>
                        {/* Brush Form */}
                        <PanelRow>
                            <div style={{ width: '100%', background: '#e3f2fd', border: '1px solid #90caf9', borderRadius: '6px', padding: '15px', marginBottom: '5px' }}>
                                <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#1565c0' }}>🖌️ Brush SKU Details</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '20px' }}>
                                    <SelectControl label="Width / Size" value={widthId} options={widthOptions} onChange={setWidthId} />
                                    <TextControl label="SKU (Stock Keeping Unit)" value={sku} onChange={setSku} />
                                    <TextControl type="number" step="0.01" label="Price ($)" value={price} onChange={setPrice} />
                                    <TextControl type="number" step="1" label="Stock Quantity" value={stockQuantity} onChange={setStockQuantity} />
                                </div>
                            </div>
                        </PanelRow>
                    </>
                )}

                {familyId && (
                    <>
                        <PanelRow>
                            <div style={{ width: '100%', marginTop: '10px' }}>
                                <TextareaControl label="Description (SEO meta text)" value={description} onChange={setDescription} rows={3} />
                            </div>
                        </PanelRow>
                        <div style={{ padding: '20px 0 0 0', display: 'flex', gap: '10px' }}>
                            <Button variant="primary" onClick={handleSave} isBusy={isSaving} disabled={!canSave}>
                                {editingId ? 'Update Physical SKU' : 'Add Physical SKU'}
                            </Button>
                            {editingId && <Button variant="secondary" onClick={handleCancelEdit}>Cancel Edit</Button>}
                        </div>
                    </>
                )}
            </PanelBody>

            <PanelBody title="Bulk Import SKUs via CSV" initialOpen={false}>
                <PanelRow>
                    <div style={{ width: '100%', padding: '10px 0' }}>
                        <p style={{ marginTop: 0, fontSize: '13px', color: '#666' }}>
                            Upload a CSV with columns: <strong>SKU, Price, Family, Base, Size, Sheen, Surface Type</strong>.<br />
                            Relations must <strong>exactly match names</strong> of existing records.
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                            <input type="file" accept=".csv" onChange={handleCsvUpload} disabled={isImporting} />
                            <Button variant="secondary" onClick={processCsv} isBusy={isImporting} disabled={!csvFile || isImporting}>Start Import</Button>
                        </div>
                        {importLog.length > 0 && (
                            <div style={{ background: '#f0f0f1', padding: '15px', borderRadius: '4px', border: '1px solid #ddd', maxHeight: '200px', overflowY: 'auto' }}>
                                <h4 style={{ margin: '0 0 10px 0' }}>Import Log</h4>
                                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', fontFamily: 'monospace' }}>
                                    {importLog.map((log, index) => (
                                        <li key={index} style={{ color: log.includes('Error') || log.includes('Skipped') ? '#d63638' : '#00a32a', marginBottom: '4px' }}>{log}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </PanelRow>
            </PanelBody>

            <div style={{ marginTop: '30px', marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0 }}>Physical Products Inventory (SKUs)</h3>
                    <Button
                        variant="secondary"
                        href={`/wp-json/paint-store/v1/products/export?_wpnonce=${window.wpApiSettings ? window.wpApiSettings.nonce : ''}`}
                        target="_blank"
                    >📥 Export SKUs to CSV</Button>
                </div>
            </div>

            <div style={{ padding: '15px', background: '#f9f9f9', border: '1px solid #ddd', borderRadius: '4px' }}>
                <h4 style={{ margin: '0 0 10px 0' }}>Filter Inventory</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
                    <SelectControl label="Family" value={filterFamilyId} options={[{ label: 'All Families', value: '' }, ...familyOptions.slice(1)]} onChange={setFilterFamilyId} />
                    <SelectControl label="Base" value={filterBaseId} options={[{ label: 'All Bases', value: '' }, ...baseOptions.slice(1)]} onChange={setFilterBaseId} />
                    <SelectControl label="Size" value={filterSizeId} options={[{ label: 'All Sizes', value: '' }, ...sizeOptions.slice(1)]} onChange={setFilterSizeId} />
                    <SelectControl label="Sheen" value={filterSheenId} options={[{ label: 'All Sheens', value: '' }, ...sheenOptions.slice(1)]} onChange={setFilterSheenId} />
                    <SelectControl label="Surface" value={filterSurfaceId} options={[{ label: 'All Surfaces', value: '' }, ...surfaceOptions.slice(1)]} onChange={setFilterSurfaceId} />
                    <TextControl label="SKU" value={filterSku} onChange={setFilterSku} placeholder="Search SKU..." />
                </div>
                <div style={{ marginTop: '10px' }}>
                    <Button variant="link" onClick={() => {
                        setFilterFamilyId(''); setFilterBaseId(''); setFilterSizeId('');
                        setFilterSheenId(''); setFilterSurfaceId(''); setFilterSku('');
                    }}>Clear Filters</Button>
                </div>
            </div>

            <table className="wp-list-table widefat fixed striped" style={{ marginTop: '10px' }}>
                <thead>
                    <tr>
                        <th style={{ width: '50px' }}>ID</th>
                        <th>Family</th>
                        <th>Type</th>
                        <th>Base / Color</th>
                        <th>Size</th>
                        <th>Sheen / Opacity</th>
                        <th>Surface</th>
                        <th>SKU</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th style={{ width: '55px' }}>Image</th>
                        <th style={{ width: '120px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.length === 0 ? (
                        <tr><td colSpan="12">No physical products found/matched.</td></tr>
                    ) : filteredProducts.map(item => {
                        const itemMakeSlug = getFamilyMakeSlug(item.family_id);
                        const itemIsStain = WOOD_STAIN_SLUGS.includes(itemMakeSlug);
                        const itemIsBrush = BRUSH_SLUGS.includes(itemMakeSlug);
                        const itemIsPrimer = PRIMER_SLUGS.includes(itemMakeSlug);
                        return (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td><strong>{getFamilyName(item.family_id)}</strong></td>
                                <td>
                                    {itemIsBrush ? (
                                        <span style={{ background: '#e3f2fd', color: '#1565c0', padding: '2px 6px', borderRadius: '10px', fontSize: '10px', fontWeight: 600 }}>🖌️ Brush</span>
                                    ) : itemIsStain ? (
                                        <span style={{ background: '#fff3cd', color: '#856404', padding: '2px 6px', borderRadius: '10px', fontSize: '10px', fontWeight: 600 }}>🪵 Stain</span>
                                    ) : itemIsPrimer ? (
                                        <span style={{ background: '#f3e5f5', color: '#6a1b9a', padding: '2px 6px', borderRadius: '10px', fontSize: '10px', fontWeight: 600 }}>💡 Primer</span>
                                    ) : (
                                        <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '2px 6px', borderRadius: '10px', fontSize: '10px', fontWeight: 600 }}>🎨 Paint</span>
                                    )}
                                </td>
                                <td>{itemIsBrush || itemIsPrimer ? '—' : itemIsStain ? (item.color_name || '—') : getBaseName(item.base_id)}</td>
                                <td>{itemIsBrush ? getWidthName(item.width_id) : getSizeName(item.size_id)}</td>
                                <td>{itemIsBrush || itemIsPrimer ? '—' : itemIsStain ? (item.opacity || '—') : getSheenName(item.sheen_id)}</td>
                                <td>{getSurfaceName(item.surface_id)}</td>
                                <td><code>{item.sku || '-'}</code></td>
                                <td>${parseFloat(item.price).toFixed(2)}</td>
                                <td>{item.stock_quantity}</td>
                                <td>
                                    {itemIsStain && item.stain_image_url ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <img src={item.stain_image_url} alt={item.color_name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                            {item.stain_images && item.stain_images.length > 1 && (
                                                <span style={{ fontSize: '10px', color: '#666', fontWeight: 600 }}>+{item.stain_images.length - 1}</span>
                                            )}
                                        </div>
                                    ) : (
                                        <span style={{ color: '#ddd', fontSize: '11px' }}>—</span>
                                    )}
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <Button isSmall variant="secondary" onClick={() => handleEdit(item)}>Edit</Button>
                                        <Button isSmall isDestructive onClick={() => handleDelete(item.id)}>Delete</Button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default ProductsManager;
