import React from 'react';

export default function About() {
  return (
    <section id="about-education">
      <div id="journalizedProfile" style={{ display: 'none', alignItems: 'center', gap: '2rem', marginBottom: '1.5rem' }}>
        <img
          src="https://via.placeholder.com/120"
          alt="Shivom Sharma photo"
          id="profilePic"
          style={{ borderRadius: '50%', border: '3px solid #22c55e', width: 120, height: 120, objectFit: 'cover' }}
        />
        <div>
          <h2 style={{ marginBottom: '0.5rem' }}>Shivom Sharma</h2>
          <p style={{ marginBottom: '0.5rem' }}>Mechatronics Engineering & | Software Engineer</p>
          <p style={{ fontSize: '0.95em', color: '#888' }}>Open to new opportunities!</p>
        </div>
      </div>
      <h2>About Me</h2>
      <p>
        Hello there, my name is <strong> Shivom </strong>, I'm a Mechatronics Engineering & Business Student and Software Engineer. I enjoy problem-solving, creating, and doing
        it through a variety of mediums including programming, <a href="https://instagram.com/6ixspirit" target="_blank" style={{ textDecoration: 'bold' }}>video editing</a>, and many more!
        Currently open to new opportunities/work prospects!
      </p>
      <h2>Education</h2>
      <p>
        <strong>Degree:</strong> 4th year Mechatronics Engineering & Business @ McMaster University
        <strong> Expected Graduation:</strong> 2026 <br />
        <strong>Relevant Courses:</strong> OS, RTOS, DSA, Applications of Machine Learning, Embedded Systems, Software Development
      </p>
    </section>
  );
}


