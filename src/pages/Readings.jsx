export default function() {

    const links = [
        "https://caseymuratori.com/blog_0015"
    ]

    return (
        <div className="steam-box" id="reading">
            <div className="steam-box-title">Some of my favourite readings</div>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {links.length === 0 ? (
                    <p style={{ color: '#888' }}>None found</p>
                ) : (
                    links.map((link) => (
                        <li key={link} style={{ marginBottom: '10px', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid transparent' }}>
                            <a href={link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block', color: '#fff' }}>
                                {link}
                            </a>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}
