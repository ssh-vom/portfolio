import roles from '../data/experience.yaml';

function parseTitle(title) {
    const parts = title.split(',').map(s => s.trim());
    return {
        company: parts[0] || '',
        role: parts[1] || ''
    };
}

export default function Timeline() {
    return (
        <>
            <div className="section-header">
                <div className="section-label">Experience</div>
                <h2 className="section-title">Where I've Worked</h2>
            </div>

            <div className="experience-grid">
                {roles.map((role, idx) => {
                    const { company, role: roleTitle } = parseTitle(role.title);
                    
                    return (
                        <div className="experience-card" key={idx}>
                            <div className="experience-card-header">
                                <h3 className="experience-card-title">{company}</h3>
                            </div>
                            
                            <div className="experience-card-meta">
                                <span className="experience-card-role">{roleTitle}</span>
                            </div>
                            
                            <div className="experience-card-date">{role.date}</div>
                            
                            <ul className="experience-card-bullets">
                                {role.bullets.slice(0, 4).map((bullet, i) => (
                                    <li key={i}>{bullet}</li>
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
