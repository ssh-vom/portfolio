export default function ContactColumn() {
  return (
    <>
      <div className="section-header">
        <div className="section-label">Contact</div>
        <h2 className="section-title">Let's Connect</h2>
      </div>

      <div className="contact-section">
        <div className="contact-left">
          <p className="contact-text">
            I'm a Software Engineer and Mechatronics student graduating May 2026. 
            Always interested in hearing about new opportunities in systems engineering, 
            AI/ML infrastructure, and embedded systems.
          </p>
        </div>

        <div className="contact-links-grid">
          <a href="mailto:shivom.sharma.eng@gmail.com" className="contact-link-card">
            <span className="contact-link-card-label">Email</span>
            <span className="contact-link-card-value">shivom.sharma.eng@gmail.com</span>
          </a>

          <a href="https://github.com/ssh-vom" target="_blank" rel="noopener noreferrer" className="contact-link-card">
            <span className="contact-link-card-label">GitHub</span>
            <span className="contact-link-card-value">github.com/ssh-vom</span>
          </a>

          <a href="https://linkedin.com/in/shivomsharma" target="_blank" rel="noopener noreferrer" className="contact-link-card">
            <span className="contact-link-card-label">LinkedIn</span>
            <span className="contact-link-card-value">linkedin.com/in/shivomsharma</span>
          </a>

          <a href="https://drive.google.com/file/d/1dF-L6oKwGsYKAEfJycaFoQokeM7xw6NR/view?usp=drive_link" target="_blank" rel="noopener noreferrer" className="contact-link-card">
            <span className="contact-link-card-label">Resume</span>
            <span className="contact-link-card-value">Download PDF</span>
          </a>
        </div>
      </div>
    </>
  );
}
