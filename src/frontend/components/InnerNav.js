const InnerNav = () => {
    const menuItems = [
        { label: 'Review Selections', anchor: '#review-selections' },
        { label: 'Data Sheets', anchor: '#data-sheets' },
        { label: 'Reviews', anchor: '#reviews' },
        { label: 'Compare', anchor: '#compare' },
        { label: 'Q&A', anchor: '#qa' },
    ];

    const handleClick = (e, anchor) => {
        e.preventDefault();
        const target = document.querySelector(anchor);
        if (target) {
            const headerOffset = 180; // account for sticky top bar + this nav
            const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({ top: elementPosition - headerOffset, behavior: 'smooth' });
        }
    };

    return (
        <div style={{
            background: '#002E5D',
            width: '100%',
            boxSizing: 'border-box'
        }}>
            <div style={{
                width: '100%',
                margin: '0 auto',
                padding: '0 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '0',
                boxSizing: 'border-box'
            }}>


                {menuItems.map((item, idx) => (
                    <a
                        key={idx}
                        href={item.anchor}
                        onClick={(e) => handleClick(e, item.anchor)}
                        style={{
                            color: '#fff',
                            textDecoration: 'none',
                            fontSize: '14px',
                            fontWeight: '500',
                            padding: '12px 20px',
                            transition: 'background 0.2s',
                            whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                        {item.label}
                    </a>
                ))}
            </div>
        </div>
    );
};

export default InnerNav;
