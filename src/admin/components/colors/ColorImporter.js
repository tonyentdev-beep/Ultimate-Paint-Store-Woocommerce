import { useState, useRef } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { Button, SelectControl, PanelBody, PanelRow, CheckboxControl } from '@wordpress/components';

const ColorImporter = ({ brands, families, allBases, fetchColors }) => {
    const [csvData, setCsvData] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [mapping, setMapping] = useState({ name: '', color_code: '', hex_value: '' });
    const [selectedBrandId, setSelectedBrandId] = useState('');
    const [selectedFamilyId, setSelectedFamilyId] = useState('');
    const [selectedBaseIds, setSelectedBaseIds] = useState([]);
    const [isImporting, setIsImporting] = useState(false);
    const [importResult, setImportResult] = useState(null);
    const fileInputRef = useRef(null);

    const brandOptions = [
        { label: 'Select a Brand...', value: '' },
        ...brands.map(b => ({ label: b.name, value: String(b.id) }))
    ];

    const familyOptions = [
        { label: 'Select a Family...', value: '' },
        ...families.map(f => ({ label: f.name, value: String(f.id) }))
    ];

    const toggleBase = (baseId) => {
        setSelectedBaseIds((prev) =>
            prev.includes(baseId) ? prev.filter(id => id !== baseId) : [...prev, baseId]
        );
    };

    const parseCSV = (text) => {
        const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
        if (lines.length < 2) return { headers: [], rows: [] };

        // Parse header
        const headerLine = lines[0];
        const parsedHeaders = parseCSVLine(headerLine);

        // Parse data rows
        const rows = [];
        for (let i = 1; i < lines.length; i++) {
            const values = parseCSVLine(lines[i]);
            if (values.length > 0 && values.some(v => v.trim() !== '')) {
                const row = {};
                parsedHeaders.forEach((h, idx) => {
                    row[h] = values[idx] || '';
                });
                rows.push(row);
            }
        }
        return { headers: parsedHeaders, rows };
    };

    const parseCSVLine = (line) => {
        const result = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
                    current += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current.trim());
        return result;
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const { headers: h, rows } = parseCSV(event.target.result);
            setHeaders(h);
            setCsvData(rows);
            setImportResult(null);

            // Auto-map columns by header name
            const autoMap = { name: '', color_code: '', hex_value: '' };
            h.forEach(header => {
                const lower = header.toLowerCase();
                if (lower.includes('name') && !autoMap.name) autoMap.name = header;
                else if (lower.includes('code') && !autoMap.color_code) autoMap.color_code = header;
                else if (lower.includes('hex') && !autoMap.hex_value) autoMap.hex_value = header;
            });
            setMapping(autoMap);
        };
        reader.readAsText(file);
    };

    const handleImport = async () => {
        if (!selectedBrandId || !selectedFamilyId) {
            alert('Please select a Brand and Color Family for all imported colors.');
            return;
        }
        if (!mapping.name) {
            alert('Please map the "Color Name" column.');
            return;
        }

        setIsImporting(true);
        setImportResult(null);

        const colors = csvData.map(row => ({
            name: row[mapping.name] || '',
            color_code: mapping.color_code ? (row[mapping.color_code] || '') : '',
            hex_value: mapping.hex_value ? (row[mapping.hex_value] || '') : '',
            rgb_value: '',
            brand_id: parseInt(selectedBrandId),
            family_id: parseInt(selectedFamilyId),
            base_ids: selectedBaseIds,
        }));

        try {
            const result = await apiFetch({
                path: '/paint-store/v1/colors/bulk-import',
                method: 'POST',
                data: { colors },
            });
            setImportResult(result);
            if (result.imported > 0) fetchColors();
        } catch (error) {
            console.error('Bulk import error:', error);
            setImportResult({ success: false, errors: [error.message || JSON.stringify(error)] });
        }
        setIsImporting(false);
    };

    const handleReset = () => {
        setCsvData([]);
        setHeaders([]);
        setMapping({ name: '', color_code: '', hex_value: '' });
        setSelectedBrandId('');
        setSelectedFamilyId('');
        setSelectedBaseIds([]);
        setImportResult(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const columnOptions = [
        { label: '— Skip —', value: '' },
        ...headers.map(h => ({ label: h, value: h }))
    ];

    return (
        <div className="color-importer">
            {/* Step 1: Upload CSV */}
            <PanelBody title="Step 1: Upload CSV File" initialOpen={true}>
                <PanelRow>
                    <div style={{ width: '100%' }}>
                        <p style={{ marginBottom: '10px', color: '#666' }}>
                            Upload a CSV file with your color data. The first row should be column headers.
                        </p>
                        <p style={{ marginBottom: '15px', color: '#666', fontSize: '12px' }}>
                            <strong>Expected columns:</strong> Color Name (required), Color Code (optional), Hex Value (optional)
                        </p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv,.txt"
                            onChange={handleFileUpload}
                            style={{ marginBottom: '10px' }}
                        />
                        {csvData.length > 0 && (
                            <span style={{
                                background: '#dff0d8', color: '#3c763d', padding: '4px 12px',
                                borderRadius: '4px', fontSize: '13px', marginLeft: '10px',
                            }}>
                                ✓ {csvData.length} rows loaded
                            </span>
                        )}
                    </div>
                </PanelRow>
            </PanelBody>

            {csvData.length > 0 && (
                <>
                    {/* Step 2: Map Columns */}
                    <PanelBody title="Step 2: Map CSV Columns" initialOpen={true}>
                        <PanelRow>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', width: '100%' }}>
                                <SelectControl
                                    label="Color Name Column *"
                                    value={mapping.name}
                                    options={columnOptions}
                                    onChange={(v) => setMapping({ ...mapping, name: v })}
                                />
                                <SelectControl
                                    label="Color Code Column"
                                    value={mapping.color_code}
                                    options={columnOptions}
                                    onChange={(v) => setMapping({ ...mapping, color_code: v })}
                                />
                                <SelectControl
                                    label="Hex Value Column"
                                    value={mapping.hex_value}
                                    options={columnOptions}
                                    onChange={(v) => setMapping({ ...mapping, hex_value: v })}
                                />
                            </div>
                        </PanelRow>
                    </PanelBody>

                    {/* Step 3: Assign Brand, Family, Bases */}
                    <PanelBody title="Step 3: Assign Brand, Family & Bases (applied to ALL rows)" initialOpen={true}>
                        <PanelRow>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '100%' }}>
                                <SelectControl label="Brand *" value={selectedBrandId} options={brandOptions} onChange={setSelectedBrandId} />
                                <SelectControl label="Color Family *" value={selectedFamilyId} options={familyOptions} onChange={setSelectedFamilyId} />
                            </div>
                        </PanelRow>
                        <PanelRow>
                            <div style={{ width: '100%' }}>
                                <label style={{ fontWeight: 600, display: 'block', marginBottom: '8px' }}>Compatible Bases</label>
                                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                                    {allBases.map(base => (
                                        <CheckboxControl
                                            key={base.id}
                                            label={base.name}
                                            checked={selectedBaseIds.includes(parseInt(base.id))}
                                            onChange={() => toggleBase(parseInt(base.id))}
                                        />
                                    ))}
                                </div>
                            </div>
                        </PanelRow>
                    </PanelBody>

                    {/* Step 4: Preview */}
                    <PanelBody title={`Step 4: Preview (first 10 of ${csvData.length} rows)`} initialOpen={true}>
                        <div style={{ overflowX: 'auto' }}>
                            <table className="wp-list-table widefat fixed striped" style={{ fontSize: '13px' }}>
                                <thead>
                                    <tr>
                                        <th style={{ width: '40px' }}>#</th>
                                        <th>Name</th>
                                        <th>Code</th>
                                        <th>Hex</th>
                                        <th style={{ width: '50px' }}>Preview</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {csvData.slice(0, 10).map((row, idx) => {
                                        const hex = mapping.hex_value ? row[mapping.hex_value] : '';
                                        const displayHex = hex && !hex.startsWith('#') ? '#' + hex : hex;
                                        return (
                                            <tr key={idx}>
                                                <td>{idx + 1}</td>
                                                <td><strong>{mapping.name ? row[mapping.name] : '-'}</strong></td>
                                                <td>{mapping.color_code ? row[mapping.color_code] : '-'}</td>
                                                <td>{displayHex || '-'}</td>
                                                <td>
                                                    {displayHex && (
                                                        <div style={{
                                                            width: '30px', height: '30px', borderRadius: '4px',
                                                            backgroundColor: displayHex, border: '1px solid #ddd',
                                                        }} />
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {csvData.length > 10 && (
                                <p style={{ color: '#666', fontSize: '12px', marginTop: '8px' }}>
                                    ...and {csvData.length - 10} more rows
                                </p>
                            )}
                        </div>
                    </PanelBody>

                    {/* Import Button */}
                    <div style={{ padding: '20px 0', display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <Button
                            variant="primary"
                            onClick={handleImport}
                            isBusy={isImporting}
                            disabled={isImporting || !mapping.name || !selectedBrandId || !selectedFamilyId}
                            style={{ fontSize: '14px', padding: '8px 24px' }}
                        >
                            {isImporting ? 'Importing...' : `Import ${csvData.length} Colors`}
                        </Button>
                        <Button variant="secondary" onClick={handleReset}>
                            Reset / Start Over
                        </Button>
                    </div>

                    {/* Results */}
                    {importResult && (
                        <div style={{
                            padding: '15px 20px', borderRadius: '6px', marginBottom: '20px',
                            background: importResult.imported > 0 ? '#dff0d8' : '#f2dede',
                            border: `1px solid ${importResult.imported > 0 ? '#d6e9c6' : '#ebccd1'}`,
                            color: importResult.imported > 0 ? '#3c763d' : '#a94442',
                        }}>
                            <strong>
                                {importResult.imported > 0
                                    ? `✅ Successfully imported ${importResult.imported} of ${importResult.total} colors!`
                                    : '❌ Import failed'}
                            </strong>
                            {importResult.errors && importResult.errors.length > 0 && (
                                <div style={{ marginTop: '10px', fontSize: '13px' }}>
                                    <strong>Errors:</strong>
                                    <ul style={{ margin: '5px 0 0 20px' }}>
                                        {importResult.errors.map((err, i) => <li key={i}>{err}</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ColorImporter;
