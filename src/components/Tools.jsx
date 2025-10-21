import React from 'react';

export default function Tools() {
    return (
        <section id="tools" style={{ textAlign: 'left', overflow: 'hidden', whiteSpace: 'normal' }}>
            <div className="tools-icons" style={{ display: 'inline-block', transform: 'scale(1)', textDecoration: 'none', marginTop: 20, animation: 'none' }}>
                <h2 style={{ color: '#2390be' }}>Tools</h2>
                <span style={{ textDecoration: 'none', marginRight: 20 }}>
                    <i className="fa fa-python"></i> Python
                </span>
                <span style={{ textDecoration: 'none', marginRight: 20 }}>
                    <i className="fa fa-nodejs"></i> Node.js
                </span>
                <span style={{ textDecoration: 'none', marginRight: 20 }}>
                    <i className="fab fa-golang"></i> Go
                </span>
                <span style={{ textDecoration: 'none', marginRight: 20 }}>
                    <i className="fa fa-c"></i>
                </span>
                <span style={{ textDecoration: 'none', marginRight: 20 }}>
                    <i className="fa fa-c"></i>++
                </span>
                <span style={{ textDecoration: 'none', marginRight: 20 }}>
                    <i className="fa fa-database"></i> SQL
                </span>
            </div>
        </section>
    );
}


