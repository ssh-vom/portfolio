import { useEffect, useRef, useState } from 'react';
import { projects } from '../data/projects.js';
import Reveal from './Reveal.jsx';
import SnapMarkers from './SnapMarkers.jsx';

const STEP_SVH = 70; // scroll budget per project

export default function WorkIndex() {
  const stageRef = useRef(null);
  const slideRefs = useRef([]);
  const counterRef = useRef(null);
  const fillRef = useRef(null);
  const [reduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // Central-focus swipe: scroll progress through the stage scrubs each
  // project out to the left while the next replaces it from the right.
  // Native scrolling throughout — fast scrolls fly through unhindered.
  useEffect(() => {
    if (reduced) return;
    const stage = stageRef.current;
    if (!stage) return;

    const n = projects.length;
    let raf = 0;

    const update = () => {
      raf = 0;
      const total = stage.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, -stage.getBoundingClientRect().top / total));
      const prog = p * (n - 1);

      slideRefs.current.forEach((el, i) => {
        if (!el) return;
        const d = i - prog;
        if (Math.abs(d) > 1.6) {
          el.style.visibility = 'hidden';
          return;
        }
        el.style.visibility = '';
        const ad = Math.min(1, Math.abs(d));
        el.style.transform =
          `translate(-50%, -50%) translateX(${(d * 112).toFixed(2)}%) ` +
          `rotate(${(d * -2.5).toFixed(2)}deg) scale(${(1 - ad * 0.12).toFixed(3)})`;
        el.style.opacity = (1 - ad * 0.62).toFixed(3);
      });

      if (counterRef.current) {
        counterRef.current.textContent = String(Math.round(prog) + 1).padStart(2, '0');
      }
      if (fillRef.current) {
        fillRef.current.style.transform = `scaleX(${(prog / (n - 1)).toFixed(4)})`;
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  const tile = (project, i) => (
    <a
      className="work-slide-link"
      href={project.github}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="work-piece-media">
        {project.previewImage ? (
          <img src={project.previewImage} alt={project.name} loading="lazy" />
        ) : (
          <span className="work-card-num">{String(i + 1).padStart(2, '0')}</span>
        )}
      </div>
      <div className="work-card-caption">
        <span className="label">{String(i + 1).padStart(2, '0')}</span>
        <span className="work-card-name">{project.name}</span>
        <span className="work-card-tagline">{project.tagline}</span>
      </div>
    </a>
  );

  if (reduced) {
    return (
      <div className="work-flow">
        {projects.map((project, i) => (
          <Reveal as="article" key={project.id}>
            {tile(project, i)}
          </Reveal>
        ))}
      </div>
    );
  }

  return (
    <div
      className="work-stage"
      ref={stageRef}
      style={{ height: `calc(100svh + ${(projects.length - 1) * STEP_SVH}svh)` }}
    >
      <SnapMarkers count={projects.length} />
      <div className="work-stage-sticky">
        {projects.map((project, i) => (
          <div
            className="work-slide"
            key={project.id}
            ref={(el) => (slideRefs.current[i] = el)}
          >
            {tile(project, i)}
          </div>
        ))}
        <div className="work-stage-foot">
          <span className="label">
            <span ref={counterRef}>01</span> / {String(projects.length).padStart(2, '0')}
          </span>
          <div className="work-progress" aria-hidden="true">
            <span className="work-progress-fill" ref={fillRef} />
          </div>
          <span className="label">Scroll</span>
        </div>
      </div>
    </div>
  );
}
