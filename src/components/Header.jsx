import React from 'react';

export default function Header() {
    return (
        <div className="steam-header">
            <div className="steam-avatar-container">
                <div className="steam-avatar">
                    <img src="/images/pfp.jpeg" alt="Avatar" className="steam-avatar-image" />
                </div>
            </div>

            <div className="steam-profile-info">
                <h1 className="steam-username">Shivom Sharma</h1>

                <div className="steam-location">
                    <img src="https://community.akamai.steamstatic.com/public/images/countryflags/ca.gif" alt="CA" className="steam-flag" />
                    <span>Toronto, Ontario</span>
                    <span className="steam-status">● CURRENTLY BUILDING: OpenArcade</span>
                </div>

                <div className="steam-description">
                    Software Engineer
                </div>

                <div style={{ marginTop: '12px' }}>
                    <a href="https://drive.google.com/file/d/1jtsiATzGVQKmDypHrziT4Cgerhbk4YKJ/view?usp=drive_link" target="_blank" rel="noopener noreferrer" className="edit-profile-btn">
                        Resume
                    </a>
                </div>
            </div>

            <div className="steam-level-badge">
                <span className="steam-level-value">24</span>
            </div>
        </div >
    );
}
