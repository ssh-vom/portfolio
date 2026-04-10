export default function MinimalHeader({ theme, toggleTheme }) {
  return (
    <header className="site-header">
      <div className="site-header-name">Shivom Sharma</div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <nav className="site-header-links">
          <a href="#experience">Experience</a>
          <a href="#projects">Projects</a>
          <a href="#blog">Writing</a>
          <a href="#contact">Contact</a>
        </nav>

        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
}
