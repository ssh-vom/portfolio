import HoverLink from './HoverLink.jsx';

export default function About() {
    return (
        <>
            <h2 className="section-heading">About</h2>

            <div className="about-text">
                <p>
                    I'm a <strong>Software Engineer</strong> and final-year <strong>Mechatronics Engineering & Business</strong> student at 
                    McMaster University. I specialize in building systems that bridge software and hardware — from low-level 
                    embedded firmware to distributed backend infrastructure.
                </p>

                <p>
                    My experience spans <strong>AI/ML orchestration platforms</strong>, <strong>real-time robotics systems</strong>, and 
                    <strong> high-performance computing</strong> (CUDA, Fast Multipole Methods). I've interned at Tesla three times, 
                    working across software engineering, distributed systems, and controls/vision systems.
                </p>

                <p>
                    Beyond engineering, I explore creative outlets like{' '}
                    <HoverLink href="https://instagram.com/6ixspirit" previewImage="/images/video-editing-preview.jpg">
                        video editing
                    </HoverLink> and digital art. I believe the best technical solutions emerge 
                    when rigorous engineering meets creative problem-solving.
                </p>

                <p>
                    Expected graduation: <strong>2026</strong>. Always open to opportunities that challenge me to grow — 
                    whether in systems engineering, full-stack development, or something entirely new.
                </p>
            </div>

            <div className="current-focus">
                <div className="current-focus-label">Currently Building</div>
                <div className="current-focus-text">
                    OpenArcade — Modular, accessible gaming controller with multi-threaded firmware & configurator UI
                </div>
            </div>
        </>
    );
}
