import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { Button, TextControl, PanelBody, PanelRow } from '@wordpress/components';

const SheensManager = ({ sheens, fetchSheens }) => {
    const [name, setName] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncMessage, setSyncMessage] = useState('');

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

    const handleSync = async () => {
        setIsSyncing(true);
        setSyncMessage('');
        try {
            const result = await apiFetch({ path: '/paint-store/v1/sheens/sync', method: 'POST' });
            setSyncMessage(`✅ Synced ${result.synced} sheens to WooCommerce!`);
            fetchSheens(); // Refresh to get the new wc_attribute_ids
            setTimeout(() => setSyncMessage(''), 4000);
        } catch (error) {
            console.error('Error syncing:', error);
            setSyncMessage(`❌ Error: ${error.message || JSON.stringify(error)}`);
        }
        setIsSyncing(false);
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
            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h3 style={{ margin: 0 }}>Existing Sheens</h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {syncMessage && <span style={{ fontSize: '13px', color: syncMessage.includes('✅') ? '#3c763d' : '#a94442' }}>{syncMessage}</span>}
                    <Button variant="secondary" onClick={handleSync} isBusy={isSyncing} disabled={isSyncing}>
                        🔄 Sync with WooCommerce
                    </Button>
                </div>
            </div>
            <table className="wp-list-table widefat fixed striped" style={{ marginTop: '10px' }}>
                <thead><tr><th>ID</th><th>Name</th><th>WooCommerce Sync</th><th style={{ width: '150px' }}>Actions</th></tr></thead>
                <tbody>
                    {sheens.length === 0 ? (
                        <tr><td colSpan="4">No sheens found.</td></tr>
                    ) : sheens.map(item => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td><strong>{item.name}</strong></td>
                            <td>
                                {parseInt(item.wc_attribute_id) > 0 ? (
                                    <span style={{ color: '#3c763d', fontSize: '12px' }}>✓ Synced (ID: {item.wc_attribute_id})</span>
                                ) : (
                                    <span style={{ color: '#a94442', fontSize: '12px' }}>Not synced</span>
                                )}
                            </td>
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

export default SheensManager;
