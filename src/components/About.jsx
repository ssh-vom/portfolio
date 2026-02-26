import HoverLink from './HoverLink.jsx';

export default function About() {
    return (
        <>
            <div className="column-title">About</div>

            <div className="about-content">
                <p>
                    Hello, I'm <strong>Shivom</strong> — a Software Engineer and Mechatronics Engineering
                    & Business student at McMaster University. I build things that live at the intersection
                    of software and hardware, with a particular interest in systems programming, embedded
                    systems, and developer tooling.
                </p>

                <p>
                    Beyond code, I explore creative mediums like <HoverLink href="https://instagram.com/6ixspirit" previewImage="/images/video-editing-preview.jpg">video editing</HoverLink> and
                    digital art. I believe the best engineering happens when technical rigor meets creative
                    thinking.
                </p>

                <p>
                    Currently in my final year, expected to graduate in 2026. I'm always open to
                    opportunities that challenge me to grow — whether that's in systems engineering,
                    full-stack development, or something entirely new.
                </p>
            </div>

            <div className="current-focus">
                <div className="current-focus-label">Currently Building</div>
                <div className="current-focus-text">
                    OpenArcade - Modular, Accessible, Video Gaming Controller
                </div>
            </div>
        </>
    );
}
