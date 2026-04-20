export default function ContactColumn() {
    const links = [
        { label: 'Email', value: 'shivom.sharma.eng@gmail.com', href: 'mailto:shivom.sharma.eng@gmail.com' },
        { label: 'GitHub', value: 'github.com/ssh-vom', href: 'https://github.com/ssh-vom' },
        { label: 'LinkedIn', value: 'linkedin.com/in/shivomsharma', href: 'https://linkedin.com/in/shivomsharma' },
        { label: 'Resume', value: 'Download PDF', href: 'https://drive.google.com/file/d/1dF-L6oKwGsYKAEfJycaFoQokeM7xw6NR/view?usp=drive_link' },
    ];

    return (
        <div className="contact-grid">
            {links.map((link, idx) => (
                <a 
                    href={link.href}
                    target={link.href.startsWith('mailto') ? undefined : '_blank'}
                    rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                    className="contact-card"
                    key={idx}
                >
                    <div className="contact-label">{link.label}</div>
                    <div className="contact-value">{link.value}</div>
                </a>
            ))}
        </div>
    );
}
