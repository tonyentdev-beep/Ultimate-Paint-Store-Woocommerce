import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { Button, TextControl, PanelBody, PanelRow } from '@wordpress/components';

const SurfaceTypesManager = ({ surfaceTypes, fetchSurfaceTypes }) => {
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
                await apiFetch({ path: `/paint-store/v1/surface-types/${editingId}`, method: 'PUT', data: { name } });
            } else {
                await apiFetch({ path: '/paint-store/v1/surface-types', method: 'POST', data: { name } });
            }
            setName(''); setEditingId(null); fetchSurfaceTypes();
        } catch (error) {
            console.error('Error saving surface type:', error);
            alert('Error saving surface type: ' + (error.message || JSON.stringify(error)));
        }
        setIsSaving(false);
    };

    const handleEdit = (item) => { setEditingId(item.id); setName(item.name); };
    const handleCancelEdit = () => { setEditingId(null); setName(''); };
    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this surface type?')) return;
        try {
            await apiFetch({ path: `/paint-store/v1/surface-types/${id}`, method: 'DELETE' });
            if (editingId === id) handleCancelEdit();
            fetchSurfaceTypes();
        } catch (error) { alert('Error deleting surface type: ' + (error.message || JSON.stringify(error))); }
    };

    const handleSync = async () => {
        setIsSyncing(true);
        setSyncMessage('');
        try {
            const result = await apiFetch({ path: '/paint-store/v1/surface-types/sync', method: 'POST' });
            setSyncMessage(`✅ Synced ${result.synced} surface types to WooCommerce!`);
            fetchSurfaceTypes();
            setTimeout(() => setSyncMessage(''), 4000);
        } catch (error) {
            console.error('Error syncing:', error);
            setSyncMessage(`❌ Error: ${error.message || JSON.stringify(error)}`);
        }
        setIsSyncing(false);
    };

    return (
        <div className="surface-types-manager">
            <PanelBody title={editingId ? "Edit Surface Type" : "Add New Surface Type"} initialOpen={true}>
                <PanelRow>
                    <TextControl label="Surface Type (e.g., Interior Walls, Exterior, Deck)" value={name} onChange={setName} />
                </PanelRow>
                <div style={{ padding: '10px 20px 20px', display: 'flex', gap: '10px' }}>
                    <Button variant="primary" onClick={handleSave} isBusy={isSaving} disabled={!name || isSaving}>
                        {editingId ? 'Update Surface Type' : 'Add Surface Type'}
                    </Button>
                    {editingId && <Button variant="secondary" onClick={handleCancelEdit}>Cancel Edit</Button>}
                </div>
            </PanelBody>
            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h3 style={{ margin: 0 }}>Existing Surface Types</h3>
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
                    {surfaceTypes.length === 0 ? (
                        <tr><td colSpan="4">No surface types found.</td></tr>
                    ) : surfaceTypes.map(item => (
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

export default SurfaceTypesManager;
