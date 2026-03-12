import { useState, useEffect, useRef, useCallback } from '@wordpress/element';

// Dynamically load the Google Maps Places script once
let mapsLoadPromise = null;
const loadGoogleMaps = (apiKey) => {
    if (!apiKey) return Promise.reject('No API key');
    if (window.google && window.google.maps && window.google.maps.places) {
        return Promise.resolve();
    }
    if (mapsLoadPromise) return mapsLoadPromise;

    mapsLoadPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        script.onerror = () => reject('Failed to load Google Maps');
        document.head.appendChild(script);
    });
    return mapsLoadPromise;
};

// Haversine formula to calculate distance between two coordinates in km
const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const DeliveryAddressSearch = ({ apiKey, storeLat, storeLng, ratePerKm, currencySymbol, onAddressSelect }) => {
    const inputRef = useRef(null);
    const autocompleteRef = useRef(null);
    const [mapsReady, setMapsReady] = useState(false);
    const [loadError, setLoadError] = useState('');
    const [address, setAddress] = useState('');
    const [distanceKm, setDistanceKm] = useState(null);
    const [deliveryFee, setDeliveryFee] = useState(null);

    useEffect(() => {
        if (!apiKey) {
            setLoadError('Google Maps API key not configured. Please add it in Paint Store → Orders → Settings.');
            return;
        }
        loadGoogleMaps(apiKey)
            .then(() => setMapsReady(true))
            .catch((err) => setLoadError(typeof err === 'string' ? err : 'Failed to load Google Maps.'));
    }, [apiKey]);

    useEffect(() => {
        if (!mapsReady || !inputRef.current || autocompleteRef.current) return;

        autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
            types: ['address'],
            componentRestrictions: { country: 'gh' }, // Restrict to Ghana
            fields: ['formatted_address', 'geometry', 'name'],
        });

        autocompleteRef.current.addListener('place_changed', () => {
            const place = autocompleteRef.current.getPlace();
            if (place && place.formatted_address) {
                setAddress(place.formatted_address);
                const lat = place.geometry?.location?.lat();
                const lng = place.geometry?.location?.lng();

                let dist = null;
                let fee = null;

                if (lat && lng && storeLat && storeLng) {
                    dist = calculateDistanceKm(parseFloat(storeLat), parseFloat(storeLng), lat, lng);
                    setDistanceKm(dist);

                    const rate = parseFloat(ratePerKm) || 0;
                    fee = dist * rate;
                    setDeliveryFee(fee);
                } else {
                    setDistanceKm(null);
                    setDeliveryFee(null);
                }

                if (onAddressSelect) {
                    onAddressSelect({
                        address: place.formatted_address,
                        lat: lat,
                        lng: lng,
                        distanceKm: dist,
                        deliveryFee: fee
                    });
                }
            }
        });
    }, [mapsReady]);

    if (loadError) {
        return (
            <div style={{ fontSize: '13px', color: '#888', fontStyle: 'italic', padding: '8px 0' }}>
                {loadError}
            </div>
        );
    }

    return (
        <div style={{ marginTop: '12px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#333', marginBottom: '6px' }}>
                📍 Enter delivery address
            </label>
            <div style={{ position: 'relative' }}>
                <input
                    ref={inputRef}
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={mapsReady ? "Start typing your address..." : "Loading maps..."}
                    disabled={!mapsReady}
                    style={{
                        width: '100%',
                        padding: '10px 14px 10px 36px',
                        border: '1px solid #ccc',
                        borderRadius: '6px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        backgroundColor: mapsReady ? '#fff' : '#f5f5f5',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#0070bc'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#ccc'; }}
                />
                <span style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '16px',
                    color: '#888',
                    pointerEvents: 'none',
                }}>🔍</span>
            </div>

            {distanceKm !== null && deliveryFee !== null && (
                <div style={{
                    marginTop: '10px',
                    padding: '10px 12px',
                    backgroundColor: '#e3f2fd',
                    borderRadius: '6px',
                    border: '1px solid #bbdefb',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '14px'
                }}>
                    <div style={{ color: '#1565c0' }}>
                        <span style={{ fontWeight: '600' }}>Delivery Distance:</span> {distanceKm.toFixed(1)} km
                    </div>
                    <div style={{ color: '#0d47a1', fontWeight: 'bold', fontSize: '15px' }}>
                        Fee: {currencySymbol} {deliveryFee.toFixed(2)}
                    </div>
                </div>
            )}

            {address && (!storeLat || !storeLng) && (
                <div style={{ marginTop: '8px', fontSize: '12px', color: '#d32f2f' }}>
                    Note: Store location is not configured. Delivery fee cannot be calculated.
                </div>
            )}
        </div>
    );
};

