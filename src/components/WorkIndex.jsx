import { useState } from 'react';
import { projects } from '../data/projects.js';
import Reveal from './Reveal.jsx';

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function ArrowUpRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17L17 7M9 7h8v8" />
    </svg>
  );
}

export default function WorkIndex() {
  const [openId, setOpenId] = useState(projects[0]?.id ?? null);

  const toggle = (id) => setOpenId((current) => (current === id ? null : id));

  return (
    <div className="work-list">
      {projects.map((project, i) => {
        const open = openId === project.id;
        return (
          <Reveal
            as="article"
            key={project.id}
            delay={Math.min(i * 0.06, 0.3)}
            className={`work-row ${open ? 'open' : ''}`}
          >
            <button
              className="work-summary"
              onClick={() => toggle(project.id)}
              aria-expanded={open}
              aria-controls={`work-detail-${project.id}`}
            >
              <span className="work-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="work-name">{project.name}</span>
              <span className="work-tagline">{project.tagline}</span>
              <span className="work-chevron" aria-hidden="true">
                <PlusIcon />
              </span>
            </button>

            <div className="work-detail" id={`work-detail-${project.id}`}>
              <div className="work-detail-clip">
                <div className="work-detail-inner">
                  <div>
                    <p className="work-desc">{project.description}</p>
                    <div className="work-focus">
                      {project.focusAreas.map((fa) => (
                        <div className="work-focus-item" key={fa.title}>
                          <span className="work-focus-title">{fa.title}</span>
                          <span className="work-focus-desc">{fa.description}</span>
                        </div>
                      ))}
                    </div>
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="work-cta"
                    >
                      <span className="work-cta-line">View on GitHub</span>
                      <ArrowUpRight />
                    </a>
                  </div>

                  <div className="work-media">
                    {project.previewImage && (
                      <div className="work-shot">
                        <img src={project.previewImage} alt={project.name} loading="lazy" />
                      </div>
                    )}
                    <div className="work-stack">
                      {project.capabilities.map((cap) => (
                        <span className="stack-tag" key={cap}>
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
