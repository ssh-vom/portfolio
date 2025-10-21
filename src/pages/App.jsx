import React from 'react';
import Header from '../components/Header.jsx';
import About from '../components/About.jsx';
import Tools from '../components/Tools.jsx';
import Timeline from '../components/Timeline.jsx';
import Projects from '../components/Projects.jsx';
import ResumeModal from '../components/ResumeModal.jsx';
import SpotifyNowPlaying from '../components/SpotifyNowPlaying.jsx';
import Footer from '../components/Footer.jsx';

export default function App() {
    const [isResumeOpen, setIsResumeOpen] = React.useState(false);

    return (
        <>
            <Header onOpenResume={() => setIsResumeOpen(true)} />
            <main>
                <About />
                <Tools />
                <Timeline />
                <Projects />
                <ResumeModal open={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
            </main>
            <section id="spotify-info">
                <SpotifyNowPlaying />
            </section>
            <hr className="ascii-divider" />
            <Footer />
        </>
    );
}


