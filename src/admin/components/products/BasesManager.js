import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { Button, TextControl, PanelBody, PanelRow } from '@wordpress/components';

const BasesManager = ({ bases, fetchBases }) => {
    const [newBaseName, setNewBaseName] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const handleSaveBase = async () => {
        if (!newBaseName) return;
        setIsSaving(true);
        try {
            if (editingId) {
                await apiFetch({
                    path: `/paint-store/v1/bases/${editingId}`,
                    method: 'PUT',
                    data: { name: newBaseName },
                });
            } else {
                await apiFetch({
                    path: '/paint-store/v1/bases',
                    method: 'POST',
                    data: { name: newBaseName },
                });
            }
            setNewBaseName('');
            setEditingId(null);
            fetchBases(); // Refresh the list
        } catch (error) {
            console.error('Error saving base:', error);
            alert('Error saving base: ' + (error.message || JSON.stringify(error)));
        }
        setIsSaving(false);
    };

    const handleEdit = (base) => {
        setEditingId(base.id);
        setNewBaseName(base.name);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setNewBaseName('');
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this base?')) return;
        try {
            await apiFetch({
                path: `/paint-store/v1/bases/${id}`,
                method: 'DELETE',
            });
            if (editingId === id) handleCancelEdit();
            fetchBases();
        } catch (error) {
            console.error('Error deleting base:', error);
            alert('Error deleting base: ' + (error.message || JSON.stringify(error)));
        }
    };

    return (
        <div className="bases-manager">
            <PanelBody title={editingId ? "Edit Paint Base" : "Add New Paint Base"} initialOpen={true}>
                <PanelRow>
                    <TextControl
                        label="Base Name (e.g., Deep Base, Extra White)"
                        value={newBaseName}
                        onChange={(value) => setNewBaseName(value)}
                    />
                </PanelRow>
                <div style={{ padding: '10px 20px 20px', display: 'flex', gap: '10px' }}>
                    <Button
                        variant="primary"
                        onClick={handleSaveBase}
                        isBusy={isSaving}
                        disabled={!newBaseName || isSaving}
                    >
                        {editingId ? 'Update Base' : 'Add Base'}
                    </Button>
                    {editingId && (
                        <Button variant="secondary" onClick={handleCancelEdit}>
                            Cancel Edit
                        </Button>
                    )}
                </div>
            </PanelBody>

            <div style={{ marginTop: '30px' }}>
                <h3>Existing Bases</h3>
                <table className="wp-list-table widefat fixed striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th style={{ width: '150px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bases.length === 0 ? (
                            <tr><td colSpan="3">No bases found. Add some above.</td></tr>
                        ) : (
                            bases.map(base => (
                                <tr key={base.id}>
                                    <td>{base.id}</td>
                                    <td><strong>{base.name}</strong></td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <Button isSmall variant="secondary" onClick={() => handleEdit(base)}>Edit</Button>
                                            <Button isSmall isDestructive onClick={() => handleDelete(base.id)}>Delete</Button>
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

export default BasesManager;
