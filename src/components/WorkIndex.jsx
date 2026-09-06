import { Link } from 'react-router-dom';
import setVideoVolume from '../utils/setVideoVolume.js';
import { projects } from '../data/projects.js';
import Reveal from './Reveal.jsx';
import ControllerStudy from './ControllerStudy.jsx';
import './WorkIndex.css';

const notes = {
  bunshin: { category: 'Developer tools', summary: 'A shared memory for coding agents. Local-first files, a review queue, and a CLI that lets learnings outlive a single session.' },
  analyticz: { category: 'Applied AI', summary: 'An exploratory data analyst that writes and runs SQL and Python in isolated environments, with parallel agents for branching investigations.' },
  sniffles: { category: 'Systems & networking', summary: 'See what’s moving across the wire. Live packet capture, protocol dissection, and a native C++ interface for inspecting network traffic.' },
  booxserve: { category: 'Everyday utilities', summary: 'From the command line to e-ink. A lightweight tool that delivers manga and textbooks directly to BOOX tablets.' },
  walls: { category: 'Terminal interfaces', summary: 'A small ritual for a fresh desktop. Browse, preview, and set wallpapers without leaving the terminal.' },
};

function Outbound({ href, children, className = '' }) {
  return <a className={`project-link ${className}`} href={href} target="_blank" rel="noopener noreferrer">{children}<span aria-hidden="true">↗</span></a>;
}

export default function WorkIndex() {
  const [featured, ...collection] = projects;

  return (
    <div className="project-gallery">
      <article className="project-feature">
        <div className="project-feature-intro">
          <span className="label">01 / Featured project</span>
          <span className="label">Hardware meets software</span>
        </div>
        <div className="project-feature-layout">
          <div className="project-feature-copy">
            <h3>{featured.name}</h3>
            <p className="project-feature-deck">More ways<br />to <em>play.</em></p>
            <p className="project-description">A modular, accessible gaming controller. Built from the circuit up, with Raspberry Pi and ESP32 modules that work together over Bluetooth.</p>
            <dl className="project-facts">
              <div><dt>≤25 ms</dt><dd>End-to-end latency</dd></div>
              <div><dt>BLE + USB</dt><dd>Controller interfaces</dd></div>
            </dl>
            <div className="project-feature-links">
              <Outbound href={featured.github}>Explore the source</Outbound>
              <Link to="/blog/open-arcade" className="project-link">Read the dev log <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
          <div className="project-feature-visuals">
          <figure className="project-demo">
            <video ref={setVideoVolume} controls playsInline preload="none" poster="/images/openarcade-demo.jpg" aria-label="OpenArcade controller demonstration">
              <source src="/videos/openarcade.mp4" type="video/mp4" />
            </video>
            <figcaption><span className="project-demo-dot" aria-hidden="true" />OpenArcade, in action<span>Play with sound ↗</span></figcaption>
          </figure>
          </div>
        </div>
        <ControllerStudy />
      </article>

      <div className="project-collection-head">
        <p>A few more things <em>I’ve built.</em></p>
        <span className="label">02 to {String(projects.length).padStart(2, '0')} / The collection</span>
      </div>
      <div className="project-grid">
        {collection.map((project, index) => (
          <Reveal as="article" className={`project-card project-card--${project.id}`} key={project.id}>
            <a className="project-preview" href={project.github} target="_blank" rel="noopener noreferrer" aria-label={`Explore ${project.name} on GitHub`}>
              <img src={project.previewImage} alt={`${project.name}: ${project.tagline}`} loading="lazy" decoding="async" />
              <span className="project-preview-action" aria-hidden="true">View project ↗</span>
            </a>
            <div className="project-card-meta label"><span>{String(index + 2).padStart(2, '0')}</span><span>{notes[project.id].category}</span></div>
            <h3><Outbound href={project.github}>{project.name}</Outbound></h3>
            <p className="project-description">{notes[project.id].summary}</p>
            <ul className="project-stack" aria-label={`${project.name} technologies`}>
              {project.capabilities.slice(0, 3).map((tech) => <li key={tech}>{tech}</li>)}
            </ul>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
