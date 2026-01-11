export default function About() {
    return (
        <div className="steam-box" id="about-education">
            <div className="steam-box-title">About Me</div>
            <div className="about-text">
                <p className="about-paragraph">
                    Hello there, my name is <strong>Shivom</strong>. I'm a Mechatronics Engineering & Business Student, working in Software Engineering. I enjoy problem-solving, creating, and doing
                    it through a variety of mediums including programming, <a href="https://instagram.com/6ixspirit" target="_blank" rel="noopener noreferrer" className="about-link">video editing</a>, and many more!
                    Currently open to new opportunities/work prospects!
                </p>

                <div className="steam-box-title about-section-title">Education</div>
                <div className="about-education">
                    <p className="about-education-item"><strong className="about-education-label">Degree:</strong> 4th year Mechatronics Engineering & Business @ McMaster University</p>
                    <p className="about-education-item"><strong className="about-education-label">Expected Graduation:</strong> 2026</p>
                    <p className="about-education-item"><strong className="about-education-label">Courses:</strong> OS, RTOS, DSA, AI/ML, Embedded Systems, Software Development</p>
                </div>
            </div>
        </div>
    );
}
