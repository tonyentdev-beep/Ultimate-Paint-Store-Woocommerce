import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

const STATUS_COLORS = {
    pending: { bg: '#fff3e0', text: '#e65100', label: 'Pending' },
    processing: { bg: '#e3f2fd', text: '#1565c0', label: 'Processing' },
    ready: { bg: '#e8f5e9', text: '#2e7d32', label: 'Ready' },
    dispatched: { bg: '#ede7f6', text: '#4527a0', label: 'Dispatched' },
    delivered: { bg: '#e0f2f1', text: '#00695c', label: 'Delivered' },
    collected: { bg: '#e0f2f1', text: '#00695c', label: 'Collected' },
    cancelled: { bg: '#ffebee', text: '#c62828', label: 'Cancelled' },
};

const StatusBadge = ({ status }) => {
    const style = STATUS_COLORS[status] || { bg: '#eee', text: '#555', label: status };
    return (
        <span style={{
            display: 'inline-block',
            padding: '3px 10px',
            borderRadius: '12px',
            backgroundColor: style.bg,
            color: style.text,
            fontWeight: '600',
            fontSize: '12px',
            textTransform: 'capitalize'
        }}>
            {style.label}
        </span>
    );
};

const FulfillmentManager = () => {
    const [activeSubTab, setActiveSubTab] = useState('all');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [settings, setSettings] = useState({
        pickup_prep_time: '3',
        delivery_estimate: 'Same Day',
        store_address: '',
        store_lat: '',
        store_lng: '',
        delivery_rate_per_km: '2.00',
        currency_symbol: 'GHS',
        google_maps_api_key: '',
    });
    const [savingSettings, setSavingSettings] = useState(false);
    const [settingsSaved, setSettingsSaved] = useState(false);

    useEffect(() => {
        fetchOrders();
        fetchFulfillmentSettings();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiFetch({ path: '/paint-store/v1/admin/fulfillment-orders' });
            setOrders(data);
        } catch (err) {
            console.error('Error fetching fulfillment orders:', err);
            // If endpoint doesn't exist yet, show a placeholder
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchFulfillmentSettings = async () => {
        try {
            const data = await apiFetch({ path: '/paint-store/v1/admin/fulfillment-settings' });
            if (data) setSettings(data);
        } catch (err) {
            console.error('Error fetching fulfillment settings:', err);
        }
    };

    const saveSettings = async () => {
        setSavingSettings(true);
        setSettingsSaved(false);
        try {
            await apiFetch({
                path: '/paint-store/v1/admin/fulfillment-settings',
                method: 'POST',
                data: settings,
            });
            setSettingsSaved(true);
            setTimeout(() => setSettingsSaved(false), 3000);
        } catch (err) {
            console.error('Error saving settings:', err);
            alert('Failed to save settings.');
        } finally {
            setSavingSettings(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await apiFetch({
                path: `/paint-store/v1/admin/fulfillment-orders/${orderId}`,
                method: 'PUT',
                data: { status: newStatus },
            });
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (err) {
            console.error('Error updating order status:', err);
            alert('Failed to update order status.');
        }
    };

    const filteredOrders = activeSubTab === 'all'
        ? orders
        : orders.filter(o => o.fulfillment_type === activeSubTab);

    const pickupCount = orders.filter(o => o.fulfillment_type === 'pickup').length;
    const deliveryCount = orders.filter(o => o.fulfillment_type === 'delivery').length;

    return (
        <div>
            <ul className="subsubsub" style={{ marginBottom: '20px', fontSize: '14px' }}>
                <li>
                    <a href="#" className={activeSubTab === 'all' ? 'current' : ''}
                        onClick={(e) => { e.preventDefault(); setActiveSubTab('all'); }}>
                        All ({orders.length})
                    </a> |&nbsp;
                </li>
                <li>
                    <a href="#" className={activeSubTab === 'pickup' ? 'current' : ''}
                        onClick={(e) => { e.preventDefault(); setActiveSubTab('pickup'); }}>
                        🏪 Pickup ({pickupCount})
                    </a> |&nbsp;
                </li>
                <li>
                    <a href="#" className={activeSubTab === 'delivery' ? 'current' : ''}
                        onClick={(e) => { e.preventDefault(); setActiveSubTab('delivery'); }}>
                        🚚 Delivery ({deliveryCount})
                    </a> |&nbsp;
                </li>
                <li>
                    <a href="#" className={activeSubTab === 'settings' ? 'current' : ''}
                        onClick={(e) => { e.preventDefault(); setActiveSubTab('settings'); }}>
                        ⚙️ Settings
                    </a>
                </li>
            </ul>
            <div className="clear"></div>

            {activeSubTab === 'settings' ? (
                <div style={{ background: '#fff', padding: '20px', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', maxWidth: '600px' }}>
                    <h2 style={{ marginTop: 0 }}>Fulfillment Settings</h2>

                    <table className="form-table" role="presentation">
                        <tbody>
                            <tr>
                                <th><label htmlFor="pickup_prep_time">Pickup Prep Time (hours)</label></th>
                                <td>
                                    <input id="pickup_prep_time" type="number" className="regular-text"
                                        value={settings.pickup_prep_time}
                                        onChange={(e) => setSettings({ ...settings, pickup_prep_time: e.target.value })}
                                    />
                                    <p className="description">How many hours until a pickup order is ready.</p>
                                </td>
                            </tr>
                            <tr>
                                <th><label htmlFor="delivery_estimate">Delivery Estimate</label></th>
                                <td>
                                    <input id="delivery_estimate" type="text" className="regular-text"
                                        value={settings.delivery_estimate}
                                        onChange={(e) => setSettings({ ...settings, delivery_estimate: e.target.value })}
                                    />
                                    <p className="description">e.g., "Same Day", "Next Business Day"</p>
                                </td>
                            </tr>
                            <tr>
                                <th><label htmlFor="store_address">Store Address</label></th>
                                <td>
                                    <input id="store_address" type="text" className="large-text"
                                        value={settings.store_address}
                                        onChange={(e) => setSettings({ ...settings, store_address: e.target.value })}
                                        placeholder="e.g. 14 Independence Ave, Accra, Ghana"
                                    />
                                    <p className="description">Enter your store's full address. Click "Geocode" to auto-fill coordinates.</p>
                                    <div style={{ marginTop: '8px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <button type="button" className="button" onClick={async () => {
                                            if (!settings.google_maps_api_key || !settings.store_address) {
                                                alert('Please enter both a Google Maps API Key and Store Address first.');
                                                return;
                                            }
                                            try {
                                                const resp = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(settings.store_address)}&key=${settings.google_maps_api_key}`);
                                                const data = await resp.json();
                                                if (data.results && data.results.length > 0) {
                                                    const loc = data.results[0].geometry.location;
                                                    setSettings(prev => ({ ...prev, store_lat: String(loc.lat), store_lng: String(loc.lng) }));
                                                    alert(`Coordinates found: ${loc.lat}, ${loc.lng}`);
                                                } else {
                                                    alert('Could not geocode this address. Please try a more specific address.');
                                                }
                                            } catch (err) {
                                                alert('Geocoding failed: ' + err.message);
                                            }
                                        }}>📍 Geocode Address</button>
                                        {settings.store_lat && settings.store_lng && (
                                            <span style={{ fontSize: '12px', color: '#2e7d32' }}>✓ {settings.store_lat}, {settings.store_lng}</span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th><label htmlFor="delivery_rate_per_km">Delivery Rate per KM</label></th>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ fontWeight: '600' }}>{settings.currency_symbol || 'GHS'}</span>
                                        <input id="delivery_rate_per_km" type="number" step="0.01" className="regular-text"
                                            value={settings.delivery_rate_per_km}
                                            onChange={(e) => setSettings({ ...settings, delivery_rate_per_km: e.target.value })}
                                        />
                                    </div>
                                    <p className="description">Cost per kilometer for delivery. E.g., 2.00 means GHS 2.00/km.</p>
                                </td>
                            </tr>
                            <tr>
                                <th><label htmlFor="currency_symbol">Currency Symbol</label></th>
                                <td>
                                    <input id="currency_symbol" type="text" className="small-text"
                                        value={settings.currency_symbol}
                                        onChange={(e) => setSettings({ ...settings, currency_symbol: e.target.value })}
                                    />
                                    <p className="description">e.g., GHS, $, £</p>
                                </td>
                            </tr>
                            <tr>
                                <th><label htmlFor="google_maps_api_key">Google Maps API Key</label></th>
                                <td>
                                    <input id="google_maps_api_key" type="password" className="regular-text"
                                        value={settings.google_maps_api_key}
                                        onChange={(e) => setSettings({ ...settings, google_maps_api_key: e.target.value })}
                                        placeholder="AIza..."
                                    />
                                    <p className="description">Enable <strong>Maps JavaScript API</strong>, <strong>Places API</strong>, and <strong>Geocoding API</strong> in your Google Cloud Console.</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <p className="submit">
                        <button className="button button-primary" onClick={saveSettings} disabled={savingSettings}>
                            {savingSettings ? 'Saving…' : 'Save Changes'}
                        </button>
                        {settingsSaved && <span style={{ color: '#2e7d32', marginLeft: '10px' }}>✓ Settings saved!</span>}
                    </p>
                </div>
            ) : (
                <div style={{ background: '#fff', padding: '20px', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ margin: 0 }}>
                            {activeSubTab === 'pickup' ? '🏪 Pickup Orders' : activeSubTab === 'delivery' ? '🚚 Delivery Orders' : 'All Fulfillment Orders'}
                        </h2>
                        <button onClick={fetchOrders} className="button">Refresh</button>
                    </div>

                    {loading ? (
                        <p>Loading orders…</p>
                    ) : error ? (
                        <div style={{ color: 'red' }}>{error}</div>
                    ) : filteredOrders.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#666' }}>
                            <p style={{ fontSize: '16px', marginBottom: '8px' }}>No fulfillment orders yet.</p>
                            <p style={{ fontSize: '13px' }}>Orders submitted from the product page will appear here once the checkout is connected.</p>
                        </div>
                    ) : (
                        <table className="wp-list-table widefat fixed striped table-view-list">
                            <thead>
                                <tr>
                                    <th style={{ width: '60px' }}>ID</th>
                                    <th style={{ width: '12%' }}>Type</th>
                                    <th style={{ width: '20%' }}>Customer</th>
                                    <th style={{ width: '25%' }}>Items</th>
                                    <th style={{ width: '12%' }}>Status</th>
                                    <th style={{ width: '12%' }}>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map(order => (
                                    <tr key={order.id}>
                                        <td>#{order.id}</td>
                                        <td>
                                            <span style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600',
                                                backgroundColor: order.fulfillment_type === 'pickup' ? '#e3f2fd' : '#fff3e0',
                                                color: order.fulfillment_type === 'pickup' ? '#1565c0' : '#e65100',
                                            }}>
                                                {order.fulfillment_type === 'pickup' ? '🏪 Pickup' : '🚚 Delivery'}
                                            </span>
                                        </td>
                                        <td>
                                            <strong>{order.customer_name}</strong>
                                            {order.customer_email && <div style={{ fontSize: '12px', color: '#666' }}>{order.customer_email}</div>}
                                        </td>
                                        <td style={{ fontSize: '13px' }}>{order.items_summary || '—'}</td>
                                        <td><StatusBadge status={order.status} /></td>
                                        <td style={{ fontSize: '12px', color: '#666' }}>
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                style={{ fontSize: '12px' }}
                                            >
                                                {Object.entries(STATUS_COLORS).map(([key, val]) => (
                                                    <option key={key} value={key}>{val.label}</option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
};

export default FulfillmentManager;
