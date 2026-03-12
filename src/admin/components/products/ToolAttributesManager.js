import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { Button, TextControl, TextareaControl, SelectControl, PanelBody, PanelRow } from '@wordpress/components';

const ATTRIBUTE_TYPES = [
    { label: '— Select Type —', value: '' },
    { label: 'Handle Shape', value: 'handle_shape' },
    { label: 'Bristle Material', value: 'bristle_material' },
    { label: 'Head Shape', value: 'head_shape' },
    { label: 'Handle Length', value: 'handle_length' },
    { label: 'Handle Material', value: 'handle_material' },
    { label: 'Width', value: 'width' },
    { label: 'Texture', value: 'texture' },
    { label: 'Brush Type', value: 'brush_type' },
];

const typeLabel = (val) => {
    const found = ATTRIBUTE_TYPES.find(t => t.value === val);
    return found ? found.label : val;
};

const ToolAttributesManager = ({ toolAttributes, fetchToolAttributes }) => {
    const [attributeType, setAttributeType] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [filterType, setFilterType] = useState('');

    const handleSave = async () => {
        if (!name || !attributeType) return;
        setIsSaving(true);
        try {
            if (editingId) {
                await apiFetch({ path: `/paint-store/v1/tool-attributes/${editingId}`, method: 'PUT', data: { attribute_type: attributeType, name, description } });
            } else {
                await apiFetch({ path: '/paint-store/v1/tool-attributes', method: 'POST', data: { attribute_type: attributeType, name, description } });
            }
            setName(''); setDescription(''); setAttributeType(''); setEditingId(null); fetchToolAttributes();
        } catch (error) {
            console.error('Error saving tool attribute:', error);
            alert('Error saving tool attribute: ' + (error.message || JSON.stringify(error)));
        }
        setIsSaving(false);
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        setAttributeType(item.attribute_type);
        setName(item.name);
        setDescription(item.description || '');
    };
    const handleCancelEdit = () => { setEditingId(null); setName(''); setDescription(''); setAttributeType(''); };
    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this tool attribute? Any product families using it will lose this reference.')) return;
        try {
            await apiFetch({ path: `/paint-store/v1/tool-attributes/${id}`, method: 'DELETE' });
            if (editingId === id) handleCancelEdit();
            fetchToolAttributes();
        } catch (error) { alert('Error deleting tool attribute: ' + (error.message || JSON.stringify(error))); }
    };

    const filtered = filterType ? toolAttributes.filter(a => a.attribute_type === filterType) : toolAttributes;

    // Group by type for display
    const grouped = {};
    filtered.forEach(item => {
        if (!grouped[item.attribute_type]) grouped[item.attribute_type] = [];
        grouped[item.attribute_type].push(item);
    });

    return (
        <div className="tool-attributes-manager">
            <PanelBody title={editingId ? "Edit Brush Attribute" : "Add New Brush Attribute"} initialOpen={true}>
                <PanelRow>
                    <SelectControl
                        label="Attribute Type"
                        value={attributeType}
                        options={ATTRIBUTE_TYPES}
                        onChange={setAttributeType}
                    />
                </PanelRow>
                <PanelRow>
                    <TextControl label="Name (e.g., Angled, Nylon/Polyester, 2 inch)" value={name} onChange={setName} />
                </PanelRow>
                <PanelRow>
                    <TextareaControl label="Description (optional)" value={description} onChange={setDescription} rows={2} />
                </PanelRow>
                <div style={{ padding: '10px 20px 20px', display: 'flex', gap: '10px' }}>
                    <Button variant="primary" onClick={handleSave} isBusy={isSaving} disabled={!name || !attributeType || isSaving}>
                        {editingId ? 'Update Attribute' : 'Add Attribute'}
                    </Button>
                    {editingId && <Button variant="secondary" onClick={handleCancelEdit}>Cancel Edit</Button>}
                </div>
            </PanelBody>

            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0 }}>Existing Brush Attributes ({filtered.length})</h3>
                <SelectControl
                    label=""
                    value={filterType}
                    options={[{ label: 'All Types', value: '' }, ...ATTRIBUTE_TYPES.filter(t => t.value !== '')]}
                    onChange={setFilterType}
                    __nextHasNoMarginBottom
                />
            </div>

            <table className="wp-list-table widefat fixed striped" style={{ marginTop: '10px' }}>
                <thead>
                    <tr>
                        <th style={{ width: '50px' }}>ID</th>
                        <th style={{ width: '160px' }}>Type</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th style={{ width: '150px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.length === 0 ? (
                        <tr><td colSpan="5">No brush attributes found. Add some above.</td></tr>
                    ) : filtered.map(item => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td><span style={{
                                display: 'inline-block',
                                padding: '2px 8px',
                                borderRadius: '3px',
                                backgroundColor: '#e7e8ea',
                                fontSize: '12px'
                            }}>{typeLabel(item.attribute_type)}</span></td>
                            <td><strong>{item.name}</strong></td>
                            <td style={{ fontSize: '12px', color: '#666' }}>{item.description || '—'}</td>
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
    );
};

export default ToolAttributesManager;
