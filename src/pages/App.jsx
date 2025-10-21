import React from 'react';
import Header from '../components/Header.jsx';
import About from '../components/About.jsx';
import Tools from '../components/Tools.jsx';
import Timeline from '../components/Timeline.jsx';
import Projects from '../components/Projects.jsx';
import SpotifyNowPlaying from '../components/SpotifyNowPlaying.jsx';
import Footer from '../components/Footer.jsx';

export default function App() {
    return (
        <>
            <Header />
            <main>
                <About />
                <Tools />
                <Timeline />
                <Projects />
            </main>
            <section id="spotify-info">
                <SpotifyNowPlaying />
            </section>
            <hr className="ascii-divider" />
            <Footer />
        </>
    );
}


