import { projects } from '../data/projects.js';
import HoverLink from '../components/HoverLink.jsx';

function parseProject(project) {
    // Parse title and tech stack
    const parts = project.title.split(' | ');
    const name = parts[0];
    const techStack = parts[1] ? parts[1].split(', ') : [];
    
    return { 
        name, 
        techStack, 
        description: project.description, 
        github: project.github,
        previewImage: project.previewImage 
    };
}

export default function Projects() {
    return (
        <>
            <div className="column-title">Projects</div>
            
            <div className="project-list">
                {projects.map((project, index) => {
                    const { name, techStack, description, github, previewImage } = parseProject(project);
                    
                    return (
                        <div key={index} className="project-item">
                            <div className="project-header">
                                {previewImage ? (
                                    <HoverLink 
                                        href={github} 
                                        previewImage={previewImage}
                                        className="project-name-link"
                                    >
                                        <span className="project-name">{name}</span>
                                    </HoverLink>
                                ) : (
                                    <span className="project-name">{name}</span>
                                )}
                                <a
                                    href={github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="project-link"
                                >
                                    View →
                                </a>
                            </div>
                            <p className="project-description">{description}</p>
                            <div className="project-tech">
                                {techStack.map((tech, i) => (
                                    <span key={i} className="project-tech-tag">{tech}</span>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
