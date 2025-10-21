import React from 'react';

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

    const roles = [
        {
            companyLogo: 'https://brand.mcmaster.ca/app/uploads/2024/02/mcmaster-logo-2024-col.jpg',
            title: 'Undergraduate Researcher - High Performance Computing',
            bullets: [
                'Built a Fast Multipole Method solver in C++/CUDA for Laplace/Helmholtz PDEs, achieving 4x compression vs BEM++',
                'Created data visualization and technical reports to present simulation insights to researchers at Waterloo',
                'Mentored fellow undergrad through 10+ code reviews, delivering structured guidance in HPC topics',
            ],
        },
        {
            companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png',
            title: 'Software Engineer Intern at Tesla',
            bullets: [
                'Developed AI agent SDKs in Go/TypeScript, enabling natural language queries across robot and station telemetry',
                'Deployed agent using Docker and Kubernetes, utilizing request affinity for 2X faster in-memory session handling',
                'Optimized RAG pipelines with 500GB+ Confluence and MongoDB ingestion, boosting LLM retrieval accuracy by 40%',
                "Leveraged Go's concurrency model to build an API gateway handling thousands of requests from factory systems",
                'Instituted a part version control system in Python, React, and MongoDB, reducing manufacturing data conflicts by 90%, contributing to $300K in incremental revenue',
            ],
        },
        {
            companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png',
            title: 'Software Engineer Intern at Tesla',
            bullets: [
                'Built a distributed Redis + Celery backend with GraphQL APIs to deliver real-time factory metrics to 2000+ engineers',
                'Refactored SQL Server, PostgreSQL, and MySQL schemas to reduce query latency by 18% in cross-platform services',
                "Accelerated factory layout visualization speed by 20% using graph optimizations with Djikstra's algorithm",
                'Re-engineered ETL pipelines in Airflow and FastAPI, cutting layout load times by 83%',
                'Increased code coverage by 25% via CI/CD integration and implementation of unit and A/B test frameworks',
            ],
        },
        {
            companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png',
            title: 'Controls Software Development Intern',
            bullets: [
                'Delivered a high-speed computer vision pipeline in Python for Cybertruck rotor QC, achieving 98% accuracy at 22ms latency per part saving $242K annually',
                'Integrated C# APIs to automate FTP image logging, collecting 5,000+ daily training samples for model refinement',
                'Collaborated with hardware teams to reduce system costs by $20K per line via joint software/hardware optimization',
                'Programmed PLC logic into Tesla Standard Lirary, cutting robot cycle times by 30% across multiple production lines',
            ],
        },
    ];

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


