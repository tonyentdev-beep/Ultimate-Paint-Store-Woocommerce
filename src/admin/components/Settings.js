import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { Button, TextControl, SelectControl, TextareaControl, PanelBody, PanelRow } from '@wordpress/components';

const Settings = () => {
    const [settings, setSettings] = useState({
        store_name: '',
        currency: 'USD',
        measurement_unit: 'gallons',
        store_phone: '',
        store_email: '',
        store_address: '',
    });
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const [dbUpgradeResult, setDbUpgradeResult] = useState('');
    const [isUpgradingDb, setIsUpgradingDb] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setIsLoading(true);
        try {
            const data = await apiFetch({ path: '/paint-store/v1/settings' });
            setSettings(data);
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
        setIsLoading(false);
    };

    const handleSave = async () => {
        setIsSaving(true);
        setSaveMessage('');
        try {
            await apiFetch({
                path: '/paint-store/v1/settings',
                method: 'POST',
                data: settings,
            });
            setSaveMessage('✅ Settings saved successfully!');
            setTimeout(() => setSaveMessage(''), 3000);
        } catch (error) {
            console.error('Error saving settings:', error);
            setSaveMessage('❌ Error saving settings.');
        }
        setIsSaving(false);
    };

    const handleUpgradeDb = async () => {
        setIsUpgradingDb(true);
        setDbUpgradeResult('Running database upgrade...');
        try {
            const result = await apiFetch({ path: '/paint-store/v1/upgrade-db' });
            setDbUpgradeResult(JSON.stringify(result, null, 2));
        } catch (error) {
            console.error('Error upgrading DB:', error);
            setDbUpgradeResult('Error: ' + (error.message || JSON.stringify(error)));
        }
        setIsUpgradingDb(false);
    };

    const updateField = (field, value) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const currencyOptions = [
        { label: 'USD ($)', value: 'USD' },
        { label: 'EUR (€)', value: 'EUR' },
        { label: 'GBP (£)', value: 'GBP' },
        { label: 'CAD (C$)', value: 'CAD' },
        { label: 'AUD (A$)', value: 'AUD' },
        { label: 'TTD (TT$)', value: 'TTD' },
        { label: 'JMD (J$)', value: 'JMD' },
        { label: 'BBD (Bds$)', value: 'BBD' },
        { label: 'XCD (EC$)', value: 'XCD' },
        { label: 'GYD (G$)', value: 'GYD' },
    ];

    const unitOptions = [
        { label: 'Gallons', value: 'gallons' },
        { label: 'Liters', value: 'liters' },
        { label: 'Quarts', value: 'quarts' },
    ];

    if (isLoading) {
        return <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Loading settings...</div>;
    }

    return (
        <div className="settings-page">
            {/* Store Information */}
            <PanelBody title="Store Information" initialOpen={true}>
                <PanelRow>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '100%' }}>
                        <TextControl
                            label="Store Name"
                            value={settings.store_name}
                            onChange={(v) => updateField('store_name', v)}
                            placeholder="My Paint Store"
                        />
                        <TextControl
                            label="Store Phone"
                            value={settings.store_phone}
                            onChange={(v) => updateField('store_phone', v)}
                            placeholder="+1 (868) 555-0123"
                        />
                    </div>
                </PanelRow>
                <PanelRow>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '100%' }}>
                        <TextControl
                            label="Store Email"
                            value={settings.store_email}
                            onChange={(v) => updateField('store_email', v)}
                            placeholder="info@mypaintstore.com"
                        />
                        <TextareaControl
                            label="Store Address"
                            value={settings.store_address}
                            onChange={(v) => updateField('store_address', v)}
                            placeholder="123 Main St, City, Country"
                            rows={2}
                        />
                    </div>
                </PanelRow>
            </PanelBody>

            {/* Display & Units */}
            <PanelBody title="Display & Units" initialOpen={true}>
                <PanelRow>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '100%' }}>
                        <SelectControl
                            label="Currency"
                            value={settings.currency}
                            options={currencyOptions}
                            onChange={(v) => updateField('currency', v)}
                        />
                        <SelectControl
                            label="Measurement Unit"
                            value={settings.measurement_unit}
                            options={unitOptions}
                            onChange={(v) => updateField('measurement_unit', v)}
                        />
                    </div>
                </PanelRow>
            </PanelBody>

            {/* Save Button */}
            <div style={{ padding: '20px 0', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Button
                    variant="primary"
                    onClick={handleSave}
                    isBusy={isSaving}
                    disabled={isSaving}
                    style={{ fontSize: '14px', padding: '8px 24px' }}
                >
                    {isSaving ? 'Saving...' : 'Save Settings'}
                </Button>
                {saveMessage && (
                    <span style={{
                        fontSize: '14px', fontWeight: 500,
                        color: saveMessage.includes('✅') ? '#3c763d' : '#a94442',
                    }}>
                        {saveMessage}
                    </span>
                )}
            </div>

            {/* Advanced Tools */}
            <PanelBody title="Advanced Tools" initialOpen={false}>
                <PanelRow>
                    <div style={{ width: '100%' }}>
                        <h4 style={{ margin: '0 0 8px' }}>Database Management</h4>
                        <p style={{ color: '#666', fontSize: '13px', margin: '0 0 15px' }}>
                            If you recently updated the plugin or added new features, click below to initialize or upgrade the database tables.
                        </p>
                        <Button
                            variant="secondary"
                            onClick={handleUpgradeDb}
                            disabled={isUpgradingDb}
                        >
                            {isUpgradingDb ? 'Upgrading...' : 'Initialize / Upgrade Database'}
                        </Button>
                        {dbUpgradeResult && (
                            <pre style={{
                                marginTop: '15px', padding: '15px', background: '#f0f0f1',
                                border: '1px solid #ccc', overflow: 'auto', maxHeight: '300px',
                                fontSize: '12px', borderRadius: '4px',
                            }}>
                                {dbUpgradeResult}
                            </pre>
                        )}
                    </div>
                </PanelRow>
            </PanelBody>
        </div>
    );
};

export default Settings;
