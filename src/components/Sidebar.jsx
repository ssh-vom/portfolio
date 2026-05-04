import { useState, useEffect } from 'react';
import {
  IconFolder,
  IconClock,
  IconUser,
  IconMail,
  IconGitHub,
  IconLinkedIn,
  IconFileText,
  IconMapPin,
  IconArrowUpRight,
} from './Icons.jsx';

export default function Sidebar({ projectCount, experienceCount, activeSection, onNavigate }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const navItems = [
    { id: 'projects', label: 'Projects', count: projectCount, icon: IconFolder },
    { id: 'experience', label: 'Experience', count: experienceCount, icon: IconClock },
    { id: 'writing', label: 'Writing', count: null, icon: IconFileText },
    { id: 'resume', label: 'Resume', count: null, icon: IconFileText },
    { id: 'contact', label: 'Contact', count: null, icon: IconMail },
  ];

  const connectLinks = [
    { label: 'GitHub', href: 'https://github.com/ssh-vom', icon: IconGitHub },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/shivomsharma', icon: IconLinkedIn },
    { label: 'Email', href: 'mailto:shivom.sharma.eng@gmail.com', icon: IconMail },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h1 className="sidebar-name">Shivom Sharma</h1>
        <div className="sidebar-divider" />
      </div>

      <div className="sidebar-bio">
        <p className="sidebar-tagline">
          Software engineer and mechatronics student building agent systems,
          distributed software, and embedded tools.
        </p>
        <p className="sidebar-education">
          Mechatronics Engineering &amp; Business student at McMaster University,
          graduating May 2026.
        </p>
      </div>

      <div className="sidebar-meta">
        <span className="sidebar-meta-item">
          <IconMapPin className="sidebar-meta-icon" />
          Toronto
        </span>
        <span className="sidebar-meta-sep">·</span>
        <span className="sidebar-meta-item">
          <IconUser className="sidebar-meta-icon" />
          Canadian Citizen
        </span>
      </div>

      <div className="sidebar-status">
        <span className="status-dot" />
        <span className="status-text">Seeking New Grad 2026 SWE</span>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Navigation</div>
        <ul className="sidebar-nav-list">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                className={`sidebar-nav-link ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => onNavigate(item.id)}
              >
                <span className="sidebar-nav-link-inner">
                  <item.icon className="sidebar-nav-icon" />
                  <span className="sidebar-nav-label">{item.label}</span>
                </span>
                {item.count !== null && (
                  <span className="sidebar-nav-count">{item.count}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-connect">
        <div className="sidebar-section-label">Connect</div>
        <ul className="sidebar-connect-list">
          {connectLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target={link.href.startsWith('mailto') ? undefined : '_blank'}
                rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                className="sidebar-connect-link"
              >
                <span className="sidebar-connect-inner">
                  <link.icon className="sidebar-connect-icon" />
                  <span className="sidebar-connect-label">{link.label}</span>
                </span>
                <IconArrowUpRight className="sidebar-connect-arrow" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-status-row">
          <span className="status-dot" />
          <span className="sidebar-status-label">Available for New Grad 2026</span>
        </div>
        <button
          className="theme-toggle-sidebar"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </div>
    </aside>
  );
}
