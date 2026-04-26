import Timeline from '../components/Timeline.jsx';
import Projects from './Projects.jsx';
import Blog from './Blog.jsx';
import SpotifyNowPlaying from '../components/SpotifyNowPlaying.jsx';
import ContactColumn from '../components/ContactColumn.jsx';
import EditorialLayout from '../components/EditorialLayout.jsx';

export default function App() {
    return (
        <EditorialLayout>
            <div className="portfolio-layout">
                <section className="hero">
                    <div className="hero-kicker">Portfolio / 2026</div>

                    <div className="hero-main">
                        <div className="hero-photo" aria-hidden="true">
                            <img src="/images/pfp.jpeg" alt="" />
                        </div>

                        <div className="hero-copy">
                            <h1 className="hero-name">Shivom Sharma</h1>
                            <p className="hero-description">
                                Software engineer and mechatronics student building agent systems,
                                distributed software, and embedded tools.
                            </p>
                        </div>
                    </div>

                    <div className="hero-meta" aria-label="Current status">
                        <span>New Grad SWE 2026</span>
                        <span>McMaster Mechatronics</span>
                        <span>Agents / Systems / Hardware</span>
                    </div>

                    <div className="hero-links">
                        <a href="https://github.com/ssh-vom" target="_blank" rel="noopener noreferrer">GitHub</a>
                        <a href="https://linkedin.com/in/shivomsharma" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                        <a href="mailto:shivom.sharma.eng@gmail.com">Email</a>
                        <a href="https://drive.google.com/file/d/1dF-L6oKwGsYKAEfJycaFoQokeM7xw6NR/view?usp=drive_link" target="_blank" rel="noopener noreferrer">Resume</a>
                    </div>
                </section>

                <main>
                    <section className="section" id="experience">
                        <div className="section-header">
                            <div className="section-label">Experience</div>
                        </div>
                        <Timeline />
                    </section>

                    <section className="section" id="projects">
                        <div className="section-header">
                            <div className="section-label">Projects</div>
                        </div>
                        <Projects />
                    </section>

                    <section className="section" id="blog">
                        <div className="section-header">
                            <div className="section-label">Writing</div>
                        </div>
                        <Blog />
                    </section>

                    <section className="section" id="contact">
                        <div className="section-header">
                            <div className="section-label">Contact</div>
                        </div>
                        <ContactColumn />
                    </section>
                </main>
            </div>

            <footer className="site-footer">
                <div>© {new Date().getFullYear()} Shivom Sharma</div>
            </footer>

            <SpotifyNowPlaying />
        </EditorialLayout>
    );
}
