import { useEffect } from 'react';
import roles from '../data/experience.yaml';

function useFadeInOnIntersect(selector) {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) entry.target.classList.add('visible');
                });
            },
            { threshold: 0.1 }
        );

        const nodes = document.querySelectorAll(selector);
        nodes.forEach((n) => observer.observe(n));
        return () => observer.disconnect();
    }, [selector]);
}

export default function Timeline() {
    useFadeInOnIntersect('.timeline-item');

    return (
        <div className="steam-box steam-timeline" id="Experience">
            <div className="steam-box-title">Career Timeline</div>

            <ul className="timeline-container">
                {roles.map((role, idx) => (
                    <li className="timeline-item" key={idx} style={{ transitionDelay: `${idx * 90}ms` }}>
                        <div className="timeline-dot"></div>
                        <div className="timeline-card">
                            <div className="timeline-content">
                                <div className="timeline-header">
                                    {role.companyLogo && <img src={role.companyLogo} alt="Company Logo" className="company-logo" />}
                                    <strong className="role-title">{role.title}</strong>
                                    <span className="timeline-date">{role.date}</span>
                                </div>
                                <div className="timeline-company">{role.company}</div>
                                <ul className="description-list">
                                    {role.bullets.map((b, i) => (<li key={i}>{b}</li>))}
                                </ul>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
