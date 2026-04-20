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
        <div className="projects-list">
            {projects.slice(0, 6).map((project, index) => {
                const { name, techStack, github } = parseProject(project);
                
                return (
                    <a 
                        href={github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-item"
                        key={index}
                    >
                        <div className="project-info">
                            <div className="project-name">{name}</div>
                            <div className="project-tech">
                                {techStack.slice(0, 4).join(' · ')}
                            </div>
                        </div>
                        <span className="project-link">View →</span>
                    </a>
                );
            })}
        </div>
    );
}
