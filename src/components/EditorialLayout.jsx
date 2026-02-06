import { useState, useEffect } from 'react';
import MinimalHeader from './MinimalHeader.jsx';

export default function EditorialLayout({ 
  introColumn,
  aboutColumn,
  experienceColumn,
  projectsColumn,
  blogColumn,
  contactColumn,
  readingMode = false 
}) {
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

  if (readingMode) {
    return (
      <div className="editorial-container" data-theme={theme}>
        <MinimalHeader 
          theme={theme} 
          toggleTheme={toggleTheme}
          readingMode={true}
        />
        <div className="reading-mode-container">
          {introColumn}
        </div>
      </div>
    );
  }

  return (
    <div className="editorial-container" data-theme={theme}>
      <MinimalHeader 
        theme={theme} 
        toggleTheme={toggleTheme}
      />
      
      <div className="editorial-scroll-container">
        {/* Column 1: Intro */}
        <section className="editorial-column column-intro" id="intro">
          {introColumn}
        </section>

        {/* Column 2: About */}
        <section className="editorial-column column-about" id="about">
          {aboutColumn}
        </section>

        {/* Column 3: Experience */}
        <section className="editorial-column column-experience" id="experience">
          {experienceColumn}
        </section>

        {/* Column 4: Projects */}
        <section className="editorial-column column-projects" id="projects">
          {projectsColumn}
        </section>

        {/* Column 5: Blog */}
        <section className="editorial-column column-blog" id="blog">
          {blogColumn}
        </section>

        {/* Column 6: Contact */}
        <section className="editorial-column column-contact" id="contact">
          {contactColumn}
        </section>
      </div>
    </div>
  );
}
