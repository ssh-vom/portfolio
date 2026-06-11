import { useRef } from 'react';
import { projects } from '../data/projects.js';
import Reveal from './Reveal.jsx';

function ArrowLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export default function WorkIndex() {
  const trackRef = useRef(null);

  const scrollByCard = (dir) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector('.work-card');
    const gap = parseFloat(getComputedStyle(track).columnGap) || 20;
    const step = card ? card.offsetWidth + gap : 360;
    track.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  return (
    <Reveal className="work-gallery">
      <div className="work-track" ref={trackRef}>
        {projects.map((project, i) => (
          <a
            className="work-card"
            key={project.id}
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="work-card-media">
              {project.previewVideo ? (
                <iframe
                  src={project.previewVideo}
                  title={project.name}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : project.previewImage ? (
                <img src={project.previewImage} alt={project.name} loading="lazy" />
              ) : (
                <span className="work-card-num">{String(i + 1).padStart(2, '0')}</span>
              )}
            </div>
            <div className="work-card-caption">
              <span className="work-card-name">{project.name}</span>
              <span className="work-card-tagline">{project.tagline}</span>
            </div>
          </a>
        ))}
      </div>

      <div className="work-nav">
        <span className="label">{String(projects.length).padStart(2, '0')} projects</span>
        <div className="work-nav-btns">
          <button className="work-nav-btn" onClick={() => scrollByCard(-1)} aria-label="Previous project">
            <ArrowLeft />
          </button>
          <button className="work-nav-btn" onClick={() => scrollByCard(1)} aria-label="Next project">
            <ArrowRight />
          </button>
        </div>
      </div>
    </Reveal>
  );
}
