import roles from '../data/experience.yaml';

export default function Timeline() {
    return (
        <>
            <div className="column-title">Experience</div>
            
            <div className="timeline">
                {roles.map((role, idx) => (
                    <div 
                        className={`timeline-item ${idx === 0 ? 'active' : ''}`} 
                        key={idx}
                    >
                        <div className="timeline-date">{role.date}</div>
                        <div className="timeline-role">{role.title}</div>
                        <div className="timeline-company">{role.company}</div>
                        <div className="timeline-description">
                            <ul>
                                {role.bullets.map((bullet, i) => (
                                    <li key={i}>{bullet}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
