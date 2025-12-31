import React from 'react';

export default function Tools() {
    const tools = [
        { name: 'Python', icon: 'fa fa-python3' },
        { name: 'Node.js', icon: 'fa fa-nodejs' },
        { name: 'Go', icon: 'fab fa-golang' }, // Check if fab is correct class for existing css
        { name: 'C', icon: 'fa fa-copyright' }, // Using copyright as C placeholder if fa-c doesn't exist, original was fa-c
        { name: 'C++', icon: 'fa fa-code' }, // Placeholder
        { name: 'SQL', icon: 'fa fa-database' }
    ];

    // Original had fa-c and fa-c++ which might be custom or specific font awesome version.
    // I'll stick to the original classes if possible, but structure them better.
    // The original code: <i className="fa fa-c"></i> and <i className="fa fa-c"></i>++ (literal text)

    return (
        <div className="steam-box">
            <div className="steam-box-title">Tech Badges <span style={{ float: 'right', fontSize: '12px', color: '#66c0f4' }}>{tools.length}</span></div>
            <div className="steam-badge-grid">
                <div className="steam-badge" title="Python">
                    <i className="fab fa-python"></i>
                </div>
                <div className="steam-badge" title="Node.js">
                    <i className="fab fa-node-js"></i>
                </div>
                <div className="steam-badge" title="Go">
                    <i className="fab fa-golang"></i>
                </div>
                <div className="steam-badge" title="C">
                    <span style={{ fontWeight: 'bold', fontSize: '14px' }}>C</span>
                </div>
                <div className="steam-badge" title="C++">
                    <span style={{ fontWeight: 'bold', fontSize: '14px' }}>C++</span>
                </div>
                <div className="steam-badge" title="SQL">
                    <i className="fas fa-database"></i>
                </div>
                <div className="steam-badge" title="React">
                    <i className="fab fa-react"></i>
                </div>
                <div className="steam-badge" title="Git">
                    <i className="fab fa-git-alt"></i>
                </div>
            </div>
        </div>
    );
}
