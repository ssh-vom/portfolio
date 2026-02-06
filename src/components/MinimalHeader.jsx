import { useState, useEffect } from 'react';

export default function MinimalHeader({ theme, toggleTheme, readingMode = false }) {
  const [activeSection, setActiveSection] = useState('intro');

  useEffect(() => {
    if (readingMode) return;

    const handleScroll = () => {
      const scrollContainer = document.querySelector('.editorial-scroll-container');
      if (!scrollContainer) return;

      const scrollLeft = scrollContainer.scrollLeft;
      const columns = document.querySelectorAll('.editorial-column');
      
      columns.forEach((col) => {
        const rect = col.getBoundingClientRect();
        if (rect.left >= 0 && rect.left < window.innerWidth / 2) {
          setActiveSection(col.id);
        }
      });
    };

    const scrollContainer = document.querySelector('.editorial-scroll-container');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [readingMode]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', inline: 'start' });
    }
  };

  const navItems = [
    { id: 'intro', label: 'Intro' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'blog', label: 'Blog' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="editorial-header">
      <div className="editorial-header-left">
        <div className="editorial-header-name">
          Shivom Sharma
        </div>
        <div className="editorial-header-role">
          Software Engineer
        </div>
      </div>

      {!readingMode && (
        <nav className="editorial-nav">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={activeSection === item.id ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(item.id);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}

      <button 
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? '[ Light ]' : '[ Dark ]'}
      </button>
    </header>
  );
}
