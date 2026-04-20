import { useState, useEffect } from 'react';
import MinimalHeader from './MinimalHeader.jsx';

export default function EditorialLayout({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div data-theme={theme}>
      <MinimalHeader theme={theme} toggleTheme={toggleTheme} />
      {children}
    </div>
  );
}
