import { useEffect, useRef, useState } from 'react';
import setVideoVolume from '../utils/setVideoVolume.js';
import transitionMedia from '../utils/transitionMedia.js';
import { Link, useViewTransitionState } from 'react-router-dom';
import roles from '../data/experience.js';
import SiteHeader from '../components/SiteHeader.jsx';
import SnapMarkers from '../components/SnapMarkers.jsx';
import Flow from '../components/Flow.jsx';
import WorkIndex from '../components/WorkIndex.jsx';
import CreativeGallery from '../components/CreativeGallery.jsx';
import Reveal from '../components/Reveal.jsx';
import SpotifyNowPlaying from '../components/SpotifyNowPlaying.jsx';
import useTheme from '../hooks/useTheme.js';
import useSectionTone from '../hooks/useSectionTone.js';
import { getAllPosts, formatDate } from '../utils/blog.js';

const RESUME_URL =
    'https://drive.google.com/file/d/1dF-L6oKwGsYKAEfJycaFoQokeM7xw6NR/view?usp=drive_link';

function ArrowDown() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
    );
}

function ArrowUpRight() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17L17 7M9 7h8v8" />
        </svg>
    );
}

function estimateReadingTime(content) {
    const words = content?.trim().split(/\s+/).length || 0;
    return words < 200 ? '< 1 min' : `${Math.ceil(words / 200)} min`;
}

function parseTitle(title) {
    const idx = title.indexOf(',');
    if (idx === -1) return { company: title.trim(), role: '' };
    return { company: title.slice(0, idx).trim(), role: title.slice(idx + 1).trim() };
}

// "Software Engineer Intern (AI Agents, Robotics)" -> base + team
function splitRole(roleTitle) {
    const m = roleTitle.match(/^(.*?)\s*\((.*)\)\s*$/);
    if (!m) return { base: roleTitle, team: '' };
    return { base: m[1].trim(), team: m[2].trim() };
}

function endYear(dateStr) {
    const years = dateStr.match(/\d{4}/g) || ['0'];
    return parseInt(years[years.length - 1]);
}

