import { useState } from '@wordpress/element';

const OverviewSection = ({ description }) => {
    const [isOpen, setIsOpen] = useState(true);

    if (!description) return null;

    return (
        <div id="overview" className="ps-overview-section" style={{
            width: '100vw',
            marginLeft: 'calc(-50vw + 50%)',
            boxSizing: 'border-box',
            background: '#fff',
            borderTop: '1px solid #eee',
            borderBottom: '1px solid #eee'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '1200px', // Matches the width of the main content area roughly
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
                    Overview
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
                    <div style={{
                        fontSize: '15px',
                        lineHeight: '1.6',
                        color: '#333'
                    }}>
                        {/* We use dangerouslySetInnerHTML because the description is WYSIWYG HTML from WordPress */}
                        <div
                            className="ps-overview-content"
                            dangerouslySetInnerHTML={{ __html: description }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default OverviewSection;
