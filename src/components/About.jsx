import React from 'react';

export default function About() {
    return (
        <div className="steam-box" id="about-education">
            <div className="steam-box-title">About Me</div>
            <div style={{ color: '#c6d4df', fontSize: '14px', lineHeight: '1.6' }}>
                <p style={{ marginBottom: '15px' }}>
                    Hello there, my name is <strong>Shivom</strong>. I'm a Mechatronics Engineering & Business Student, working in Software Engineering. I enjoy problem-solving, creating, and doing
                    it through a variety of mediums including programming, <a href="https://instagram.com/6ixspirit" target="_blank" rel="noopener noreferrer" style={{ color: '#66c0f4', textDecoration: 'none' }}>video editing</a>, and many more!
                    Currently open to new opportunities/work prospects!
                </p>
                
                <div className="steam-box-title" style={{ marginTop: '20px' }}>Education</div>
                <div style={{ marginTop: '10px' }}>
                    <p style={{ margin: '5px 0' }}><strong style={{ color: '#fff' }}>Degree:</strong> 4th year Mechatronics Engineering & Business @ McMaster University</p>
                    <p style={{ margin: '5px 0' }}><strong style={{ color: '#fff' }}>Expected Graduation:</strong> 2026</p>
                    <p style={{ margin: '5px 0' }}><strong style={{ color: '#fff' }}>Courses:</strong> OS, RTOS, DSA, AI/ML, Embedded Systems, Software Development</p>
                </div>
            </div>
        </div>
    );
}
