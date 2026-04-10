import { useEffect } from 'react';
import Timeline from '../components/Timeline.jsx';
import Projects from './Projects.jsx';
import Blog from './Blog.jsx';
import SpotifyNowPlaying from '../components/SpotifyNowPlaying.jsx';
import ContactColumn from '../components/ContactColumn.jsx';
import EditorialLayout from '../components/EditorialLayout.jsx';
import Marquee from '../components/Marquee.jsx';

export default function App() {
    useEffect(() => {
        const updateScrollProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            const progressBar = document.getElementById('scroll-progress');
            if (progressBar) {
                progressBar.style.width = scrollPercent + '%';
            }
        };

        window.addEventListener('scroll', updateScrollProgress, { passive: true });
        return () => window.removeEventListener('scroll', updateScrollProgress);
    }, []);

    return (
        <EditorialLayout>
            {/* Scroll Progress */}
            <div id="scroll-progress" className="scroll-progress" style={{ width: '0%' }} />

            {/* Gojo Infinity Hand Sign - Background */}
            <div className="gojo-watermark">
                <img src="/images/gojo_hand.png" alt="" />
            </div>

            {/* Hero */}
            <section className="hero">
                <div className="hero-top">
                    <div className="hero-role-line">
                        Software Engineer & Mechatronics Student
                    </div>
                    <div className="hero-info">
                        <div className="hero-info-item">
                            <span className="hero-info-label">Based In</span>
                            <span className="hero-info-value">Toronto, ON</span>
                        </div>
                        <div className="hero-info-item">
                            <span className="hero-info-label">Education</span>
                            <span className="hero-info-value">McMaster University, May '26</span>
                        </div>
                        <div className="hero-info-item">
                            <span className="hero-info-label">Status</span>
                            <span className="hero-info-value">Seeking New Grad 2026 — SWE</span>
                        </div>
                    </div>
                </div>

                <div className="hero-middle">
                    <div className="hero-photo-wrapper">
                        <img src="/images/pfp.jpeg" alt="Shivom Sharma" className="hero-photo-img" />
                    </div>
                    <h1 className="hero-name">
                        Shivom<br />
                        <span className="hero-name-accent">Sharma</span>.
                    </h1>
                </div>

                <div className="hero-bottom">
                    <div className="hero-links">
                        <a href="https://github.com/ssh-vom" target="_blank" rel="noopener noreferrer">GitHub</a>
                        <a href="https://linkedin.com/in/shivomsharma" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                        <a href="mailto:shivom.sharma.eng@gmail.com">Email</a>
                        <a href="https://drive.google.com/file/d/1dF-L6oKwGsYKAEfJycaFoQokeM7xw6NR/view?usp=drive_link" target="_blank" rel="noopener noreferrer">Resume</a>
                    </div>
                    <div className="hero-status">
                        Building AI agents, distributed systems, and embedded hardware
                    </div>
                </div>
            </section>

            <Marquee />

            <main>
                {/* Experience */}
                <section className="section" id="experience">
                    <Timeline />
                </section>

                {/* Projects */}
                <section className="section" id="projects">
                    <Projects />
                </section>

                {/* Blog */}
                <section className="section" id="blog">
                    <Blog />
                </section>

                {/* Contact */}
                <section className="section" id="contact">
                    <ContactColumn />
                </section>
            </main>

            <SpotifyNowPlaying />
        </EditorialLayout>
    );
}
