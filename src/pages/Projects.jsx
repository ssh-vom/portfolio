import { projects } from '../data/projects.js';

function parseProject(project) {
    const [rawName, rawTech = ''] = project.title.split('|');
    const name = rawName.trim().replace(/\s+/g, ' ');
    const techStack = rawTech
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

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
                const { name, techStack, description, github } = parseProject(project);
                
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
                            <p className="project-description">{description}</p>
                            <div className="project-tech">
                                {techStack.slice(0, 4).join(' · ')}
                            </div>
                        </div>
                        <span className="project-arrow">→</span>
                    </a>
                );
            })}
        </div>
    );
}
