import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { Button, TextControl, SelectControl, PanelBody, PanelRow } from '@wordpress/components';

const ColorsManager = () => {
    const [colors, setColors] = useState([]);
    const [families, setFamilies] = useState([]);
    const [newColorName, setNewColorName] = useState('');
    const [newColorHex, setNewColorHex] = useState('');
    const [newColorFamilyId, setNewColorFamilyId] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchFamilies();
        fetchColors();
    }, []);

    const fetchFamilies = async () => {
        try {
            const data = await apiFetch({ path: '/paint-store/v1/families' });
            setFamilies(data);
        } catch (error) {
            console.error('Error fetching families:', error);
        }
    };

    const fetchColors = async () => {
        try {
            const data = await apiFetch({ path: '/paint-store/v1/colors' });
            setColors(data);
        } catch (error) {
            console.error('Error fetching colors:', error);
        }
    };

    const handleCreateColor = async () => {
        if (!newColorName || !newColorFamilyId) return;
        setIsSaving(true);
        try {
            await apiFetch({
                path: '/paint-store/v1/colors',
                method: 'POST',
                data: {
                    name: newColorName,
                    hex_value: newColorHex,
                    rgb_value: '', // We can auto-calculate this later if needed
                    family_id: newColorFamilyId
                },
            });
            setNewColorName('');
            setNewColorHex('');
            setNewColorFamilyId('');
            fetchColors(); // Refresh the list
        } catch (error) {
            console.error('Error creating color:', error);
        }
        setIsSaving(false);
    };

    const familyOptions = [
        { label: 'Select a Family...', value: '' },
        ...families.map(family => ({ label: family.name, value: family.id }))
    ];

    return (
        <div className="colors-manager" style={{ marginTop: '30px' }}>
            <PanelBody title="Add New Specific Color" initialOpen={true}>
                <PanelRow>
                    <TextControl
                        label="Color Name (e.g., Naval Blue)"
                        value={newColorName}
                        onChange={(value) => setNewColorName(value)}
                    />
                </PanelRow>
                <PanelRow>
                    <TextControl
                        label="Hex Value (e.g., #324354)"
                        value={newColorHex}
                        onChange={(value) => setNewColorHex(value)}
                    />
                </PanelRow>
                <PanelRow>
                    <SelectControl
                        label="Assign to Family"
                        value={newColorFamilyId}
                        options={familyOptions}
                        onChange={(value) => setNewColorFamilyId(value)}
                    />
                </PanelRow>
                <Button
                    variant="primary"
                    onClick={handleCreateColor}
                    isBusy={isSaving}
                    disabled={!newColorName || !newColorFamilyId || isSaving}
                >
                    Add Color
                </Button>
            </PanelBody>

            <div style={{ marginTop: '20px' }}>
                <h3>Existing Colors</h3>
                <table className="wp-list-table widefat fixed striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Family ID</th>
                            <th>Color Hex</th>
                        </tr>
                    </thead>
                    <tbody>
                        {colors.length === 0 ? (
                            <tr><td colSpan="4">No colors found.</td></tr>
                        ) : (
                            colors.map(color => (
                                <tr key={color.id}>
                                    <td>{color.id}</td>
                                    <td>{color.name}</td>
                                    <td>{color.family_id}</td>
                                    <td>
                                        <span style={{
                                            display: 'inline-block',
                                            width: '20px',
                                            height: '20px',
                                            backgroundColor: color.hex_value,
                                            marginRight: '10px',
                                            border: '1px solid #ccc'
                                        }}></span>
                                        {color.hex_value}
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
