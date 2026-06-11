import { Link } from 'react-router-dom';
import roles from '../data/experience.yaml';
import SiteHeader from '../components/SiteHeader.jsx';
import WorkIndex from '../components/WorkIndex.jsx';
import Reveal from '../components/Reveal.jsx';
import SpotifyNowPlaying from '../components/SpotifyNowPlaying.jsx';
import useTheme from '../hooks/useTheme.js';
import { getAllPosts } from '../utils/blog.js';

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
  const wordsPerMinute = 200;
  const words = content?.split(/\s+/).length || 0;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes < 1 ? '< 1 min' : `${minutes} min`;
}

function formatDate(date) {
  const d = new Date(date);
  if (isNaN(d)) return String(date);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function parseTitle(title) {
  const idx = title.indexOf(',');
  if (idx === -1) return { company: title.trim(), role: '' };
  return { company: title.slice(0, idx).trim(), role: title.slice(idx + 1).trim() };
}

function endYear(dateStr) {
  const years = dateStr.match(/\d{4}/g) || ['0'];
  return parseInt(years[years.length - 1]);
}

function Hero() {
  return (
    <section className="hero page">
      <div className="hero-kicker hero-reveal" style={{ '--d': '0.12s' }}>
        <span className="label">Software Engineer at Cloaked · Toronto</span>
      </div>

      <h1 className="hero-title hero-reveal" style={{ '--d': '0.22s' }}>
        I build software from the <span className="serif-accent">metal&nbsp;up</span>.
      </h1>

      <p className="hero-sub hero-reveal" style={{ '--d': '0.34s' }}>
        I'm <strong>Shivom Sharma</strong>. Currently at <strong>Cloaked</strong>; before that,
        three internships at <strong>Tesla</strong> — factory robotics, AI tooling, and production
        vision systems. Mechatronics &amp; Business at McMaster, class of 2026.
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
          Scroll
          <ArrowDown />
        </span>
      </div>
    </section>
  );
}

function WorkSection() {
  return (
    <section className="section page" id="work">
      <Reveal className="section-head">
        <h2 className="section-title">
          Selected <span className="serif-accent">work</span>
        </h2>
        <span className="label">01 — Projects</span>
      </Reveal>
      <WorkIndex />
    </section>
  );
}

function ExperienceSection() {
  const sorted = [...roles].sort((a, b) => endYear(b.date) - endYear(a.date));
  return (
    <section className="section page" id="experience">
      <Reveal className="section-head">
        <h2 className="section-title">
          Where I've <span className="serif-accent">been</span>
        </h2>
        <span className="label">02 — Experience</span>
      </Reveal>
      <div className="xp-list">
        {sorted.map((role, i) => {
          const { company, role: roleTitle } = parseTitle(role.title);
          return (
            <Reveal as="article" className="xp-item" key={i} delay={Math.min(i * 0.06, 0.24)}>
              <div className="xp-when">{role.date}</div>
              <div>
                <h3 className="xp-company">{company}</h3>
                <p className="xp-role">{roleTitle}</p>
                {role.bullets?.length > 0 && (
                  <ul className="xp-bullets">
                    {role.bullets.map((b, bi) => (
                      <li key={bi}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

function WritingSection() {
  const posts = getAllPosts();
  if (posts.length === 0) return null;

  return (
    <section className="section page" id="writing">
      <Reveal className="section-head">
        <h2 className="section-title">
          Notes &amp; <span className="serif-accent">writing</span>
        </h2>
        <span className="label">03 — Writing</span>
      </Reveal>
      <div className="posts-list">
        {posts.map((post, i) => (
          <Reveal key={post.slug} delay={Math.min(i * 0.06, 0.24)}>
            <Link to={`/blog/${post.slug}`} className="post-row">
              <span className="post-title">{post.title}</span>
              <span className="post-meta">
                {formatDate(post.date)} · {estimateReadingTime(post.content)}
              </span>
              <span className="post-arrow" aria-hidden="true">
                <ArrowUpRight />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
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
          Let's <span className="serif-accent">talk</span>
        </h2>
        <span className="label">04 — Contact</span>
      </Reveal>

      <Reveal delay={0.08}>
        <p className="contact-lede">
          Based in Toronto. For roles, projects, or anything else — email is fastest:
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

  return (
    <>
      <SiteHeader theme={theme} toggleTheme={toggleTheme} />
      <main>
        <Hero />
        <WorkSection />
        <ExperienceSection />
        <WritingSection />
        <ContactSection />
      </main>
      <SpotifyNowPlaying />
    </>
  );
}
