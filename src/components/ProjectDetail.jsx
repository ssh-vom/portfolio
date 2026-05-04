import { ProjectIcon, DynamicIcon } from './Icons.jsx';

export default function ProjectDetail({ project, index }) {
  return (
    <div className="project-detail">
      <div className="pd-header">
        <div className="pd-icon-wrap">
          <ProjectIcon projectId={project.id} className="pd-project-icon" />
        </div>
        <span className="pd-number">0{index + 1}</span>
      </div>

      <h2 className="pd-title">{project.name}</h2>
      <p className="pd-tagline">{project.tagline}</p>

      <div className="pd-tech-details">
        {project.techDetails.map((td, i) => (
          <div className="pd-tech-row" key={i}>
            <DynamicIcon name={td.icon} className="pd-tech-icon" />
            <span className="pd-tech-label">{td.label}</span>
          </div>
        ))}
      </div>

      <p className="pd-description">{project.description}</p>

      <div className="pd-divider" />

      <div className="pd-section">
        <div className="pd-section-label">Capabilities</div>
        <div className="pd-tags">
          {project.capabilities.map((cap, i) => (
            <span className="pd-tag" key={i}>
              {cap}
            </span>
          ))}
        </div>
      </div>

      <div className="pd-divider" />

      <div className="pd-section">
        <div className="pd-section-label">Focus Areas</div>
        <div className="pd-focus-areas">
          {project.focusAreas.map((fa, i) => (
            <div className="pd-focus-card" key={i}>
              <DynamicIcon name={fa.icon} className="pd-focus-icon" />
              <div className="pd-focus-title">{fa.title}</div>
              <p className="pd-focus-desc">{fa.description}</p>
            </div>
          ))}
        </div>
      </div>

      <a
        href={project.github}
        target="_blank"
        rel="noopener noreferrer"
        className="pd-github-link"
      >
        View on GitHub
        <DynamicIcon name="external" className="pd-github-arrow" />
      </a>
    </div>
  );
}
