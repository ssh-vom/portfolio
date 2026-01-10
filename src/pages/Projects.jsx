import { projects } from '../data/projects.js';

export default function Projects() {
    return (
        <div className="steam-box">
            <div className="steam-box-title">Projects</div>
            <div className="projects-list">
                {projects.map((project, index) => (
                    <div key={index} className="project-card">
                        <div className="project-card-header">
                            <h3 className="project-title">{project.title}</h3>
                            <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="project-link"
                            >
                                GitHub
                            </a>
                        </div>
                        <p className="project-description">{project.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