function Theatre({ src, title, onClose, opener }) {
    const overlayRef = useRef(null);
    useEffect(() => {
        const onKey = (e) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    return (
        <div ref={overlayRef} className="theatre" onClick={onClose} role="dialog" aria-label={`${title}: theatre mode`}>
            <button className="theatre-close" onClick={onClose} aria-label="Close theatre mode">
                ✕
            </button>
            <div className="theatre-frame" style={{ viewTransitionName: 'theatre-preview' }} onClick={(e) => e.stopPropagation()}>
                <video ref={setVideoVolume} src={src} autoPlay controls playsInline />
            </div>
        </div>
    );
}

const DEMO_VIDEO = '/videos/openarcade.mp4';

function Hero() {
    const stageRef = useRef(null);
    const previewRef = useRef(null);
    const [p, setP] = useState(0);
    const [theatreOpen, setTheatreOpen] = useState(false);

    // Scrub progress: 0 = video is the hero background, 1 = settled theatre frame
    useEffect(() => {
        let raf = 0;
        const update = () => {
            const el = stageRef.current;
            if (!el) return;
            const total = el.offsetHeight - window.innerHeight;
            setP(Math.min(1, Math.max(0, -el.getBoundingClientRect().top / total)));
        };
        const onScroll = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(update);
        };
        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            cancelAnimationFrame(raf);
        };
    }, []);

    const inTheatre = p > 0.6;

    return (
        <section className="hero-stage" ref={stageRef} style={{ '--p': p }}>
            <div className="hero-sticky">
                <div
                    className={`hero-frame ${inTheatre ? 'is-theatre' : ''}`}
                    ref={previewRef}
                    style={{ viewTransitionName: theatreOpen ? 'none' : 'theatre-preview' }}
                    onClick={() => inTheatre && transitionMedia(() => setTheatreOpen(true))}
                    role={inTheatre ? 'button' : undefined}
                    aria-label={inTheatre ? 'Play OpenArcade demo with sound' : undefined}
                    tabIndex={inTheatre ? 0 : undefined}
                    onKeyDown={(event) => {
                        if (inTheatre && (event.key === 'Enter' || event.key === ' ')) {
                            event.preventDefault();
                            transitionMedia(() => setTheatreOpen(true));
                        }
                    }}
                >
                    <video src={DEMO_VIDEO + "#t=15"} autoPlay muted loop playsInline />
                    <div className="hero-frame-scrim" />
                </div>

                <div className={`hero-copy page ${p > 0.3 ? 'is-faded' : ''}`}>
                    <div className="hero-kicker hero-reveal" style={{ '--d': '0.12s' }}>
                        <span className="label">Software Engineer at Cloaked · Toronto</span>
                    </div>

                    <h1 className="hero-title hero-reveal" style={{ '--d': '0.22s' }}>
                        I build software from the <span className="accent-word">metal&nbsp;up</span>.
                    </h1>

                    <p className="hero-sub hero-reveal" style={{ '--d': '0.34s' }}>
                        I'm <strong>Shivom Sharma</strong>, a software engineer at <strong>Cloaked</strong>.
                        Previously, I worked on factory robotics, AI tooling, and production vision systems
                        across three internships at <strong>Tesla</strong>. Mechatronics &amp; Business at
                        McMaster, class of 2026.
                    </p>

                    <div className="hero-actions hero-reveal" style={{ '--d': '0.42s' }}>
                        <a href="#work" className="btn btn-primary">
                            Selected work
                            <ArrowDown />
                        </a>
                        <a href={RESUME_URL} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                            Résumé
                            <ArrowUpRight />
                        </a>
                    </div>

                    <div className="hero-foot hero-reveal" style={{ '--d': '0.52s' }}>
                        <span className="hero-scroll-hint label">
                            Explore the work
                            <ArrowDown />
                        </span>
                        <span className="label">Software · Systems · Craft</span>
                    </div>
                </div>

                <span className="hero-theatre-caption label">OpenArcade · Click for sound</span>
            </div>

            {theatreOpen && (
                <Theatre src={DEMO_VIDEO} title="OpenArcade demo" opener={previewRef.current} onClose={() => transitionMedia(() => setTheatreOpen(false))} />
            )}
        </section>
    );
}

function WorkSection() {
    return (
        <section className="section page" id="work">
            <Reveal className="section-head">
                <h2 className="section-title">
                    Selected <span className="accent-word">work</span>
                </h2>
                <span className="label">01 / Projects</span>
            </Reveal>
            <WorkIndex />
        </section>
    );
}

const COMPANY_LOGOS = {
    Cloaked: '/images/logo_cloaked.png',
    Tesla: '/images/logo_tesla.png',
};

