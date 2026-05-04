import { useState, useCallback, useRef, useEffect } from 'react';
import { projects } from '../data/projects.js';
import ProjectDetail from './ProjectDetail.jsx';

export default function ProjectWorkspace() {
  const [selected, setSelected] = useState(0);
  const detailRef = useRef(null);

  const goNext = useCallback(() => {
    setSelected((s) => (s + 1) % projects.length);
  }, []);

  const goPrev = useCallback(() => {
    setSelected((s) => (s - 1 + projects.length) % projects.length);
  }, []);

  // Scroll through projects
  useEffect(() => {
    const el = detailRef.current;
    if (!el) return;

    let cooldown = false;

    const handleWheel = (e) => {
      if (cooldown) return;
      if (e.deltaY > 25) {
        goNext();
        cooldown = true;
        setTimeout(() => (cooldown = false), 350);
      } else if (e.deltaY < -25) {
        goPrev();
        cooldown = true;
        setTimeout(() => (cooldown = false), 350);
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: true });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [goNext, goPrev]);

  return (
    <div className="project-workspace">
      <div className="pw-header">
        <span className="pw-label">Projects</span>
        <div className="pw-arrows">
          <button
            className="pw-arrow"
            onClick={goPrev}
            aria-label="Previous project"
          >
            ←
          </button>
          <button
            className="pw-arrow"
            onClick={goNext}
            aria-label="Next project"
          >
            →
          </button>
        </div>
      </div>

      <div className="pw-body">
        <div className="pw-list-panel">
          <div className="pw-list-header">
            Selected Work ({projects.length})
          </div>
          <div className="pw-list">
            {projects.map((project, i) => (
              <button
                key={project.id}
                className={`pw-list-item ${selected === i ? 'active' : ''}`}
                onClick={() => setSelected(i)}
                aria-pressed={selected === i}
              >
                <span className="pw-num">0{i + 1}</span>
                <span className="pw-name">{project.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="pw-detail-panel" ref={detailRef} key={projects[selected].id}>
          <ProjectDetail project={projects[selected]} index={selected} />
        </div>
      </div>
    </div>
  );
}
