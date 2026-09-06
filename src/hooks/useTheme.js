import { useState, useEffect } from 'react';

export default function useTheme() {
  // localStorage wins; else honor the system preference. The inline
  // script in index.html already set data-theme pre-paint, so this
  // initial state matches what the first frame shows.
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('theme');
    // Dark is the default; only an explicit light choice flips it.
    return stored === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    // The pre-paint script set an inline color-scheme; keep it in sync or
    // the first theme's value would win over the [data-theme] CSS rule.
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return [theme, toggleTheme];
}
