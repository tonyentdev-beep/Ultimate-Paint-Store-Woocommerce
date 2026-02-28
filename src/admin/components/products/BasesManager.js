import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { Button, TextControl, PanelBody, PanelRow } from '@wordpress/components';

const BasesManager = () => {
    const [bases, setBases] = useState([]);
    const [newBaseName, setNewBaseName] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchBases();
    }, []);

    const fetchBases = async () => {
        try {
            const data = await apiFetch({ path: '/paint-store/v1/bases' });
            setBases(data);
        } catch (error) {
            console.error('Error fetching bases:', error);
        }
    };

    const handleCreateBase = async () => {
        if (!newBaseName) return;
        setIsSaving(true);
        try {
            await apiFetch({
                path: '/paint-store/v1/bases',
                method: 'POST',
                data: {
                    name: newBaseName
                },
            });
            setNewBaseName('');
            fetchBases(); // Refresh the list
        } catch (error) {
            console.error('Error creating base:', error);
        }
        setIsSaving(false);
    };

    return (
        <div className="bases-manager">
            <PanelBody title="Add New Paint Base" initialOpen={true}>
                <PanelRow>
                    <TextControl
                        label="Base Name (e.g., Deep Base, Extra White)"
                        value={newBaseName}
                        onChange={(value) => setNewBaseName(value)}
                    />
                </PanelRow>
                <Button
                    variant="primary"
                    onClick={handleCreateBase}
                    isBusy={isSaving}
                    disabled={!newBaseName || isSaving}
                >
                    Add Base
                </Button>
            </PanelBody>

            <div style={{ marginTop: '20px' }}>
                <h3>Existing Bases</h3>
                <table className="wp-list-table widefat fixed striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bases.length === 0 ? (
                            <tr><td colSpan="2">No bases found. Add some above.</td></tr>
                        ) : (
                            bases.map(base => (
                                <tr key={base.id}>
                                    <td>{base.id}</td>
                                    <td>{base.name}</td>
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
