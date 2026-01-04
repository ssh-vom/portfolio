import React from 'react';

export default function Header() {
    return (
        <div className="steam-header">
            <div className="steam-avatar-container">
                <div className="steam-avatar">
                    <img src="/images/pfp.jpeg" alt="Avatar" style={{ backgroundColor: '#000' }} /> {/* Replace with actual avatar URL */}
                </div>
            </div>

            <div className="steam-profile-info">
                <h1 className="steam-username">Shivom Sharma</h1>

                <div className="steam-location">
                    <img src="https://community.akamai.steamstatic.com/public/images/countryflags/ca.gif" alt="CA" className="steam-flag" />
                    <span>Toronto, Ontario</span>
                    <span style={{ color: '#66c0f4', marginLeft: '10px' }}>● CURRENTLY BUILDING: OpenArcade</span>
                </div>

                <div className="steam-description">
                    Software Engineer
                </div>

                <div style={{ marginTop: '12px' }}>
                    <a href="https://drive.google.com/file/d/1PMs5TTdMTYWLZmehMqSo2x6h27O3yQJP/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="edit-profile-btn">
                        Resume
                    </a>
                </div>
            </div>

            <div className="steam-level-badge">
                <span className="steam-level-value">24</span>
            </div>
        </div>
    );
}
