import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import useTheme from '../hooks/useTheme.js';
import { respond, GREETING, SUGGESTED } from '../data/chatBrain.js';

/* A Claude/GPT-style conversational front-end for the portfolio.
   The "model" is src/data/chatBrain.js — deterministic, offline,
   and fed from the same data the rest of the site renders. */

let uid = 0;
const nextId = () => `m${uid++}`;

function ArrowUpRight() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17L17 7M9 7h8v8" />
        </svg>
    );
}

function SendIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
    );
}

// --- Rich blocks -----------------------------------------------------------

function ProjectCard({ p }) {
    return (
        <a className="cb-proj" href={p.github} target="_blank" rel="noopener noreferrer">
            <img className="cb-proj-thumb" src={p.previewImage} alt="" loading="lazy" />
            <span className="cb-proj-body">
                <span className="cb-proj-name">
                    {p.name}
                    <ArrowUpRight />
                </span>
                <span className="cb-proj-tag">{p.tagline}</span>
                <span className="cb-proj-caps">
                    {p.capabilities.slice(0, 5).map((c) => (
                        <span className="cb-pill" key={c}>{c}</span>
                    ))}
                </span>
            </span>
        </a>
    );
}

function ExperienceCard({ r }) {
    const company = r.title.split(',')[0].trim();
    const role = r.title.slice(r.title.indexOf(',') + 1).trim();
    return (
        <div className="cb-xp">
            <div className="cb-xp-head">
                <span className="cb-xp-co">{company}</span>
                <span className="label">{r.date}</span>
            </div>
            <div className="cb-xp-role">{role}</div>
            {r.bullets?.length > 0 ? (
                <ul className="cb-xp-bullets">
                    {r.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
            ) : (
                <p className="cb-xp-now">Building Call Guard — just getting started.</p>
            )}
        </div>
    );
}

function Blocks({ blocks, onSuggest }) {
    if (!blocks?.length) return null;
    return (
        <div className="cb-blocks">
            {blocks.map((block, i) => {
                if (block.type === 'projects') {
                    return (
                        <div className="cb-proj-grid" key={i}>
                            {block.items.map((p) => <ProjectCard key={p.id} p={p} />)}
                        </div>
                    );
                }
                if (block.type === 'experience') {
                    return (
                        <div className="cb-xp-list" key={i}>
                            {block.items.map((r, j) => <ExperienceCard key={j} r={r} />)}
                        </div>
                    );
                }
                if (block.type === 'posts') {
                    return (
                        <div className="cb-links" key={i}>
                            {block.items.map((post) => (
                                <Link className="cb-link" to={`/blog/${post.slug}`} key={post.slug}>
                                    <span className="cb-link-main">{post.title}</span>
                                    <ArrowUpRight />
                                </Link>
                            ))}
                        </div>
                    );
                }
                if (block.type === 'links') {
                    return (
                        <div className="cb-links" key={i}>
                            {block.items.map((l) => (
                                <a className="cb-link" href={l.href} key={l.label} target="_blank" rel="noopener noreferrer">
                                    <span className="cb-link-main">{l.label}</span>
                                    <span className="cb-link-sub label">{l.sub}</span>
                                    <ArrowUpRight />
                                </a>
                            ))}
                        </div>
                    );
                }
                if (block.type === 'tags') {
                    return (
                        <div className="cb-tags" key={i}>
                            {block.groups.map((g) => (
                                <div className="cb-tag-group" key={g.label}>
                                    <span className="label">{g.label}</span>
                                    <div className="cb-tag-row">
                                        {g.items.map((t) => <span className="cb-pill" key={t}>{t}</span>)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
                }
                if (block.type === 'suggest') {
                    return (
                        <div className="cb-followups" key={i}>
                            {block.items.map((s) => (
                                <button className="cb-chip" key={s} onClick={() => onSuggest(s)}>
                                    {s}
                                </button>
                            ))}
                        </div>
                    );
                }
                return null;
            })}
        </div>
    );
}

// --- Message ---------------------------------------------------------------

function Message({ msg, onSuggest }) {
    if (msg.role === 'user') {
        return (
            <div className="cb-msg cb-msg-user">
                <div className="cb-bubble">{msg.text}</div>
            </div>
        );
    }
    return (
        <div className="cb-msg cb-msg-ai">
            <div className="cb-avatar" aria-hidden="true">S</div>
            <div className="cb-ai-body">
                {msg.text && (
                    <div className="cb-prose">
                        {msg.text.split('\n\n').map((para, i) => <p key={i}>{para}</p>)}
                        {msg.streaming && <span className="cb-caret" />}
                    </div>
                )}
                {msg.streaming && !msg.text && (
                    <div className="cb-typing"><span /><span /><span /></div>
                )}
                {!msg.streaming && <Blocks blocks={msg.blocks} onSuggest={onSuggest} />}
            </div>
        </div>
    );
}

// --- Page ------------------------------------------------------------------

export default function Chat() {
    const [theme, toggleTheme] = useTheme();
    const [messages, setMessages] = useState(() => [
        { id: nextId(), role: 'assistant', text: GREETING.text, blocks: GREETING.blocks, streaming: false },
    ]);
    const [input, setInput] = useState('');
    const [busy, setBusy] = useState(false);
    const scrollRef = useRef(null);
    const inputRef = useRef(null);
    const timers = useRef([]);

    const started = messages.some((m) => m.role === 'user');

    useEffect(() => () => timers.current.forEach(clearTimeout), []);

    useEffect(() => {
        const el = scrollRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    });

    const send = useCallback((raw) => {
        const text = raw.trim();
        if (!text || busy) return;
        setBusy(true);
        setInput('');

        const userMsg = { id: nextId(), role: 'user', text };
        const reply = respond(text);
        const aiId = nextId();

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        setMessages((prev) => [
            ...prev,
            userMsg,
            { id: aiId, role: 'assistant', text: reduced ? reply.text : '', blocks: reply.blocks, streaming: !reduced },
        ]);

        if (reduced) {
            setBusy(false);
            return;
        }

        // Brief "thinking", then stream the answer a few chars at a time.
        const startDelay = 380;
        const full = reply.text;
        let i = 0;

        const tick = () => {
            i = Math.min(full.length, i + (2 + Math.floor(Math.random() * 4)));
            const slice = full.slice(0, i);
            setMessages((prev) =>
                prev.map((m) => (m.id === aiId ? { ...m, text: slice } : m))
            );
            if (i < full.length) {
                timers.current.push(setTimeout(tick, 16 + Math.random() * 22));
            } else {
                setMessages((prev) =>
                    prev.map((m) => (m.id === aiId ? { ...m, streaming: false } : m))
                );
                setBusy(false);
            }
        };
        timers.current.push(setTimeout(tick, startDelay));
    }, [busy]);

    // Deep link: /chat?q=... auto-asks on load (shareable questions).
    const asked = useRef(false);
    useEffect(() => {
        if (asked.current) return;
        const q = new URLSearchParams(window.location.search).get('q');
        if (q) {
            asked.current = true;
            send(q);
        }
    }, [send]);

    const onSubmit = (e) => {
        e.preventDefault();
        send(input);
    };

    const onKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            send(input);
        }
    };

    return (
        <div className="cb-page">
            <header className="cb-header">
                <Link className="cb-brand" to="/">
                    <img src="/images/pfp.jpeg" alt="" className="cb-brand-avatar" />
                    <span>Shivom Sharma</span>
                    <span className="cb-brand-tag label">Assistant</span>
                </Link>
                <div className="cb-header-actions">
                    <Link className="cb-exit label" to="/">Back to site<ArrowUpRight /></Link>
                    <button className="hdr-theme" onClick={toggleTheme} aria-label="Toggle theme">
                        {theme === 'dark' ? '☀' : '☾'}
                    </button>
                </div>
            </header>

            <main className={`cb-main${started ? '' : ' cb-main-intro'}`} ref={scrollRef}>
                <div className="cb-thread">
                    {!started && (
                        <div className="cb-welcome">
                            <span className="status-dot" aria-hidden="true" />
                            <h1 className="cb-welcome-title">
                                Ask me about <span className="accent-word">Shivom</span>.
                            </h1>
                            <p className="cb-welcome-sub">
                                A conversational way through the portfolio — answers come straight from the work,
                                experience, and writing on this site.
                            </p>
                        </div>
                    )}
                    {messages.map((m) => (
                        <Message key={m.id} msg={m} onSuggest={send} />
                    ))}
                </div>
            </main>

            <div className="cb-composer-wrap">
                {!started && (
                    <div className="cb-starters">
                        {SUGGESTED.map((s) => (
                            <button className="cb-chip" key={s} onClick={() => send(s)} disabled={busy}>
                                {s}
                            </button>
                        ))}
                    </div>
                )}
                <form className="cb-composer" onSubmit={onSubmit}>
                    <textarea
                        ref={inputRef}
                        className="cb-input"
                        rows={1}
                        placeholder="Ask about Shivom's work, projects, or stack…"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={onKeyDown}
                        autoFocus
                    />
                    <button className="cb-send" type="submit" disabled={!input.trim() || busy} aria-label="Send">
                        <SendIcon />
                    </button>
                </form>
                <p className="cb-disclaimer label">
                    Offline demo assistant · answers drawn from this site's data
                </p>
            </div>
        </div>
    );
}
