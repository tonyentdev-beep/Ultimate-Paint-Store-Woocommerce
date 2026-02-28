import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { Button, TextControl, PanelBody, PanelRow } from '@wordpress/components';

const ColorFamilies = () => {
    const [families, setFamilies] = useState([]);
    const [newFamilyName, setNewFamilyName] = useState('');
    const [newFamilyHex, setNewFamilyHex] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchFamilies();
    }, []);

    const fetchFamilies = async () => {
        try {
            const data = await apiFetch({ path: '/paint-store/v1/families' });
            setFamilies(data);
        } catch (error) {
            console.error('Error fetching families:', error);
        }
    };

    const handleCreateFamily = async () => {
        if (!newFamilyName) return;
        setIsSaving(true);
        try {
            await apiFetch({
                path: '/paint-store/v1/families',
                method: 'POST',
                data: {
                    name: newFamilyName,
                    hex_representative: newFamilyHex
                },
            });
            setNewFamilyName('');
            setNewFamilyHex('');
            fetchFamilies(); // Refresh the list
        } catch (error) {
            console.error('Error creating family:', error);
        }
        setIsSaving(false);
    };

    return (
        <div className="color-families-manager">
            <PanelBody title="Add New Color Family" initialOpen={true}>
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
                        <div style={{
                            width: '50px',
                            height: '50px',
                            backgroundColor: newFamilyHex || '#ffffff',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            marginTop: '15px'
                        }}></div>
                    </div>
                </PanelRow>
                <Button
                    variant="primary"
                    onClick={handleCreateFamily}
                    isBusy={isSaving}
                    disabled={!newFamilyName || isSaving}
                >
                    Add Family
                </Button>
            </PanelBody>

            <div style={{ marginTop: '20px' }}>
                <h3>Existing Families</h3>
                <table className="wp-list-table widefat fixed striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Slug</th>
                            <th>Color Hex</th>
                        </tr>
                    </thead>
                    <tbody>
                        {families.length === 0 ? (
                            <tr><td colSpan="4">No families found.</td></tr>
                        ) : (
                            families.map(family => (
                                <tr key={family.id}>
                                    <td>{family.id}</td>
                                    <td>{family.name}</td>
                                    <td>{family.slug}</td>
                                    <td>
                                        <span style={{
                                            display: 'inline-block',
                                            width: '20px',
                                            height: '20px',
                                            backgroundColor: family.hex_representative,
                                            marginRight: '10px',
                                            border: '1px solid #ccc',
                                            verticalAlign: 'middle'
                                        }}></span>
                                        {family.hex_representative}
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
