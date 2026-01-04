export default function Projects() {

    const projects = [
        {
            title: "OpenArcade | C,C++,Python,JavaScript",
            description: "An accessible-modular gaming controller, multi-threaded firmware, and a configurator UI application.",
            github: "https://github.com/ssh-vom/openarcade"
        },
        {
            title: "Kalshi Research Engine | Python, Numpy, Pandas, TimescaleDB",
            description: "A research project aimed at determining the accuracy of prediction markets like Kalshi.",
            github: "https://github.com/ssh-vom/kalshi-research"
        },
        {
            title: "BooxServe | Go, Docker, TCP/IP, HTTP",
            description: "A CLI tool to download Manga and Textbooks to Boox E-Ink Tablets.",
            github: "https://github.com/ssh-vom/boox-uploader-cli"
        },
        {
            title: "OpenAI PPO Agent | OpenAI Gym, Pytorch, Numpy",
            description: "Implemented OpenAI's research paper with a simplified neural network for efficient RL training.",
            github: "https://github.com/ssh-vom/openai-ppo-pong"
        },
        {
            title: "Spotify Lyrics Searcher | Python, Genius Lyrics API, Spotify API",
            description: "Developed a fuzzy searcher to get close matches for songs I can't quite remember the lyrics for.",
            github: "https://github.com/ssh-vom/LyricsSearcher"
        },

    ];

    return (
        <div className="steam-box">
            <div className="steam-box-title">Projects</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {projects.map((project, index) => (
                    <div key={index} style={{
                        background: 'rgba(255,255,255,0.03)',
                        padding: '12px',
                        borderRadius: '4px',
                        border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <h3 style={{ color: '#eff0f1', fontSize: '16px', margin: 0 }}>{project.title}</h3>
                            <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    color: '#66c0f4',
                                    textDecoration: 'none',
                                    fontSize: '13px',
                                    padding: '4px 12px',
                                    background: 'rgba(102, 192, 244, 0.1)',
                                    borderRadius: '2px',
                                    border: '1px solid rgba(102, 192, 244, 0.3)'
                                }}
                            >
                                GitHub
                            </a>
                        </div>
                        <p style={{ color: '#c6d4df', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>
                            {project.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
