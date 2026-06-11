const navLinks = [
  { label: 'Work', anchor: 'work' },
  { label: 'Experience', anchor: 'experience' },
  { label: 'Writing', anchor: 'writing' },
  { label: 'Contact', anchor: 'contact' },
];

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

/**
 * Floating pill navigation. `homePath` is '' on the home page
 * (pure anchors) and '/' on subpages (route back home first).
 */
export default function SiteHeader({ theme, toggleTheme, homePath = '' }) {
  return (
    <header className="hdr hero-reveal" style={{ '--d': '0.05s' }}>
      <a className="hdr-brand" href={`${homePath || '/'}`} aria-label="Home">
        <img src="/images/pfp.jpeg" alt="" className="hdr-avatar" />
        <span>Shivom Sharma</span>
      </a>
      <nav className="hdr-nav" aria-label="Sections">
        {navLinks.map((link) => (
          <a key={link.anchor} className="hdr-link" href={`${homePath}#${link.anchor}`}>
            {link.label}
          </a>
        ))}
      </nav>
      <button
        className="hdr-theme"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      </button>
    </header>
  );
}
