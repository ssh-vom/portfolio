import { useLayoutEffect, useRef, useState } from 'react';
import setVideoVolume from '../utils/setVideoVolume.js';
import { createPortal, flushSync } from 'react-dom';
import entries from '../data/creative.json';
import Reveal from './Reveal.jsx';
import './CreativeGallery.css';
import transitionMedia from '../utils/transitionMedia.js';

const ORIGIN = 'https://shivom-portfolio-media.shivom-sharma-eng.workers.dev';
const labels = { video: 'Film', audio: 'Sound', image: 'Stills' };
const works = entries.filter(item => item.published === true).sort((a, b) => Number(b.featured) - Number(a.featured));
const mediaUrl = item => ORIGIN + item.path;
const durationLabel = seconds => seconds ? `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}` : '';

function Title({ title }) {
    const words = title.split(' ');
    return <>{words.slice(0, -1).join(' ')}{' '}<span>{words.at(-1)}</span></>;
}

function Viewer({ item, onClose, opener }) {
    const dialog = useRef(null);
    const [failed, setFailed] = useState(false);
    useLayoutEffect(() => {
        const previous = opener;
        const node = dialog.current;
        const overflow = document.body.style.overflow;
        node.showModal();
        document.body.style.overflow = 'hidden';
        return () => {
            node.close();
            document.body.style.overflow = overflow;
            previous?.focus({ preventScroll: true });
        };
    }, []);
    const [title, subtitle] = item.title.split(/\s+—\s+/, 2);
    // Explicit media geometry takes priority over editorial poster crops.
    // Reserve it before loading so the transition target cannot jump.
    const poster = opener?.querySelector('img');
    const aspect = Number.isFinite(item.aspectRatio) && item.aspectRatio > 0
        ? item.aspectRatio
        : poster?.naturalWidth && poster?.naturalHeight
            ? poster.naturalWidth / poster.naturalHeight : 16 / 9;
    return createPortal(
        <dialog ref={dialog} className="creative-viewer" aria-labelledby="creative-viewer-title"
            data-lenis-prevent onCancel={event => { event.preventDefault(); onClose(); }}
            onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
            <div className="creative-viewer-inner">
                <header className="creative-viewer-header">
                    <div><p className="label">{labels[item.type]} / {subtitle || 'Creative archive'}</p>
                        <h2 id="creative-viewer-title" style={{ viewTransitionName: 'media-title' }}>{title}</h2></div>
                    <button className="creative-close" onClick={onClose} aria-label="Close media viewer">✕</button>
                </header>
                <div className={`creative-player creative-player--${item.type}`} style={{ viewTransitionName: 'media-preview', '--media-aspect': aspect }}>
                    {failed ? <p className="creative-error" role="status">This piece is temporarily unavailable. Please try again later.</p>
                        : item.type === 'video' ? <video ref={setVideoVolume} src={mediaUrl(item)} poster={item.poster} controls autoPlay playsInline preload="metadata" onError={() => setFailed(true)} />
                            : item.type === 'audio' ? <><div className="creative-record" aria-hidden="true"><span /></div><audio src={mediaUrl(item)} controls autoPlay preload="metadata" onError={() => setFailed(true)} /></>
                                : <img src={mediaUrl(item)} alt={item.alt || item.title} onError={() => setFailed(true)} />}
                </div>
                <p className="creative-viewer-note">{item.description || 'Made outside the lines.'} <span>ESC to close</span></p>
            </div>
        </dialog>, document.body,
    );
}

export default function CreativeGallery() {
    const [filter, setFilter] = useState('all');
    const [active, setActive] = useState(null);
    const opener = useRef(null);
    const [selectedSlug, setSelectedSlug] = useState(null);
    const types = [...new Set(works.map(item => item.type))];
    const visible = works.filter(item => filter === 'all' || item.type === filter);
    if (!works.length) return null;
    return (
        <section className="section page creative-section" id="creative">
            <Reveal className="section-head">
                <h2 className="section-title"><span className="serif">The Archive.</span></h2>
                <p className="creative-intro">Some of my creative stuff, both finished and unfinished.</p>
            </Reveal>
            <div className="creative-toolbar">
                <span className="label">Creative archive <span className="creative-count">/ {String(works.length).padStart(2, '0')}</span></span>
                <div className="creative-filters" role="group" aria-label="Filter creative work">
                    {['all', ...types].map(type => <button key={type} aria-pressed={filter === type} onClick={() => setFilter(type)}>{type === 'all' ? 'All' : labels[type]}</button>)}
                </div>
            </div>
            <div className="creative-grid">
                {visible.map((item, index) => {
                    const [title, subtitle] = item.title.split(/\s+—\s+/, 2);
                    return <button key={item.slug} className={`creative-tile creative-tile--${item.type}`}
                        style={{ viewTransitionName: !active && selectedSlug === item.slug ? 'media-preview' : 'none' }}
                        onClick={event => {
                            opener.current = event.currentTarget;
                            // React must own both sides of the name handoff. Imperative
                            // styles could survive the first render and duplicate names.
                            flushSync(() => setSelectedSlug(item.slug));
                            transitionMedia(() => setActive(item));
                        }} aria-label={`Open ${item.title}`}>
                        {item.poster || item.type === 'image' ? <img className="creative-poster" src={item.poster || mediaUrl(item)} alt="" loading="lazy" onError={event => { event.currentTarget.style.visibility = 'hidden'; }} /> : <div className="creative-wave" aria-hidden="true">{Array.from({ length: 41 }, (_, i) => <i key={i} style={{ '--bar': `${20 + ((i * 37 + 17) % 75)}%` }} />)}</div>}
                        <span className="creative-scrim" />
                        <span className="creative-tile-top"><span>{String(index + 1).padStart(2, '0')} / {labels[item.type]}</span><span>{durationLabel(item.duration)}</span></span>
                        <span className="creative-tile-title"><strong style={{ viewTransitionName: !active && selectedSlug === item.slug ? 'media-title' : 'none' }}><Title title={title} /></strong>{subtitle && <small>{subtitle}</small>}</span>
                        <span className="creative-tile-bottom"><span>{item.type === 'image' ? 'View still' : 'Press play'}</span><span aria-hidden="true">{item.type === 'image' ? '↗' : '▶'}</span></span>
                    </button>;
                })}
            </div>
            {active && <Viewer key={active.slug} item={active} opener={opener.current} onClose={() => transitionMedia(() => setActive(null))} />}
        </section>
    );
}
