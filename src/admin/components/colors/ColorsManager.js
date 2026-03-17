import { useState, useMemo } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { Button, TextControl, TextareaControl, SelectControl, PanelBody, PanelRow, CheckboxControl, ToggleControl } from '@wordpress/components';

const ITEMS_PER_PAGE = 25;

const ColorsManager = ({ colors, families, allBases, brands, fetchColors }) => {
    const [newColorName, setNewColorName] = useState('');
    const [newColorCode, setNewColorCode] = useState('');
    const [newColorHex, setNewColorHex] = useState('');
    const [newColorFamilyId, setNewColorFamilyId] = useState('');
    const [newColorBrandId, setNewColorBrandId] = useState('');
    const [newColorDescription, setNewColorDescription] = useState('');
    const [selectedBases, setSelectedBases] = useState([]);
    const [selectedCoordinatingColors, setSelectedCoordinatingColors] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [isPopular, setIsPopular] = useState(false);
    const [isColorOfWeek, setIsColorOfWeek] = useState(false);

    // Filter & pagination state
    const [searchText, setSearchText] = useState('');
    const [filterBrand, setFilterBrand] = useState('');
    const [filterFamily, setFilterFamily] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const handleSaveColor = async () => {
        if (!newColorName || !newColorFamilyId || !newColorBrandId || selectedBases.length === 0) {
            alert("Name, Family, Brand, and at least one Base are required.");
            return;
        }
        setIsSaving(true);
        try {
            const payload = {
                name: newColorName,
                color_code: newColorCode,
                hex_value: newColorHex,
                rgb_value: '',
                description: newColorDescription,
                family_id: newColorFamilyId,
                brand_id: newColorBrandId,
                base_ids: selectedBases,
                coordinating_color_ids: selectedCoordinatingColors,
                is_popular: isPopular ? 1 : 0,
                is_color_of_week: isColorOfWeek ? 1 : 0
            };

            if (editingId) {
                await apiFetch({
                    path: `/paint-store/v1/colors/${editingId}`,
                    method: 'PUT',
                    data: payload,
                });
            } else {
                await apiFetch({
                    path: '/paint-store/v1/colors',
                    method: 'POST',
                    data: payload,
                });
            }

            setNewColorName('');
            setNewColorCode('');
            setNewColorHex('');
            setNewColorDescription('');
            setNewColorFamilyId('');
            setNewColorBrandId('');
            setSelectedBases([]);
            setSelectedCoordinatingColors([]);
            setEditingId(null);
            setIsPopular(false);
            setIsColorOfWeek(false);
            fetchColors();
        } catch (error) {
            console.error('Error saving color:', error);
            alert('Error saving color: ' + (error.message || JSON.stringify(error)));
        }
        setIsSaving(false);
    };

    const handleEdit = (color) => {
        setEditingId(color.id);
        setNewColorName(color.name);
        setNewColorCode(color.color_code || '');
        setNewColorHex(color.hex_value || '');
        setNewColorDescription(color.description || '');
        setNewColorFamilyId(color.family_id == 0 ? '' : color.family_id);
        setNewColorBrandId(color.brand_id == 0 ? '' : color.brand_id);
        setSelectedBases(color.base_ids || []);
        setSelectedCoordinatingColors(color.coordinating_color_ids || []);
        setIsPopular(parseInt(color.is_popular) === 1);
        setIsColorOfWeek(parseInt(color.is_color_of_week) === 1);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setNewColorName('');
        setNewColorCode('');
        setNewColorHex('');
        setNewColorDescription('');
        setNewColorFamilyId('');
        setNewColorBrandId('');
        setSelectedBases([]);
        setSelectedCoordinatingColors([]);
        setIsPopular(false);
        setIsColorOfWeek(false);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this color?')) return;
        try {
            await apiFetch({
                path: `/paint-store/v1/colors/${id}`,
                method: 'DELETE',
            });
            if (editingId === id) handleCancelEdit();
            fetchColors();
        } catch (error) {
            console.error('Error deleting color:', error);
            alert('Error deleting color: ' + (error.message || JSON.stringify(error)));
        }
    };

    const toggleBaseSelection = (baseId) => {
        setSelectedBases((prev) =>
            prev.includes(baseId)
                ? prev.filter((id) => id !== baseId)
                : [...prev, baseId]
        );
    };

    const handleCoordinatingColorsChange = (values) => {
        setSelectedCoordinatingColors(values.map(val => parseInt(val, 10)));
    };

    const familyOptions = [
        { label: 'Select a Family...', value: '' },
        ...families.map(family => ({ label: family.name, value: family.id }))
    ];

    const brandOptions = [
        { label: 'Select a Brand...', value: '' },
        ...brands.map(brand => ({ label: brand.name, value: brand.id }))
    ];

    const coordinatingColorOptions = colors
        .filter(c => c.id !== editingId) // Prevent self-referencing
        .map(c => ({ label: `${c.name} (${c.color_code})`, value: c.id }));

    // Filter options (for the filter bar, includes "All" option)
    const filterFamilyOptions = [
        { label: 'All Families', value: '' },
        ...families.map(family => ({ label: family.name, value: String(family.id) }))
    ];
    const filterBrandOptions = [
        { label: 'All Brands', value: '' },
        ...brands.map(brand => ({ label: brand.name, value: String(brand.id) }))
    ];

    const getBaseNames = (baseIds) => {
        if (!baseIds || baseIds.length === 0) return 'None';
        return baseIds
            .map(id => allBases.find(b => parseInt(b.id) === id)?.name || id)
            .join(', ');
    };

    const getBrandName = (brandId) => {
        if (!brandId) return '-';
        return brands.find(b => parseInt(b.id) === parseInt(brandId))?.name || brandId;
    };

    const getFamilyName = (familyId) => {
        if (!familyId) return '-';
        return families.find(f => parseInt(f.id) === parseInt(familyId))?.name || familyId;
    };

    // Filtered + paginated colors
    const filteredColors = useMemo(() => {
        let result = colors;

        if (searchText) {
            const q = searchText.toLowerCase();
            result = result.filter(c =>
                (c.name && c.name.toLowerCase().includes(q)) ||
                (c.color_code && c.color_code.toLowerCase().includes(q)) ||
                (c.hex_value && c.hex_value.toLowerCase().includes(q))
            );
        }

        if (filterBrand) {
            result = result.filter(c => String(c.brand_id) === filterBrand);
        }

        if (filterFamily) {
            result = result.filter(c => String(c.family_id) === filterFamily);
        }

        return result;
    }, [colors, searchText, filterBrand, filterFamily]);

    const totalPages = Math.max(1, Math.ceil(filteredColors.length / ITEMS_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);
    const paginatedColors = filteredColors.slice(
        (safePage - 1) * ITEMS_PER_PAGE,
        safePage * ITEMS_PER_PAGE
    );

    const handleClearFilters = () => {
        setSearchText('');
        setFilterBrand('');
        setFilterFamily('');
        setCurrentPage(1);
    };

    return (
        <div className="colors-manager" style={{ marginTop: '30px' }}>
            <PanelBody title={editingId ? "Edit Specific Color" : "Add New Specific Color"} initialOpen={true}>
                <PanelRow>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '100%' }}>
                        <TextControl
                            label="Color Name (e.g., Naval Blue)"
                            value={newColorName}
                            onChange={(value) => setNewColorName(value)}
                        />
                        <TextControl
                            label="Color Code (e.g., SW 6593)"
                            value={newColorCode}
                            onChange={(value) => setNewColorCode(value)}
                        />
                    </div>
                </PanelRow>
                <PanelRow>
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '15px' }}>
                        <div style={{ flex: 1 }}>
                            <TextControl
                                label="Hex Value (e.g., #324354)"
                                value={newColorHex}
                                onChange={(value) => setNewColorHex(value)}
                            />
                        </div>
                        <div className="color-swatch-box" style={{
                            width: '45px',
                            height: '45px',
                            backgroundColor: newColorHex || '#ffffff',
                            marginTop: '15px'
                        }}></div>
                    </div>
                </PanelRow>
                <PanelRow>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '100%' }}>
                        <SelectControl
                            label="Assign to Family"
                            value={newColorFamilyId}
                            options={familyOptions}
                            onChange={(value) => setNewColorFamilyId(value)}
                        />
                        <SelectControl
                            label="Assign to Brand"
                            value={newColorBrandId}
                            options={brandOptions}
                            onChange={(value) => setNewColorBrandId(value)}
                        />
                    </div>
                </PanelRow>
                <PanelRow>
                    <TextareaControl
                        label="Description (for SEO / Meta)"
                        help="Optional. This description will appear on the frontend and be used for search engine meta tags."
                        value={newColorDescription}
                        onChange={(value) => setNewColorDescription(value)}
                        rows={3}
                        style={{ width: '100%' }}
                    />
                </PanelRow>
                <PanelRow>
                    <SelectControl
                        multiple
                        label="Coordinating Colors (Optional)"
                        help="Hold CMD (Mac) or CTRL (Windows) to select multiple colors to recommend alongside this primary color."
                        value={selectedCoordinatingColors}
                        options={coordinatingColorOptions}
                        onChange={handleCoordinatingColorsChange}
                        style={{ width: '100%', height: '150px' }}
                    />
                </PanelRow>
                <div style={{ marginTop: '15px', padding: '15px 20px' }}>
                    <p style={{ fontWeight: 600, marginBottom: '10px' }}>Compatible Bases (Required)</p>
                    {allBases.length === 0 ? (
                        <p style={{ color: 'red', fontStyle: 'italic' }}>Please create Paint Bases in the Products & Bases tab first.</p>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                            {allBases.map((base) => (
                                <CheckboxControl
                                    key={base.id}
                                    label={base.name}
                                    checked={selectedBases.includes(parseInt(base.id))}
                                    onChange={() => toggleBaseSelection(parseInt(base.id))}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <PanelRow>
                    <div style={{ display: 'flex', gap: '30px', width: '100%' }}>
                        <ToggleControl
                            label="Popular Color"
                            help="Tag this color as Popular to display via [popular_colors] shortcode."
                            checked={isPopular}
                            onChange={setIsPopular}
                        />
                        <ToggleControl
                            label="Color of the Week"
                            help="Tag this color as Color of the Week to display via [colors_of_the_week] shortcode."
                            checked={isColorOfWeek}
                            onChange={setIsColorOfWeek}
                        />
                    </div>
                </PanelRow>

                <div style={{ padding: '0 20px 20px', display: 'flex', gap: '10px' }}>
                    <Button
                        variant="primary"
                        onClick={handleSaveColor}
                        isBusy={isSaving}
                        disabled={!newColorName || !newColorFamilyId || !newColorBrandId || selectedBases.length === 0 || isSaving}
                    >
                        {editingId ? 'Update Color' : 'Add Color'}
                    </Button>
                    {editingId && (
                        <Button variant="secondary" onClick={handleCancelEdit}>
                            Cancel Edit
                        </Button>
                    )}
                </div>
            </PanelBody>

            <div style={{ marginTop: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h3 style={{ margin: 0 }}>Existing Colors</h3>
                    <Button
                        variant="secondary"
                        href={`/wp-json/paint-store/v1/colors/export?_wpnonce=${window.wpApiSettings ? window.wpApiSettings.nonce : ''}`}
                        target="_blank"
                        icon={
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 16L7 11L8.4 9.55L11 12.15V4H13V12.15L15.6 9.55L17 11L12 16ZM6 20C5.45 20 4.97917 19.8042 4.5875 19.4125C4.19583 19.0208 4 18.55 4 18V15H6V18H18V15H20V18C20 18.55 19.8042 19.0208 19.4125 19.4125C19.0208 19.8042 18.55 20 18 20H6Z" fill="currentColor" />
                            </svg>
                        }
                    >
                        Export Colors to CSV
                    </Button>
                </div>

                {/* ─── Filter Bar ─── */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr auto',
                    gap: '15px',
                    alignItems: 'end',
                    marginBottom: '15px',
                    padding: '15px',
                    background: '#f0f0f1',
                    borderRadius: '6px',
                    border: '1px solid #ddd'
                }}>
                    <TextControl
                        label="Search by name, code, or hex"
                        value={searchText}
                        onChange={(v) => { setSearchText(v); setCurrentPage(1); }}
                        placeholder="e.g. Naval or SW 6593"
                    />
                    <SelectControl
                        label="Filter by Brand"
                        value={filterBrand}
                        options={filterBrandOptions}
                        onChange={(v) => { setFilterBrand(v); setCurrentPage(1); }}
                    />
                    <SelectControl
                        label="Filter by Family"
                        value={filterFamily}
                        options={filterFamilyOptions}
                        onChange={(v) => { setFilterFamily(v); setCurrentPage(1); }}
                    />
                    <Button
                        variant="secondary"
                        isSmall
                        onClick={handleClearFilters}
                        style={{ marginBottom: '8px' }}
                    >
                        Clear Filters
                    </Button>
                </div>

                <p style={{ color: '#666', marginBottom: '10px' }}>
                    Showing <strong>{paginatedColors.length}</strong> of <strong>{filteredColors.length}</strong> colors
                    {filteredColors.length !== colors.length && ` (${colors.length} total)`}
                    {' '} — Page <strong>{safePage}</strong> of <strong>{totalPages}</strong>
                </p>

                <table className="wp-list-table widefat fixed striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Code</th>
                            <th>Name</th>
                            <th>Brand</th>
                            <th>Family</th>
                            <th>Color Hex</th>
                            <th>Compatible Bases</th>
                            <th>Tags</th>
                            <th style={{ width: '150px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedColors.length === 0 ? (
                            <tr><td colSpan="8">No colors match your filters.</td></tr>
                        ) : (
                            paginatedColors.map(color => (
                                <tr key={color.id}>
                                    <td>{color.id}</td>
                                    <td><strong>{color.color_code || '-'}</strong></td>
                                    <td><strong>{color.name}</strong></td>
                                    <td>{getBrandName(color.brand_id)}</td>
                                    <td>{getFamilyName(color.family_id)}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span className="color-swatch-box" style={{
                                                display: 'inline-block',
                                                width: '24px',
                                                height: '24px',
                                                backgroundColor: color.hex_value
                                            }}></span>
                                            {color.hex_value}
                                        </div>
                                    </td>
                                    <td><em>{getBaseNames(color.base_ids)}</em></td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                            {parseInt(color.is_popular) === 1 && (
                                                <span style={{ background: '#ffc107', color: '#000', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600 }}>Popular</span>
                                            )}
                                            {parseInt(color.is_color_of_week) === 1 && (
                                                <span style={{ background: '#17a2b8', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600 }}>Week</span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <Button isSmall variant="secondary" onClick={() => handleEdit(color)}>Edit</Button>
                                            <Button isSmall isDestructive onClick={() => handleDelete(color.id)}>Delete</Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* ─── Pagination Controls ─── */}
                {totalPages > 1 && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '8px',
                        marginTop: '20px',
                        padding: '10px'
                    }}>
                        <Button
                            variant="secondary"
                            isSmall
                            disabled={safePage <= 1}
                            onClick={() => setCurrentPage(1)}
                        >
                            « First
                        </Button>
                        <Button
                            variant="secondary"
                            isSmall
                            disabled={safePage <= 1}
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        >
                            ‹ Prev
                        </Button>
                        <span style={{ padding: '0 12px', fontWeight: 600 }}>
                            Page {safePage} of {totalPages}
                        </span>
                        <Button
                            variant="secondary"
                            isSmall
                            disabled={safePage >= totalPages}
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        >
                            Next ›
                        </Button>
                        <Button
                            variant="secondary"
                            isSmall
                            disabled={safePage >= totalPages}
                            onClick={() => setCurrentPage(totalPages)}
                        >
                            Last »
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ColorsManager;
