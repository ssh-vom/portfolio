import React from 'react';
import Header from './Header.jsx';
import Tools from './Tools.jsx';
import SpotifyNowPlaying from './SpotifyNowPlaying.jsx';
import { Link, useNavigate } from 'react-router-dom';

export default function SteamLayout({ children, activeTab, onTabChange, readingMode = false }) {
    const navigate = useNavigate();

    const handleTabClick = (tab) => {
        if (onTabChange) {
            onTabChange(tab);
        } else {
            // If no handler (e.g. from BlogPost), navigate to home with tab param
            navigate(`/?tab=${tab}`);
        }
    };

    if (readingMode) {
        return (
            <div className="steam-container reading-mode-container">
                <div className="steam-content-main">
                    {children}
                </div>
            </div>
        );
    }

    return (
        <div className="steam-container">
            <Header />
            
            <div className="steam-nav">
                {['ALL', 'PROJECTS', 'EXPERIENCE', 'BLOG'].map((tab) => (
                    <div 
                        key={tab}
                        className={`steam-nav-item ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => handleTabClick(tab)}
                    >
                        {tab}
                    </div>
                ))}
            </div>

            <div className="steam-layout">
                <div className="steam-content-main">
                    {children}
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

