import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import ProjectWorkspace from '../components/ProjectWorkspace.jsx';
import ExperienceTimeline from '../components/ExperienceTimeline.jsx';
import ContactColumn from '../components/ContactColumn.jsx';
import SpotifyNowPlaying from '../components/SpotifyNowPlaying.jsx';
import { getAllPosts } from '../utils/blog.js';

function estimateReadingTime(content) {
  const wordsPerMinute = 200;
  const words = content?.split(/\s+/).length || 0;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes < 1 ? '< 1 min' : `${minutes} min`;
}

function WritingView() {
  const posts = getAllPosts();
  if (posts.length === 0) return null;

  return (
    <div className="view-inner">
      <div className="vw-header">
        <span className="vw-label">Writing</span>
      </div>
      <div className="blog-list">
        {posts.map((post) => (
          <Link
            to={`/blog/${post.slug}`}
            className="blog-item"
            key={post.slug}
          >
            <div className="blog-content">
              <span className="blog-title">{post.title}</span>
              <span className="blog-meta">
                {String(post.date)} · {estimateReadingTime(post.content)}
              </span>
            </div>
            <span className="blog-arrow">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ExperienceView() {
  return (
    <div className="view-inner">
      <div className="vw-header">
        <span className="vw-label">Experience</span>
      </div>
      <ExperienceTimeline inline />
    </div>
  );
}

function ContactView() {
  return (
    <div className="view-inner">
      <div className="vw-header">
        <span className="vw-label">Contact</span>
      </div>
      <ContactColumn />
    </div>
  );
}

function ResumeView() {
  return (
    <div className="view-inner">
      <div className="vw-header">
        <span className="vw-label">Resume</span>
      </div>
      <div className="resume-embed">
        <iframe
          src="https://drive.google.com/file/d/1dF-L6oKwGsYKAEfJycaFoQokeM7xw6NR/preview"
          width="100%"
          height="800"
          allow="autoplay"
          title="Shivom Sharma Resume"
        />
      </div>
      <a
        href="https://drive.google.com/file/d/1dF-L6oKwGsYKAEfJycaFoQokeM7xw6NR/view?usp=drive_link"
        target="_blank"
        rel="noopener noreferrer"
        className="resume-external"
      >
        Open in new tab →
      </a>
    </div>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState('projects');
  const [animState, setAnimState] = useState('entering');
  const [viewKey, setViewKey] = useState(0);

  const handleNavigate = useCallback((section) => {
    if (section === activeSection) return;
    setAnimState('exiting');
    setTimeout(() => {
      setActiveSection(section);
      setViewKey((k) => k + 1);
      setAnimState('entering');
    }, 100);
  }, [activeSection]);

  const renderView = () => {
    switch (activeSection) {
      case 'projects':
        return <ProjectWorkspace />;
      case 'writing':
        return <WritingView />;
      case 'experience':
        return <ExperienceView />;
      case 'contact':
        return <ContactView />;
      case 'resume':
        return <ResumeView />;
      default:
        return <ProjectWorkspace />;
    }
  };

  return (
    <div className="page-root">
      <div className="page-layout">
        <Sidebar
          projectCount={7}
          experienceCount={4}
          activeSection={activeSection}
          onNavigate={handleNavigate}
        />

        <div className={`main-content view-${animState}`} key={viewKey}>
          {renderView()}
        </div>
      </div>

      <SpotifyNowPlaying />
    </div>
  );
}
