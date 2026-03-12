import { __ } from '@wordpress/i18n';

const BrushSpecificationsSection = ({ familyData }) => {
    // Check if tool attributes exist and if make is brushes
    if (!familyData || !familyData.family || familyData.family.make_slug !== 'brushes') {
        return null;
    }

    const family = familyData.family;

    // Helper to render N/A if empty
    const renderVal = (val) => val ? val : <span style={{ color: '#999', fontStyle: 'italic' }}>N/A</span>;

    const SpecRow = ({ label, value }) => (
        <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '15px 20px', fontWeight: 'bold', color: '#555', width: '40%' }}>{label}</td>
            <td style={{ padding: '15px 20px', fontSize: '15px', color: '#333' }}>{renderVal(value)}</td>
        </tr>
    );

    return (
        <div id="brush-specifications" style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', boxSizing: 'border-box' }}>
            <h2 style={{ fontSize: '28px', color: '#00598E', marginBottom: '20px', textAlign: 'center' }}>Specifications</h2>
            
            <div style={{ overflowX: 'auto', paddingBottom: '20px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: '#fff', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderRadius: '8px', overflow: 'hidden' }}>
                    <thead>
                        <tr style={{ background: '#f5fbff', borderBottom: '2px solid #00598E' }}>
                            <th colSpan="2" style={{ padding: '20px', fontSize: '18px', color: '#00598E' }}>Brush Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        <SpecRow label="Handle Shape" value={family.tool_handle_shape} />
                        <SpecRow label="Bristle Material" value={family.tool_bristle_material} />
                        <SpecRow label="Head Shape" value={family.tool_head_shape} />
                        <SpecRow label="Handle Length" value={family.tool_handle_length} />
                        <SpecRow label="Handle Material" value={family.tool_handle_material} />
                        <SpecRow label="Stiffness" value={family.tool_stiffness} />
                        <SpecRow label="Paint / Stain Compatibility" value={family.tool_paint_compat} />
                        <SpecRow label="Ferrule Material" value={family.tool_ferrule_material} />
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BrushSpecificationsSection;
