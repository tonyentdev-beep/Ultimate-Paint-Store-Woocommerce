import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { Button, TextControl, PanelBody, PanelRow } from '@wordpress/components';

const SizesManager = ({ sizes, fetchSizes }) => {
    const [name, setName] = useState('');
    const [liters, setLiters] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncMessage, setSyncMessage] = useState('');

    const handleSave = async () => {
        if (!name) return;
        setIsSaving(true);
        try {
            const data = { name, liters: parseFloat(liters) || 0 };
            if (editingId) {
                await apiFetch({ path: `/paint-store/v1/sizes/${editingId}`, method: 'PUT', data });
            } else {
                await apiFetch({ path: '/paint-store/v1/sizes', method: 'POST', data });
            }
            setName(''); setLiters(''); setEditingId(null); fetchSizes();
        } catch (error) {
            console.error('Error saving size:', error);
            alert('Error saving size: ' + (error.message || JSON.stringify(error)));
        }
        setIsSaving(false);
    };

    const handleEdit = (item) => { setEditingId(item.id); setName(item.name); setLiters(item.liters || ''); };
    const handleCancelEdit = () => { setEditingId(null); setName(''); setLiters(''); };
    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this size?')) return;
        try {
            await apiFetch({ path: `/paint-store/v1/sizes/${id}`, method: 'DELETE' });
            if (editingId === id) handleCancelEdit();
            fetchSizes();
        } catch (error) { alert('Error deleting size: ' + (error.message || JSON.stringify(error))); }
    };

    const handleSync = async () => {
        setIsSyncing(true);
        setSyncMessage('');
        try {
            const result = await apiFetch({ path: '/paint-store/v1/sizes/sync', method: 'POST' });
            setSyncMessage(`✅ Synced ${result.synced} sizes to WooCommerce!`);
            fetchSizes(); // Refresh to get the new wc_attribute_ids
            setTimeout(() => setSyncMessage(''), 4000);
        } catch (error) {
            console.error('Error syncing:', error);
            setSyncMessage(`❌ Error: ${error.message || JSON.stringify(error)}`);
        }
        setIsSyncing(false);
    };

    return (
        <div className="sizes-manager">
            <PanelBody title={editingId ? "Edit Size" : "Add New Size"} initialOpen={true}>
                <PanelRow>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '100%' }}>
                        <TextControl label="Size Name (e.g., 1 Gallon, 5 Gallon)" value={name} onChange={setName} />
                        <TextControl label="Liters (e.g., 3.78)" value={liters} onChange={setLiters} type="number" step="0.01" />
                    </div>
                </PanelRow>
                <div style={{ padding: '10px 20px 20px', display: 'flex', gap: '10px' }}>
                    <Button variant="primary" onClick={handleSave} isBusy={isSaving} disabled={!name || isSaving}>
                        {editingId ? 'Update Size' : 'Add Size'}
                    </Button>
                    {editingId && <Button variant="secondary" onClick={handleCancelEdit}>Cancel Edit</Button>}
                </div>
            </PanelBody>
            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h3 style={{ margin: 0 }}>Existing Sizes</h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {syncMessage && <span style={{ fontSize: '13px', color: syncMessage.includes('✅') ? '#3c763d' : '#a94442' }}>{syncMessage}</span>}
                    <Button variant="secondary" onClick={handleSync} isBusy={isSyncing} disabled={isSyncing}>
                        🔄 Sync with WooCommerce
                    </Button>
                </div>
            </div>
            <table className="wp-list-table widefat fixed striped" style={{ marginTop: '10px' }}>
                <thead><tr><th>ID</th><th>Name</th><th>Liters</th><th>WooCommerce Sync</th><th style={{ width: '150px' }}>Actions</th></tr></thead>
                <tbody>
                    {sizes.length === 0 ? (
                        <tr><td colSpan="5">No sizes found.</td></tr>
                    ) : sizes.map(item => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td><strong>{item.name}</strong></td>
                            <td>{item.liters}L</td>
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

export default SizesManager;
