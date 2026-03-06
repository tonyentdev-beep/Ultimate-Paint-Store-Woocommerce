import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { Button, TextControl, TextareaControl, SelectControl, PanelBody, PanelRow } from '@wordpress/components';

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

    const [description, setDescription] = useState('');
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
    const getSizeLiters = (id) => {
        const sizeObj = sizes.find(s => parseInt(s.id) === parseInt(id));
        return sizeObj ? parseFloat(sizeObj.liters || 0) : 0;
    };
    const getSheenName = (id) => sheens.find(s => parseInt(s.id) === parseInt(id))?.name || '-';
    const getSurfaceName = (id) => surfaceTypes.find(s => parseInt(s.id) === parseInt(id))?.name || '-';

    const filteredProducts = products.filter(p => {
        if (filterFamilyId && p.family_id.toString() !== filterFamilyId) return false;
        if (filterBaseId && p.base_id.toString() !== filterBaseId) return false;
        if (filterSizeId && p.size_id.toString() !== filterSizeId) return false;
        if (filterSheenId && p.sheen_id.toString() !== filterSheenId) return false;
        if (filterSurfaceId && p.surface_id.toString() !== filterSurfaceId) return false;
        if (filterSku && !p.sku.toLowerCase().includes(filterSku.toLowerCase())) return false;
        return true;
    });

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
                description: description,
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
        setDescription(item.description || '');
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
        setDescription('');
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

    // --- CSV Import Logic ---

    const handleCsvUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setCsvFile(file);
            setImportLog([]);
        }
    };

    const processCsv = () => {
        if (!csvFile) return;

        setIsImporting(true);
        setImportLog(['Starting CSV import...']);

        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target.result;
            const lines = text.split('\n').filter(line => line.trim() !== '');

            if (lines.length < 2) {
                setImportLog(prev => [...prev, 'Error: Fast empty or invalid CSV.']);
                setIsImporting(false);
                return;
            }

            // Simple CSV parser (doesn't handle quotes perfectly, simple split by comma)
            const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
            const expectedHeaders = ['sku', 'price', 'family', 'base', 'size', 'sheen', 'surface type'];

            // Check headers
            const missingHeaders = expectedHeaders.filter(eh => !headers.some(h => h.includes(eh)));
            if (missingHeaders.length > 0) {
                setImportLog(prev => [...prev, `Error: Missing expected columns: ${missingHeaders.join(', ')}`]);
                setIsImporting(false);
                return;
            }

            const getColIndex = (colName) => headers.findIndex(h => h.includes(colName));

            const skuIdx = getColIndex('sku');
            const priceIdx = getColIndex('price');
            const familyIdx = getColIndex('family');
            const baseIdx = getColIndex('base');
            const sizeIdx = getColIndex('size');
            const sheenIdx = getColIndex('sheen');
            const surfaceIdx = getColIndex('surface type');

            const parsedProducts = [];

            for (let i = 1; i < lines.length; i++) {
                // Ignore empty lines
                if (!lines[i].trim()) continue;

                // Naive CSV split that tries to handle quotes
                const row = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.replace(/^"|"$/g, '').trim());

                if (row.length < headers.length) {
                    setImportLog(prev => [...prev, `Row ${i + 1}: Skipping, invalid column count.`]);
                    continue;
                }

                // Resolve Relations
                const familyName = row[familyIdx];
                const baseName = row[baseIdx];
                const sizeName = row[sizeIdx];
                const sheenName = row[sheenIdx];
                const surfaceName = row[surfaceIdx];

                // Fuzzy match helpers
                const matchName = (arr, name) => arr.find(item => item.name.toLowerCase() === (name || '').toLowerCase());

                const fFamily = matchName(productFamilies, familyName);
                const fBase = matchName(bases, baseName);
                const fSize = matchName(sizes, sizeName);
                const fSheen = matchName(sheens, sheenName);
                const fSurface = matchName(surfaceTypes, surfaceName);

                if (!fFamily || !fBase || !fSize || !fSheen || !fSurface) {
                    setImportLog(prev => [...prev, `Row ${i + 1}: Skipped SKU ${row[skuIdx]} due to unresolvable relation. Provide exact names.`]);
                    continue;
                }

                parsedProducts.push({
                    sku: row[skuIdx],
                    price: parseFloat(row[priceIdx]) || 0,
                    family_id: fFamily.id,
                    base_id: fBase.id,
                    size_id: fSize.id,
                    sheen_id: fSheen.id,
                    surface_id: fSurface.id,
                });
            }

            if (parsedProducts.length === 0) {
                setImportLog(prev => [...prev, 'No valid rows found to import.']);
                setIsImporting(false);
                return;
            }

            setImportLog(prev => [...prev, `Found ${parsedProducts.length} valid rows. Sending to server...`]);

            try {
                // Batch send (if there are many, we might want to split, but for now send all)
                const response = await apiFetch({
                    path: '/paint-store/v1/products/bulk-import',
                    method: 'POST',
                    data: { products: parsedProducts }
                });

                if (response.success) {
                    setImportLog(prev => [...prev, `Success: Imported ${response.imported} products.`]);
                    if (response.errors && response.errors.length > 0) {
                        setImportLog(prev => [...prev, 'Server Errors:', ...response.errors]);
                    }
                    fetchProducts();
                } else {
                    setImportLog(prev => [...prev, 'Import failed via API.']);
                }
            } catch (error) {
                setImportLog(prev => [...prev, `API Error: ${error.message || JSON.stringify(error)}`]);
            }

            setIsImporting(false);
        };
        reader.onerror = () => {
            setImportLog(prev => [...prev, 'Error reading file.']);
            setIsImporting(false);
        };

        reader.readAsText(csvFile);
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
                <PanelRow>
                    <div style={{ width: '100%', marginTop: '10px' }}>
                        <TextareaControl
                            label="Description (SEO meta text)"
                            value={description}
                            onChange={(value) => setDescription(value)}
                            rows={3}
                        />
                    </div>
                </PanelRow>

                <div style={{ padding: '20px 0 0 0', display: 'flex', gap: '10px' }}>
                    <Button variant="primary" onClick={handleSave} isBusy={isSaving} disabled={!familyId || !baseId || !sizeId || !sheenId || !surfaceId || isSaving}>
                        {editingId ? 'Update Physical SKU' : 'Add Physical SKU'}
                    </Button>
                    {editingId && <Button variant="secondary" onClick={handleCancelEdit}>Cancel Edit</Button>}
                </div>
            </PanelBody>

            <PanelBody title="Bulk Import SKUs via CSV" initialOpen={false}>
                <PanelRow>
                    <div style={{ width: '100%', padding: '10px 0' }}>
                        <p style={{ marginTop: 0, fontSize: '13px', color: '#666' }}>
                            Upload a CSV with the following columns: <strong>SKU, Price, Family, Base, Size, Sheen, Surface Type</strong>.<br />
                            Relations (Family, Base, Size, Sheen, Surface Type) must <strong>exactly match names</strong> of existing records in the database.
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleCsvUpload}
                                disabled={isImporting}
                            />
                            <Button
                                variant="secondary"
                                onClick={processCsv}
                                isBusy={isImporting}
                                disabled={!csvFile || isImporting}
                            >
                                Start Import
                            </Button>
                        </div>

                        {importLog.length > 0 && (
                            <div style={{
                                background: '#f0f0f1',
                                padding: '15px',
                                borderRadius: '4px',
                                border: '1px solid #ddd',
                                maxHeight: '200px',
                                overflowY: 'auto'
                            }}>
                                <h4 style={{ margin: '0 0 10px 0' }}>Import Log</h4>
                                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', fontFamily: 'monospace' }}>
                                    {importLog.map((log, index) => (
                                        <li key={index} style={{ color: log.includes('Error') || log.includes('Skipped') ? '#d63638' : '#00a32a', marginBottom: '4px' }}>
                                            {log}
                                        </li>
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
                        icon={
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 16L7 11L8.4 9.55L11 12.15V4H13V12.15L15.6 9.55L17 11L12 16ZM6 20C5.45 20 4.97917 19.8042 4.5875 19.4125C4.19583 19.0208 4 18.55 4 18V15H6V18H18V15H20V18C20 18.55 19.8042 19.0208 19.4125 19.4125C19.0208 19.8042 18.55 20 18 20H6Z" fill="currentColor" />
                            </svg>
                        }
                    >
                        Export SKUs to CSV
                    </Button>
                </div>
                <p style={{ color: '#666', fontSize: '13px', margin: '5px 0 10px' }}>
                    These explicitly map existing Paint Bases in the real world to specific container Sizes and Sheens.
                </p>
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
                        <th>Base</th>
                        <th>Size</th>
                        <th>Sheen</th>
                        <th>Surface</th>
                        <th>SKU</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Total Volume</th>
                        <th style={{ width: '120px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.length === 0 ? (
                        <tr><td colSpan="11">No physical products found/matched.</td></tr>
                    ) : filteredProducts.map(item => (
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
                                {item.stock_quantity > 0 && getSizeLiters(item.size_id) > 0
                                    ? (item.stock_quantity * getSizeLiters(item.size_id)).toFixed(2) + ' L'
                                    : '-'}
                            </td>
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
