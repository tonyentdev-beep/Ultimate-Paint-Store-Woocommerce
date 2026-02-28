import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { Button, TextControl, SelectControl, PanelBody, PanelRow, CheckboxControl } from '@wordpress/components';

const ColorsManager = ({ colors, families, allBases, brands, fetchColors }) => {
    const [newColorName, setNewColorName] = useState('');
    const [newColorCode, setNewColorCode] = useState('');
    const [newColorHex, setNewColorHex] = useState('');
    const [newColorFamilyId, setNewColorFamilyId] = useState('');
    const [newColorBrandId, setNewColorBrandId] = useState('');
    const [selectedBases, setSelectedBases] = useState([]);
    const [isSaving, setIsSaving] = useState(false);

    const handleCreateColor = async () => {
        if (!newColorName || !newColorFamilyId || !newColorBrandId || selectedBases.length === 0) {
            alert("Name, Family, Brand, and at least one Base are required.");
            return;
        }
        setIsSaving(true);
        try {
            await apiFetch({
                path: '/paint-store/v1/colors',
                method: 'POST',
                data: {
                    name: newColorName,
                    color_code: newColorCode,
                    hex_value: newColorHex,
                    rgb_value: '', // Auto-calculate later if needed
                    family_id: newColorFamilyId,
                    brand_id: newColorBrandId,
                    base_ids: selectedBases
                },
            });
            setNewColorName('');
            setNewColorCode('');
            setNewColorHex('');
            setNewColorFamilyId('');
            setNewColorBrandId('');
            setSelectedBases([]);
            fetchColors(); // Refresh the list
        } catch (error) {
            console.error('Error creating color:', error);
            alert('Error creating color: ' + (error.message || JSON.stringify(error)));
        }
        setIsSaving(false);
    };

    const toggleBaseSelection = (baseId) => {
        setSelectedBases((prev) =>
            prev.includes(baseId)
                ? prev.filter((id) => id !== baseId)
                : [...prev, baseId]
        );
    };

    const familyOptions = [
        { label: 'Select a Family...', value: '' },
        ...families.map(family => ({ label: family.name, value: family.id }))
    ];

    const brandOptions = [
        { label: 'Select a Brand...', value: '' },
        ...brands.map(brand => ({ label: brand.name, value: brand.id }))
    ];

    const getBaseNames = (baseIds) => {
        if (!baseIds || baseIds.length === 0) return 'None';
        return baseIds
            .map(id => allBases.find(b => parseInt(b.id) === id)?.name || id)
            .join(', ');
    };

    const getBrandName = (brandId) => {
        if (!brandId) return '-';
        return brands.find(b => parseInt(b.id) === parseInt(brandId))?.name || brandId;
    };

    return (
        <div className="colors-manager" style={{ marginTop: '30px' }}>
            <PanelBody title="Add New Specific Color" initialOpen={true}>
                <PanelRow>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '100%' }}>
                        <TextControl
                            label="Color Name (e.g., Naval Blue)"
                            value={newColorName}
                            onChange={(value) => setNewColorName(value)}
                        />
                        <TextControl
                            label="Color Code (e.g., SW 6593)"
                            value={newColorCode}
                            onChange={(value) => setNewColorCode(value)}
                        />
                    </div>
                </PanelRow>
                <PanelRow>
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '15px' }}>
                        <div style={{ flex: 1 }}>
                            <TextControl
                                label="Hex Value (e.g., #324354)"
                                value={newColorHex}
                                onChange={(value) => setNewColorHex(value)}
                            />
                        </div>
                        <div className="color-swatch-box" style={{
                            width: '45px',
                            height: '45px',
                            backgroundColor: newColorHex || '#ffffff',
                            marginTop: '15px'
                        }}></div>
                    </div>
                </PanelRow>
                <PanelRow>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '100%' }}>
                        <SelectControl
                            label="Assign to Family"
                            value={newColorFamilyId}
                            options={familyOptions}
                            onChange={(value) => setNewColorFamilyId(value)}
                        />
                        <SelectControl
                            label="Assign to Brand"
                            value={newColorBrandId}
                            options={brandOptions}
                            onChange={(value) => setNewColorBrandId(value)}
                        />
                    </div>
                </PanelRow>
                <div style={{ marginTop: '15px', padding: '15px 20px' }}>
                    <p style={{ fontWeight: 600, marginBottom: '10px' }}>Compatible Bases (Required)</p>
                    {allBases.length === 0 ? (
                        <p style={{ color: 'red', fontStyle: 'italic' }}>Please create Paint Bases in the Products & Bases tab first.</p>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                            {allBases.map((base) => (
                                <CheckboxControl
                                    key={base.id}
                                    label={base.name}
                                    checked={selectedBases.includes(parseInt(base.id))}
                                    onChange={() => toggleBaseSelection(parseInt(base.id))}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ padding: '0 20px 20px' }}>
                    <Button
                        variant="primary"
                        onClick={handleCreateColor}
                        isBusy={isSaving}
                        disabled={!newColorName || !newColorFamilyId || !newColorBrandId || selectedBases.length === 0 || isSaving}
                    >
                        Add Color
                    </Button>
                </div>
            </PanelBody>

            <div style={{ marginTop: '30px' }}>
                <h3>Existing Colors</h3>
                <table className="wp-list-table widefat fixed striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Code</th>
                            <th>Name</th>
                            <th>Brand</th>
                            <th>Color Hex</th>
                            <th>Compatible Bases</th>
                        </tr>
                    </thead>
                    <tbody>
                        {colors.length === 0 ? (
                            <tr><td colSpan="6">No colors found.</td></tr>
                        ) : (
                            colors.map(color => (
                                <tr key={color.id}>
                                    <td>{color.id}</td>
                                    <td><strong>{color.color_code || '-'}</strong></td>
                                    <td><strong>{color.name}</strong></td>
                                    <td>{getBrandName(color.brand_id)}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span className="color-swatch-box" style={{
                                                display: 'inline-block',
                                                width: '24px',
                                                height: '24px',
                                                backgroundColor: color.hex_value
                                            }}></span>
                                            {color.hex_value}
                                        </div>
                                    </td>
                                    <td><em>{getBaseNames(color.base_ids)}</em></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ColorsManager;
