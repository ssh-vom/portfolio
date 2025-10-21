import React from 'react';
import roles from '../data/experience.yaml';

function useFadeInOnIntersect(selector) {
    React.useEffect(() => {
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
    useFadeInOnIntersect('.timeline-item, .player-container');

    return (
        <section id="Experience" className="timeline-section">
            <h2 style={{ color: '#2390be', marginBottom: 30 }}>Career History</h2>

            <ul className="timeline-container">
                <div className="vertical-line" />
                {roles.map((role, idx) => (
                    <li className="timeline-item" key={idx} style={{ transitionDelay: `${idx * 90}ms` }}>
                        <div className="timeline-dot"></div>
                        <div className="timeline-card">
                            <div className="timeline-content">
                                <div className="timeline-header">
                                    <img src={role.companyLogo} alt="Company Logo" className="company-logo" />
                                    <strong className="role-title">{role.title}</strong>
                                </div>
                                <ul className="description-list">
                                    {role.bullets.map((b, i) => (<li key={i}>{b}</li>))}
                                </ul>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}


