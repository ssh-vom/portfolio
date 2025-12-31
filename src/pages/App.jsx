import React, { useState } from 'react';
import Header from '../components/Header.jsx';
import About from '../components/About.jsx';
import Tools from '../components/Tools.jsx';
import Timeline from '../components/Timeline.jsx';
import SpotifyNowPlaying from '../components/SpotifyNowPlaying.jsx';
import Blog from './Blog.jsx'; // Import from local directory since App is in pages/
import '../steam-theme.css';

export default function App() {
    const [activeTab, setActiveTab] = useState('ALL');

    const renderContent = () => {
        switch (activeTab) {
            case 'ALL':
                return (
                    <>
                        <About />
                        <Timeline />
                    </>
                );
            case 'PROJECTS':
                return (
                    <div className="steam-box">
                        <div className="steam-box-title">Projects</div>
                        <div style={{ padding: '20px', textAlign: 'center', color: '#8f98a0' }}>
                            Work in Progress...
                        </div>
                    </div>
                );
            case 'EXPERIENCE':
                return <Timeline />;
            case 'BLOG':
                return <Blog />;
            default:
                return <About />;
        }
    };

    return (
        <div className="steam-container">
            <Header />
            
            <div className="steam-nav">
                {['ALL', 'PROJECTS', 'EXPERIENCE', 'BLOG'].map((tab) => (
                    <div 
                        key={tab}
                        className={`steam-nav-item ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </div>
                ))}
            </div>

            <div className="steam-layout">
                <div className="steam-content-main">
                    {renderContent()}
                </div>

                <div className="steam-sidebar">
                    <SpotifyNowPlaying />
                    <Tools />
                    
                    <div className="steam-box">
                        <div className="steam-box-title">Links</div>
                        <div className="steam-link-list">
                            <a href="https://linkedin.com/in/shivomsharma" target="_blank" rel="noreferrer" className="steam-link">
                                <i className="fab fa-linkedin" style={{ width: '20px' }}></i> LinkedIn
                            </a>
                            <a href="https://github.com/ssh-vom" target="_blank" rel="noreferrer" className="steam-link">
                                <i className="fab fa-github" style={{ width: '20px' }}></i> GitHub
                            </a>
                            <a href="mailto:shivom.sharma.eng@gmail.com" className="steam-link">
                                <i className="fas fa-envelope" style={{ width: '20px' }}></i> Email
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '40px', color: '#8f98a0', fontSize: '12px' }}>
                © 2025 Shivom Sharma
            </div>
        </div>
    );
}
