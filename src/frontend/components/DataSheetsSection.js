import { useState } from '@wordpress/element';

const DataSheetsSection = ({ datasheets }) => {
    const [isOpen, setIsOpen] = useState(true);

    if (!datasheets || datasheets.length === 0) return null;

    return (
        <div id="data-sheets" className="ps-overview-section" style={{
            width: '100vw',
            marginLeft: 'calc(-50vw + 50%)',
            boxSizing: 'border-box',
            background: '#fff',
            borderBottom: '1px solid #eee'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '40px 20px',
                boxSizing: 'border-box'
            }}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: 'none',
                        border: 'none',
                        borderBottom: isOpen ? '1px solid #eee' : 'none',
                        padding: '0 0 20px 0',
                        marginBottom: isOpen ? '20px' : '0',
                        cursor: 'pointer',
                        fontSize: '22px',
                        fontWeight: 'bold',
                        color: '#111'
                    }}
                >
                    Data Sheets
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s ease'
                        }}
                    >
                        <path d="M6 9L12 15L18 9" stroke="#00598E" strokeWidth="2.5" strokeLinecap="square" />
                    </svg>
                </button>

                {isOpen && (
                    <div className="ps-datasheets-table-container" style={{ overflowX: 'auto' }}>
                        <table style={{
                            width: '100%',
                            minWidth: '600px',
                            borderCollapse: 'collapse',
                            textAlign: 'left',
                            fontSize: '15px',
                            color: '#333'
                        }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f9f9f9', borderBottom: '2px solid #ddd' }}>
                                    <th style={{ padding: '12px 16px', fontWeight: 'bold' }}>Product No.</th>
                                    <th style={{ padding: '12px 16px', fontWeight: 'bold' }}>Sheen</th>
                                    <th style={{ padding: '12px 16px', fontWeight: 'bold' }}>Base / Color</th>
                                    <th style={{ padding: '12px 16px', fontWeight: 'bold' }}>Size</th>
                                    <th style={{ padding: '12px 16px', fontWeight: 'bold', textAlign: 'center' }}>SDS</th>
                                    <th style={{ padding: '12px 16px', fontWeight: 'bold', textAlign: 'center' }}>PDS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {datasheets.map((sheet, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '12px 16px' }}>{sheet.product_number || '--'}</td>
                                        <td style={{ padding: '12px 16px' }}>{sheet.sheen || '--'}</td>
                                        <td style={{ padding: '12px 16px' }}>{sheet.base_color || '--'}</td>
                                        <td style={{ padding: '12px 16px' }}>{sheet.container_size || '--'}</td>
                                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                            {sheet.sds_file_url ? (
                                                <a href={sheet.sds_file_url} target="_blank" rel="noopener noreferrer" style={{ color: '#00598E', textDecoration: 'none', fontWeight: 'bold' }}>
                                                    PDF
                                                </a>
                                            ) : '--'}
                                        </td>
                                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                            {sheet.pds_file_url ? (
                                                <a href={sheet.pds_file_url} target="_blank" rel="noopener noreferrer" style={{ color: '#00598E', textDecoration: 'none', fontWeight: 'bold' }}>
                                                    PDF
                                                </a>
                                            ) : '--'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DataSheetsSection;
