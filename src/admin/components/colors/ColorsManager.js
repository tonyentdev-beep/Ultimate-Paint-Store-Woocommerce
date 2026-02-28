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
    const [editingId, setEditingId] = useState(null);

    const handleSaveColor = async () => {
        if (!newColorName || !newColorFamilyId || !newColorBrandId || selectedBases.length === 0) {
            alert("Name, Family, Brand, and at least one Base are required.");
            return;
        }
        setIsSaving(true);
        try {
            const payload = {
                name: newColorName,
                color_code: newColorCode,
                hex_value: newColorHex,
                rgb_value: '', // Auto-calculate later if needed
                family_id: newColorFamilyId,
                brand_id: newColorBrandId,
                base_ids: selectedBases
            };

            if (editingId) {
                await apiFetch({
                    path: `/paint-store/v1/colors/${editingId}`,
                    method: 'PUT',
                    data: payload,
                });
            } else {
                await apiFetch({
                    path: '/paint-store/v1/colors',
                    method: 'POST',
                    data: payload,
                });
            }

            setNewColorName('');
            setNewColorCode('');
            setNewColorHex('');
            setNewColorFamilyId('');
            setNewColorBrandId('');
            setSelectedBases([]);
            setEditingId(null);
            fetchColors(); // Refresh the list
        } catch (error) {
            console.error('Error saving color:', error);
            alert('Error saving color: ' + (error.message || JSON.stringify(error)));
        }
        setIsSaving(false);
    };

    const handleEdit = (color) => {
        setEditingId(color.id);
        setNewColorName(color.name);
        setNewColorCode(color.color_code || '');
        setNewColorHex(color.hex_value || '');
        setNewColorFamilyId(color.family_id == 0 ? '' : color.family_id);
        setNewColorBrandId(color.brand_id == 0 ? '' : color.brand_id);
        setSelectedBases(color.base_ids || []);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setNewColorName('');
        setNewColorCode('');
        setNewColorHex('');
        setNewColorFamilyId('');
        setNewColorBrandId('');
        setSelectedBases([]);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this color?')) return;
        try {
            await apiFetch({
                path: `/paint-store/v1/colors/${id}`,
                method: 'DELETE',
            });
            if (editingId === id) handleCancelEdit();
            fetchColors();
        } catch (error) {
            console.error('Error deleting color:', error);
            alert('Error deleting color: ' + (error.message || JSON.stringify(error)));
        }
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
            <PanelBody title={editingId ? "Edit Specific Color" : "Add New Specific Color"} initialOpen={true}>
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

                <div style={{ padding: '0 20px 20px', display: 'flex', gap: '10px' }}>
                    <Button
                        variant="primary"
                        onClick={handleSaveColor}
                        isBusy={isSaving}
                        disabled={!newColorName || !newColorFamilyId || !newColorBrandId || selectedBases.length === 0 || isSaving}
                    >
                        {editingId ? 'Update Color' : 'Add Color'}
                    </Button>
                    {editingId && (
                        <Button variant="secondary" onClick={handleCancelEdit}>
                            Cancel Edit
                        </Button>
                    )}
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
                            <th style={{ width: '150px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {colors.length === 0 ? (
                            <tr><td colSpan="7">No colors found.</td></tr>
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
                                    <td>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <Button isSmall variant="secondary" onClick={() => handleEdit(color)}>Edit</Button>
                                            <Button isSmall isDestructive onClick={() => handleDelete(color.id)}>Delete</Button>
                                        </div>
                                    </td>
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
