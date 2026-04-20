import Timeline from '../components/Timeline.jsx';
import Projects from './Projects.jsx';
import Blog from './Blog.jsx';
import SpotifyNowPlaying from '../components/SpotifyNowPlaying.jsx';
import ContactColumn from '../components/ContactColumn.jsx';
import EditorialLayout from '../components/EditorialLayout.jsx';

export default function App() {
    return (
        <EditorialLayout>
            {/* Hero - Card Based */}
            <section className="hero-card">
                <div className="hero-content">
                    <div className="hero-top">
                        <div className="hero-photo">
                            <img src="/images/pfp.jpeg" alt="Shivom Sharma" />
                        </div>
                        <div>
                            <h1 className="hero-name">Shivom Sharma</h1>
                            <div className="hero-role">Software Engineer & Mechatronics</div>
                        </div>
                    </div>
                    
                    <p className="hero-description">
                        Building AI agents, distributed systems, and embedded hardware. 
                        Mechatronics student at McMaster University, graduating May '26.
                        Seeking New Grad 2026 SWE roles.
                    </p>
                    
                    <div className="hero-links">
                        <a href="https://github.com/ssh-vom" target="_blank" rel="noopener noreferrer">GitHub →</a>
                        <a href="https://linkedin.com/in/shivomsharma" target="_blank" rel="noopener noreferrer">LinkedIn →</a>
                        <a href="mailto:shivom.sharma.eng@gmail.com">Email →</a>
                        <a href="https://drive.google.com/file/d/1dF-L6oKwGsYKAEfJycaFoQokeM7xw6NR/view?usp=drive_link" target="_blank" rel="noopener noreferrer">Resume →</a>
                    </div>
                </div>
            </section>

            <main>
                {/* Experience - List Layout */}
                <section className="section" id="experience">
                    <div className="section-header">
                        <div className="section-label">Experience</div>
                    </div>
                    <Timeline />
                </section>

                {/* Projects - List Layout */}
                <section className="section" id="projects">
                    <div className="section-header">
                        <div className="section-label">Projects</div>
                    </div>
                    <Projects />
                </section>

                {/* Blog - List Layout */}
                <section className="section" id="blog">
                    <div className="section-header">
                        <div className="section-label">Blog</div>
                    </div>
                    <Blog />
                </section>

                {/* Contact */}
                <section className="section" id="contact">
                    <div className="section-header">
                        <div className="section-label">Contact</div>
                    </div>
                    <ContactColumn />
                </section>
            </main>

            <footer className="site-footer">
                <div>© 2025 Shivom Sharma — Built with React + Vite</div>
            </footer>

            <SpotifyNowPlaying />
        </EditorialLayout>
    );
}
