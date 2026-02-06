export default function ContactColumn() {
  return (
    <>
      <div className="column-title">Contact</div>
      
      <div className="contact-content">
        <p>
          I'm always interested in hearing about new projects and opportunities. 
          Whether you have a question or just want to say hi, feel free to reach out.
        </p>
      </div>

      <div className="contact-links">
        <a 
          href="mailto:shivom.sharma.eng@gmail.com" 
          className="contact-link"
        >
          <i className="fas fa-envelope"></i>
          <span>shivom.sharma.eng@gmail.com</span>
        </a>
        
        <a 
          href="https://github.com/ssh-vom" 
          target="_blank" 
          rel="noopener noreferrer"
          className="contact-link"
        >
          <i className="fab fa-github"></i>
          <span>github.com/ssh-vom</span>
        </a>
        
        <a 
          href="https://linkedin.com/in/shivomsharma" 
          target="_blank" 
          rel="noopener noreferrer"
          className="contact-link"
        >
          <i className="fab fa-linkedin"></i>
          <span>linkedin.com/in/shivomsharma</span>
        </a>
        
        <a 
          href="https://drive.google.com/file/d/1dF-L6oKwGsYKAEfJycaFoQokeM7xw6NR/view?usp=drive_link" 
          target="_blank" 
          rel="noopener noreferrer"
          className="contact-link"
        >
          <i className="fas fa-file-alt"></i>
          <span>Download Resume</span>
        </a>
      </div>
    </>
  );
}
