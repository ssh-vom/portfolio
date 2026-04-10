import { projects } from '../data/projects.js';

function parseProject(project) {
    const parts = project.title.split(' | ');
    const name = parts[0];
    const techStack = parts[1] ? parts[1].split(', ') : [];

    return {
        name,
        techStack,
        description: project.description,
        github: project.github
    };
}

export default function Projects() {
    return (
        <>
            <div className="section-header">
                <div className="section-label">Projects</div>
                <h2 className="section-title">Selected Work</h2>
            </div>

            <div className="projects-list">
                {projects.slice(0, 6).map((project, index) => {
                    const { name, techStack, github } = parseProject(project);
                    
                    return (
                        <div className="project-row" key={index}>
                            <div className="project-name">{name}</div>
                            <div className="project-tech">
                                {techStack.slice(0, 3).join(' · ')}
                            </div>
                            <a 
                                href={github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="project-link"
                            >
                                View →
                            </a>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
