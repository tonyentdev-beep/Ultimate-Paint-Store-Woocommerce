import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { Button, TextControl, PanelBody, PanelRow } from '@wordpress/components';

const SheensManager = ({ sheens, fetchSheens }) => {
    const [name, setName] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const handleSave = async () => {
        if (!name) return;
        setIsSaving(true);
        try {
            if (editingId) {
                await apiFetch({ path: `/paint-store/v1/sheens/${editingId}`, method: 'PUT', data: { name } });
            } else {
                await apiFetch({ path: '/paint-store/v1/sheens', method: 'POST', data: { name } });
            }
            setName(''); setEditingId(null); fetchSheens();
        } catch (error) {
            console.error('Error saving sheen:', error);
            alert('Error saving sheen: ' + (error.message || JSON.stringify(error)));
        }
        setIsSaving(false);
    };

    const handleEdit = (item) => { setEditingId(item.id); setName(item.name); };
    const handleCancelEdit = () => { setEditingId(null); setName(''); };
    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this sheen?')) return;
        try {
            await apiFetch({ path: `/paint-store/v1/sheens/${id}`, method: 'DELETE' });
            if (editingId === id) handleCancelEdit();
            fetchSheens();
        } catch (error) { alert('Error deleting sheen: ' + (error.message || JSON.stringify(error))); }
    };

    return (
        <div className="sheens-manager">
            <PanelBody title={editingId ? "Edit Sheen" : "Add New Sheen"} initialOpen={true}>
                <PanelRow>
                    <TextControl label="Sheen Name (e.g., Flat, Eggshell, Satin)" value={name} onChange={setName} />
                </PanelRow>
                <div style={{ padding: '10px 20px 20px', display: 'flex', gap: '10px' }}>
                    <Button variant="primary" onClick={handleSave} isBusy={isSaving} disabled={!name || isSaving}>
                        {editingId ? 'Update Sheen' : 'Add Sheen'}
                    </Button>
                    {editingId && <Button variant="secondary" onClick={handleCancelEdit}>Cancel Edit</Button>}
                </div>
            </PanelBody>
            <div style={{ marginTop: '30px' }}>
                <h3>Existing Sheens</h3>
                <table className="wp-list-table widefat fixed striped">
                    <thead><tr><th>ID</th><th>Name</th><th style={{ width: '150px' }}>Actions</th></tr></thead>
                    <tbody>
                        {sheens.length === 0 ? (
                            <tr><td colSpan="3">No sheens found.</td></tr>
                        ) : sheens.map(item => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td><strong>{item.name}</strong></td>
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

export default SheensManager;
