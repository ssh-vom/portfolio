const highlights = [
    'Tesla — 3x Intern',
    'AI Agent Platform',
    'Distributed Systems',
    'Python · Go · TypeScript',
    'Kafka · Redis · MongoDB',
    'Kubernetes · Docker',
    'Embedded Systems',
    'C++ · CUDA · Verilog',
    'Computer Vision',
    'PLC · HMI · TIA Portal',
    'Fast Multipole Methods',
    'McMaster University',
    'Graduating May 2026'
];

export default function Marquee() {
    return (
        <div className="marquee">
            <div className="marquee-track">
                {/* First set */}
                {highlights.map((item, index) => (
                    <span key={`a-${index}`} className="marquee-item">
                        {item}
                    </span>
                ))}
                {/* Duplicate for seamless loop */}
                {highlights.map((item, index) => (
                    <span key={`b-${index}`} className="marquee-item">
                        {item}
                    </span>
                ))}
                {/* Third set for extra safety */}
                {highlights.map((item, index) => (
                    <span key={`c-${index}`} className="marquee-item">
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
}
