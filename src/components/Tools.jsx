import React from 'react';
import { toolBadges } from '../data/toolBadges.js';

export default function Tools() {
    return (
        <div className="steam-box">
            <div className="steam-box-title">
                Tech Badges <span className="badge-count">{toolBadges.length}</span>
            </div>
            <div className="steam-badge-grid">
                {toolBadges.map((tool) => (
                    <div className="steam-badge" title={tool.name} key={tool.name}>
                        {tool.iconClass ? (
                            <i className={tool.iconClass}></i>
                        ) : (
                            <span className="steam-badge-label">{tool.label}</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
