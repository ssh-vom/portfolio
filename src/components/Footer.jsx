import React from 'react';

export default function Footer() {
  return (
    <footer>
      <div className="social-media" style={{ transform: 'scale(1.2)', textDecoration: 'none' }}>
        <a href="https://linkedin.com/in/shivomsharma" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
          <i className="fab fa-linkedin"></i>
        </a>
        <a href="https://github.com/RealShivomSharma" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
          <i className="fab fa-github"></i>
        </a>
        <a href="mailto:shars119@mcmaster.ca" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
          <i className="fas fa-envelope"></i>
        </a>
      </div>
      <p>Let me cook!</p>
      <p> 2025 Shivom Sharma </p>
    </footer>
  );
}


