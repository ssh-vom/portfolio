const skillCategories = [
    {
        title: 'Languages',
        skills: ['C/C++', 'Python', 'Go', 'TypeScript', 'JavaScript', 'Verilog', 'Rust']
    },
    {
        title: 'Backend & Systems',
        skills: ['FastAPI', 'REST APIs', 'GraphQL', 'Kafka', 'Redis', 'Celery', 'WebSockets', 'PLC/HMI']
    },
    {
        title: 'Frontend & UI',
        skills: ['React', 'Svelte', 'Zustand', 'Qt', 'Tailwind', 'CSS/Sass']
    },
    {
        title: 'Data & ML',
        skills: ['PyTorch', 'NumPy', 'Pandas', 'PostgreSQL', 'MongoDB', 'TimescaleDB', 'SQL Server']
    },
    {
        title: 'DevOps & Tools',
        skills: ['Docker', 'Kubernetes', 'GitHub Actions', 'Helm', 'AWS S3', 'Airflow', 'Git']
    },
    {
        title: 'Hardware & Embedded',
        skills: ['FPGA', 'Verilog', 'Quartus', 'Siemens TIA', 'Nios II', 'I2C/UART/SPI', 'SignalTap']
    }
];

export default function SkillsSection() {
    return (
        <>
            <h2 className="section-heading">Technical Skills</h2>
            <div className="skills-grid">
                {skillCategories.map((category) => (
                    <div key={category.title} className="skill-category">
                        <div className="skill-category-title">{category.title}</div>
                        <div className="skill-tags">
                            {category.skills.map((skill) => (
                                <span key={skill} className="skill-tag">{skill}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
