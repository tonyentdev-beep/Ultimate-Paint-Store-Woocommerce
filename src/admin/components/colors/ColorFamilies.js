import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { Button, TextControl, PanelBody, PanelRow } from '@wordpress/components';

const ColorFamilies = ({ families, fetchFamilies }) => {
    const [newFamilyName, setNewFamilyName] = useState('');
    const [newFamilyHex, setNewFamilyHex] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const handleSaveFamily = async () => {
        if (!newFamilyName) return;
        setIsSaving(true);
        try {
            if (editingId) {
                await apiFetch({
                    path: `/paint-store/v1/families/${editingId}`,
                    method: 'PUT',
                    data: {
                        name: newFamilyName,
                        hex_representative: newFamilyHex
                    },
                });
            } else {
                await apiFetch({
                    path: '/paint-store/v1/families',
                    method: 'POST',
                    data: {
                        name: newFamilyName,
                        hex_representative: newFamilyHex
                    },
                });
            }
            setNewFamilyName('');
            setNewFamilyHex('');
            setEditingId(null);
            fetchFamilies(); // Refresh the list
        } catch (error) {
            console.error('Error saving family:', error);
            alert('Error saving family: ' + (error.message || JSON.stringify(error)));
        }
        setIsSaving(false);
    };

    const handleEdit = (family) => {
        setEditingId(family.id);
        setNewFamilyName(family.name);
        setNewFamilyHex(family.hex_representative);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setNewFamilyName('');
        setNewFamilyHex('');
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this family?')) return;
        try {
            await apiFetch({
                path: `/paint-store/v1/families/${id}`,
                method: 'DELETE',
            });
            if (editingId === id) handleCancelEdit();
            fetchFamilies();
        } catch (error) {
            console.error('Error deleting family:', error);
            alert('Error deleting family: ' + (error.message || JSON.stringify(error)));
        }
    };

    return (
        <div className="color-families-manager">
            <PanelBody title={editingId ? "Edit Color Family" : "Add New Color Family"} initialOpen={true}>
                <PanelRow>
                    <TextControl
                        label="Family Name (e.g., Blues)"
                        value={newFamilyName}
                        onChange={(value) => setNewFamilyName(value)}
                    />
                </PanelRow>
                <PanelRow>
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '15px' }}>
                        <div style={{ flex: 1 }}>
                            <TextControl
                                label="Representative Hex Color (e.g., #0000FF)"
                                value={newFamilyHex}
                                onChange={(value) => setNewFamilyHex(value)}
                            />
                        </div>
                        <div className="color-swatch-box" style={{
                            width: '45px',
                            height: '45px',
                            backgroundColor: newFamilyHex || '#ffffff',
                            marginTop: '15px'
                        }}></div>
                    </div>
                </PanelRow>
                <div style={{ padding: '10px 20px 20px', display: 'flex', gap: '10px' }}>
                    <Button
                        variant="primary"
                        onClick={handleSaveFamily}
                        isBusy={isSaving}
                        disabled={!newFamilyName || isSaving}
                    >
                        {editingId ? 'Update Family' : 'Add Family'}
                    </Button>
                    {editingId && (
                        <Button variant="secondary" onClick={handleCancelEdit}>
                            Cancel Edit
                        </Button>
                    )}
                </div>
            </PanelBody>

            <div style={{ marginTop: '30px' }}>
                <h3>Existing Families</h3>
                <table className="wp-list-table widefat fixed striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Slug</th>
                            <th>Color Hex</th>
                            <th style={{ width: '150px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {families.length === 0 ? (
                            <tr><td colSpan="5">No families found.</td></tr>
                        ) : (
                            families.map(family => (
                                <tr key={family.id}>
                                    <td>{family.id}</td>
                                    <td><strong>{family.name}</strong></td>
                                    <td><code>{family.slug}</code></td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span className="color-swatch-box" style={{
                                                display: 'inline-block',
                                                width: '24px',
                                                height: '24px',
                                                backgroundColor: family.hex_representative
                                            }}></span>
                                            {family.hex_representative}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <Button isSmall variant="secondary" onClick={() => handleEdit(family)}>Edit</Button>
                                            <Button isSmall isDestructive onClick={() => handleDelete(family.id)}>Delete</Button>
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

export default ColorFamilies;