function ExperienceSection() {
    const sorted = [...roles].sort((a, b) => endYear(b.date) - endYear(a.date));
    const stageRef = useRef(null);
    const slideRefs = useRef([]);
    const counterRef = useRef(null);
    const fillRef = useRef(null);
    const [reduced] = useState(
        () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );

    // Theatre dolly: each role zooms in from a blurred distance, lands
    // sharp at center focus, then scales past the camera and dissolves.
    useEffect(() => {
        if (reduced) return;
        const stage = stageRef.current;
        if (!stage) return;
        const n = sorted.length;
        let raf = 0;

        const update = () => {
            raf = 0;
            const total = stage.offsetHeight - window.innerHeight;
            const p = Math.min(1, Math.max(0, -stage.getBoundingClientRect().top / total));
            const prog = p * (n - 1);

            slideRefs.current.forEach((el, i) => {
                if (!el) return;
                const s = el.style;
                const d = i - prog;
                const ad = Math.abs(d);
                const vis = ad > 0.95 ? 'hidden' : '';
                if (s.visibility !== vis) s.visibility = vis;
                if (vis) return;
                // Eased: dwell at focus, hand off quickly between slides
                const e = Math.sign(d) * Math.pow(Math.min(ad, 1), 1.4);
                const ae = Math.abs(e);
                // translateZ(0) keeps each slide on its own GPU layer.
                const transform =
                    `translate(-50%, -50%) translateY(${(e * 16).toFixed(2)}svh) ` +
                    `scale(${(1 - ae * 0.04).toFixed(4)}) translateZ(0)`;
                if (s.transform !== transform) s.transform = transform;
                // Blur is the costly part on Windows GPUs: lighter radius,
                // quantized to 0.5px so the compositor reuses rasters between
                // frames instead of re-blurring every one.
                const blur = (Math.round(ae * 4 * 2) / 2).toFixed(1);
                const filter = blur === '0.0' ? 'none' : `blur(${blur}px)`;
                if (s.filter !== filter) s.filter = filter;
                const opacity = Math.max(0, 1 - ae * 1.2).toFixed(3);
                if (s.opacity !== opacity) s.opacity = opacity;
                const z = String(20 - Math.round(ae * 10));
                if (s.zIndex !== z) s.zIndex = z;
                const pe = ad < 0.5 ? '' : 'none';
                if (s.pointerEvents !== pe) s.pointerEvents = pe;
            });

            if (counterRef.current) {
                counterRef.current.textContent = String(Math.round(prog) + 1).padStart(2, '0');
            }
            if (fillRef.current) {
                fillRef.current.style.transform = `scaleX(${(prog / (n - 1)).toFixed(4)})`;
            }
        };

        const onScroll = () => {
            if (!raf) raf = requestAnimationFrame(update);
        };
        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            cancelAnimationFrame(raf);
        };
    }, [reduced, sorted.length]);

    const panel = (role, i) => {
        const { company, role: roleTitle } = parseTitle(role.title);
        const { base, team } = splitRole(roleTitle);
        const logo = COMPANY_LOGOS[role.company];
        return (
            <article className="xp-spread">
                <div className="xp-spread-head">
                    <div className="xp-eyebrow">
                        {logo && <img className="xp-logo" src={logo} alt="" />}
                        <span className="xp-eyebrow-company">{company}</span>
                    </div>
                    <h3 className="xp-focus">{team || base}</h3>
                    {team && <p className="xp-role">{base}</p>}
                    <span className="xp-when label">{role.date}</span>
                </div>
                <div className="xp-spread-main">
                    {role.bullets?.length > 0 ? (
                        <ul className="xp-bullets">
                            {role.bullets.map((b, bi) => (
                                <li key={bi}>{b}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="xp-now">Building Call Guard. Just getting started.</p>
                    )}
                </div>
            </article>
        );
    };

    return (
        <section className="section page" id="experience">
            <Reveal className="section-head">
                <h2 className="section-title">
                    Where I've <span className="accent-word">been</span>
                </h2>
                <span className="label">02 / Experience</span>
            </Reveal>
            {reduced ? (
                <div className="xp-static">
                    {sorted.map((role, i) => (
                        <Reveal key={i}>{panel(role, i)}</Reveal>
                    ))}
                </div>
            ) : (
                <div
                    className="xp-stage"
                    ref={stageRef}
                    style={{ height: `calc(100svh + ${(sorted.length - 1) * 70}svh)` }}
                >
                    <SnapMarkers count={sorted.length} />
                    <div className="xp-stage-sticky">
                        {sorted.map((role, i) => (
                            <div className="xp-slide" key={i} ref={(el) => (slideRefs.current[i] = el)}>
                                {panel(role, i)}
                            </div>
                        ))}
                        <div className="work-stage-foot">
                            <span className="label">
                                <span ref={counterRef}>01</span> / {String(sorted.length).padStart(2, '0')}
                            </span>
                            <div className="work-progress" aria-hidden="true">
                                <span className="work-progress-fill" ref={fillRef} />
                            </div>
                            <span className="label">Scroll</span>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

function NotebookEntry({ post, index }) {
    const href = `/blog/${post.slug}`;
    // Only the entry being navigated to may carry the shared
    // view-transition name; it must be unique on the page.
    const transitioning = useViewTransitionState(href);

    return (
        <Link to={href} viewTransition className="nb-entry" style={{ '--i': index }}>
            <span className="nb-num label">{String(index + 1).padStart(2, '0')}</span>
            <span
                className="post-title"
                style={{ viewTransitionName: transitioning ? 'post-title' : 'none' }}
            >
                {post.title}
            </span>
            <span className="post-meta">
                {formatDate(post.date)} · {estimateReadingTime(post.content)}
            </span>
            <span className="post-arrow" aria-hidden="true">
                <ArrowUpRight />
            </span>
        </Link>
    );
}

function WritingSection() {
    const posts = getAllPosts();
    const pageRef = useRef(null);

    // Notebook ink: scrub --np with scroll (both directions) so the red
    // margin line draws down the page and entries develop line by line,
    // same scrubbed-progress language as the hero and experience stages.
    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const el = pageRef.current;
        if (!el) return;
        let raf = 0;

        const update = () => {
            raf = 0;
            const top = el.getBoundingClientRect().top;
            const vh = window.innerHeight;
            const p = Math.min(1, Math.max(0, (vh * 0.92 - top) / (vh * 0.55)));
            el.style.setProperty('--np', p.toFixed(4));
        };
        const onScroll = () => {
            if (!raf) raf = requestAnimationFrame(update);
        };
        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            cancelAnimationFrame(raf);
        };
    }, [posts.length]);

    if (posts.length === 0) return null;

    return (
        <section className="section page" id="writing">
            <Reveal className="section-head">
                <h2 className="section-title">
                    Notes &amp; <span className="accent-word">writing</span>
                </h2>
                <span className="label">03 / Writing</span>
            </Reveal>
            <Reveal delay={0.08} className="notebook-fill">
                <div className="notebook-page" ref={pageRef} style={{ '--n': posts.length }}>
                    {posts.map((post, i) => (
                        <NotebookEntry post={post} index={i} key={post.slug} />
                    ))}
                    <div className="nb-blanks" aria-hidden="true">
                        <span className="nb-caret" />
                    </div>
                </div>
            </Reveal>
        </section>
    );
}

function ContactSection() {
    const links = [
        { label: 'GitHub', href: 'https://github.com/ssh-vom' },
        { label: 'LinkedIn', href: 'https://linkedin.com/in/shivomsharma' },
        { label: 'Résumé', href: RESUME_URL },
    ];

    return (
        <section className="section page contact" id="contact">
            <Reveal className="section-head">
                <h2 className="section-title">
                    Let's <span className="accent-word">talk</span>
                </h2>
                <span className="label">04 / Contact</span>
            </Reveal>

            <Reveal delay={0.08}>
                <p className="contact-lede">
                    Based in Toronto. Have a role, a project, or a question in mind? Send me an email.
                </p>
                <a href="mailto:shivom.sharma.eng@gmail.com" className="contact-email">
                    shivom.sharma.eng@gmail.com
                </a>
            </Reveal>

            <Reveal className="contact-links" delay={0.16}>
                {links.map((link) => (
                    <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-link"
                    >
                        {link.label}
                        <ArrowUpRight />
                    </a>
                ))}
            </Reveal>

            <footer className="foot">
                <span className="label">© {new Date().getFullYear()} Shivom Sharma</span>
                <span className="label">Toronto, ON · Canadian Citizen</span>
            </footer>
        </section>
    );
}

export default function App() {
    const [theme, toggleTheme] = useTheme();

    useSectionTone(theme);

    return (
        <>
            <Flow theme={theme} />
            <SiteHeader theme={theme} toggleTheme={toggleTheme} />
            <main>
                <Hero />
                <WorkSection />
                <ExperienceSection />
                <CreativeGallery />
                <WritingSection />
                <ContactSection />
            </main>
            <SpotifyNowPlaying />
        </>
    );
}