const FulfillmentOptions = ({ selectedOption, onOptionSelect, stockQty, deliveryAddress, onDeliveryAddressChange }) => {
    const pickupTime = "3 hrs";
    const deliveryTime = "Today";

    const hasStock = typeof stockQty === 'number' && stockQty > 0;
    const pickupStock = hasStock ? stockQty : 0;
    const deliveryStock = hasStock ? stockQty : 0;

    // Read the Google Maps settings from the localized PHP data
    const settings = (typeof window !== 'undefined' && window.paintStoreSettings) ? window.paintStoreSettings : {};
    const apiKey = settings.googleMapsApiKey || '';
    const storeLat = settings.storeLat || '';
    const storeLng = settings.storeLng || '';
    const ratePerKm = settings.deliveryRatePerKm || '2.00';
    const currencySymbol = settings.currencySymbol || 'GHS';

    const OptionCard = ({ type, title, subtitleHtml, stockText, isSelected, onClick, isOutOfStock }) => {
        const isBlue = isSelected;
        const isDisabled = isOutOfStock;

        return (
            <div
                onClick={isDisabled ? undefined : onClick}
                style={{
                    position: 'relative',
                    flex: 1,
                    border: isBlue ? '2px solid #0070bc' : '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    backgroundColor: isDisabled ? '#f5f5f5' : '#fff',
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                    minWidth: '200px',
                    transition: 'all 0.2s ease',
                    opacity: isDisabled ? 0.6 : 1
                }}
            >
                {isSelected && !isDisabled && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '0',
                        height: '0',
                        borderTop: '35px solid #0070bc',
                        borderLeft: '35px solid transparent',
                        zIndex: 1
                    }}>
                        <span style={{
                            position: 'absolute',
                            top: '-32px',
                            right: '3px',
                            color: '#fff',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            zIndex: 2
                        }}>✓</span>
                    </div>
                )}

                <h4 style={{
                    margin: '0 0 6px 0',
                    fontSize: '18px',
                    color: isBlue && !isDisabled ? '#0070bc' : '#222',
                    fontWeight: '700'
                }}>
                    {title}
                </h4>

                <div style={{ fontSize: '14px', color: '#333', marginBottom: '4px' }}>
                    {subtitleHtml}
                </div>

                <div style={{ fontSize: '13px', color: isOutOfStock ? '#c33' : '#333' }}>
                    {stockText}
                </div>
            </div>
        );
    };

    return (
        <div style={{ marginBottom: '25px', width: '100%' }}>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <OptionCard
                    type="pickup"
                    title="Pickup"
                    subtitleHtml={hasStock
                        ? <>Ready within <span style={{ color: '#006d2c', fontWeight: 'bold' }}>{pickupTime}</span></>
                        : <span style={{ color: '#888' }}>Select size & sheen</span>
                    }
                    stockText={hasStock ? `${pickupStock} in stock` : 'Select options to check availability'}
                    isSelected={selectedOption === 'pickup'}
                    isOutOfStock={false}
                    onClick={() => onOptionSelect('pickup')}
                />

                <OptionCard
                    type="delivery"
                    title="Delivery"
                    subtitleHtml={hasStock
                        ? <>As soon as <span style={{ color: '#006d2c', fontWeight: 'bold' }}>{deliveryTime}</span></>
                        : <span style={{ color: '#888' }}>Select size & sheen</span>
                    }
                    stockText={hasStock ? `${deliveryStock} available` : 'Select options to check availability'}
                    isSelected={selectedOption === 'delivery'}
                    isOutOfStock={false}
                    onClick={() => onOptionSelect('delivery')}
                />
            </div>

            {/* Address Search — shown when Delivery is selected */}
            {selectedOption === 'delivery' && (
                <DeliveryAddressSearch
                    apiKey={apiKey}
                    storeLat={storeLat}
                    storeLng={storeLng}
                    ratePerKm={ratePerKm}
                    currencySymbol={currencySymbol}
                    onAddressSelect={onDeliveryAddressChange}
                />
            )}
        </div>
    );
};

export default FulfillmentOptions;
