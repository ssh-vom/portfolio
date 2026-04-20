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
        <div className="experience-list">
            {roles.map((role, idx) => {
                const { company, role: roleTitle } = parseTitle(role.title);
                
                return (
                    <div className="experience-item" key={idx}>
                        <div className="experience-header">
                            <span className="experience-company">{company}</span>
                            <span className="experience-date">{role.date}</span>
                        </div>
                        
                        <div className="experience-role">{roleTitle}</div>
                        
                        <p className="experience-description">
                            {role.bullets[0]}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}
