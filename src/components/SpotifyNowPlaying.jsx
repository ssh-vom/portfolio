import { useState, useEffect, useRef, useCallback } from 'react';

// Prod: Cloudflare worker (KV-backed tokens, edge-cached). Dev: Vite proxy to
// the local Express server on :8888 (see vite.config.mjs).
const TRACK_ENDPOINT = 'https://shivom-portfolio-spotify.shivom-sharma-eng.workers.dev/current-track';
const USE_TRACK_ENDPOINT = typeof window !== 'undefined' && !window.location.hostname.startsWith('localhost') && !window.location.hostname.startsWith('127.');

function time(ms) {
    const seconds = Math.floor(Math.max(0, ms || 0) / 1000);
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

const POSITION_KEY = 'spotify-widget-position';

// Keep the widget fully on-screen (approx width; read precise width at drag time).
function clampPosition({ x, y }) {
    const margin = 8;
    const width = Math.min(340, window.innerWidth - 32);
    const height = 200; // rough; enough to keep it reachable
    return {
        x: Math.min(Math.max(margin, x), Math.max(margin, window.innerWidth - width - margin)),
        y: Math.min(Math.max(margin, y), Math.max(margin, window.innerHeight - height - margin)),
    };
}

export default function SpotifyNowPlaying() {
    const [track, setTrack] = useState(null);
    const [status, setStatus] = useState('loading');
    const [collapsed, setCollapsed] = useState(false);
    const [now, setNow] = useState(Date.now());
    const [position, setPosition] = useState(null); // {x, y} in px, null = default CSS spot
    const [dragging, setDragging] = useState(false);
    const dragState = useRef(null);

    // Restore a saved position (clamped into the current viewport).
    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem(POSITION_KEY) || 'null');
            if (saved && typeof saved.x === 'number' && typeof saved.y === 'number') {
                setPosition(clampPosition(saved));
            }
        } catch { /* corrupt or missing -> default spot */ }
    }, []);

    // Keep a saved position on-screen across resizes.
    useEffect(() => {
        if (!position) return;
        const onResize = () => setPosition(p => (p ? clampPosition(p) : p));
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [position !== null]); // eslint-disable-line react-hooks/exhaustive-deps

    const onHeaderPointerDown = useCallback(event => {
        if (event.target.closest('.spotify-toggle')) return; // keep minimize button clickable
        if (event.button !== 0 && event.pointerType === 'mouse') return;
        event.preventDefault();
        const widget = event.currentTarget.closest('.spotify-widget');
        const rect = widget.getBoundingClientRect();
        dragState.current = {
            grabX: event.clientX - rect.left,
            grabY: event.clientY - rect.top,
            pointerId: event.pointerId,
        };
        widget.setPointerCapture(event.pointerId);
        setDragging(true);
    }, []);

    const onHeaderPointerMove = useCallback(event => {
        if (!dragState.current || event.pointerId !== dragState.current.pointerId) return;
        const next = clampPosition({
            x: event.clientX - dragState.current.grabX,
            y: event.clientY - dragState.current.grabY,
        });
        setPosition(prev => (prev ? { ...prev, ...next } : { ...next, first: true }));
    }, []);

    const onHeaderPointerUp = useCallback(event => {
        if (!dragState.current || event.pointerId !== dragState.current.pointerId) return;
        dragState.current = null;
        setDragging(false);
        setPosition(p => {
            if (p) {
                try { localStorage.setItem(POSITION_KEY, JSON.stringify({ x: p.x, y: p.y })); } catch { /* private mode */ }
            }
            return p;
        });
    }, []);


    const POLL_INTERVAL = 30000; // worker-side cache TTL is 20s; poll politely
    useEffect(() => {
        const controller = new AbortController();
        let timer;
        // Requests count against the account-wide Workers free tier, so only
        // poll while the tab is visible.
        const fetchTrack = async () => {
            if (document.hidden) {
                timer = setTimeout(fetchTrack, POLL_INTERVAL);
                return;
            }
            try {
                const response = await fetch(USE_TRACK_ENDPOINT ? TRACK_ENDPOINT : '/current-track', { signal: controller.signal });
                if (response.status === 404 || response.status === 204) {
                    setTrack(null);
                    setStatus('idle');
                } else {
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    const data = await response.json();
                    if (!data.name) throw new Error('Missing track');
                    setTrack({ ...data, receivedAt: Date.now() });
                    setStatus('ready');
                }
            } catch {
                if (!controller.signal.aborted) {
                    setTrack(null);
                    setStatus('unavailable');
                }
            } finally {
                if (!controller.signal.aborted) timer = setTimeout(fetchTrack, POLL_INTERVAL);
            }
        };
        fetchTrack();
        const onVisibility = () => {
            if (!document.hidden) {
                clearTimeout(timer);
                timer = setTimeout(fetchTrack, 0);
            }
        };
        document.addEventListener('visibilitychange', onVisibility);
        return () => {
            controller.abort();
            clearTimeout(timer);
            document.removeEventListener('visibilitychange', onVisibility);
        };
    }, []);

    useEffect(() => {
        if (!track?.isPlaying) return;
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, [track?.isPlaying]);

    const playing = track?.isPlaying === true;
    const elapsed = track ? Math.min(track.duration || 0, (track.currentTime || 0) + (playing ? Math.max(0, now - track.receivedAt) : 0)) : 0;
    const label = track ? (playing ? 'Playing' : 'Paused') : status === 'loading' ? 'Loading…' : status === 'idle' ? 'Not playing' : 'Unavailable';
    const href = track?.url?.startsWith('https://open.spotify.com/') ? track.url : null;

    const widgetStyle = position ? {
        left: `${position.x}px`,
        top: `${position.y}px`,
        bottom: 'auto',
        touchAction: 'none',
        ...(position.first ? { width: 'min(328px, calc(100vw - 32px))', transition: 'none' } : {}),
    } : undefined;

    return (
        <aside
            className={`spotify-widget${collapsed ? ' is-collapsed' : ''}${dragging ? ' is-dragging' : ''}`}
            style={widgetStyle}
            aria-label="Spotify listening activity"
        >
            <div
                className={`spotify-header${position ? ' is-detached' : ''}`}
                onPointerDown={onHeaderPointerDown}
                onPointerMove={onHeaderPointerMove}
                onPointerUp={onHeaderPointerUp}
                onPointerCancel={onHeaderPointerUp}
            >
                <span className="spotify-brand"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="currentColor" /><path d="M5.5 8.5c4-1.2 9-1 13 1M6.5 12c3.5-1 7.5-.7 10.5 1M7.5 15.3c2.8-.7 5.7-.5 8.3.8" fill="none" stroke="var(--surface)" strokeWidth="1.6" strokeLinecap="round" /></svg> Spotify</span>
                <button className="spotify-toggle" onClick={() => setCollapsed(!collapsed)} aria-expanded={!collapsed} aria-controls="spotify-content" aria-label={collapsed ? 'Expand Spotify widget' : 'Minimize Spotify widget'}><span className="spotify-toggle-glyph" aria-hidden="true" /></button>
            </div>
            <div id="spotify-content" className="spotify-content" aria-hidden={collapsed} inert={collapsed ? '' : undefined}>
              <div className="spotify-content-inner">
                <div className="spotify-body" key={track?.url || track?.name || 'quiet'}>
                    <div className="spotify-album-art">
                        <div className="spotify-record" aria-hidden="true"><span /></div>
                        {track?.albumCover && <img key={track.albumCover} src={track.albumCover} alt={track.album ? `${track.album} album cover` : 'Album cover'} onError={event => { event.currentTarget.style.display = 'none'; }} />}
                    </div>
                    <div className="spotify-info">
                        <div className="spotify-eyebrow">{track ? 'Now listening' : 'Spotify'}</div>
                        <div className="spotify-track">{track?.name || 'Nothing playing'}</div>
                        {track?.artist && <div className="spotify-artist">{track.artist}</div>}
                    </div>
                </div>
                {track && <div className="spotify-timeline"><div className="spotify-progress" role="progressbar" aria-label="Track progress" aria-valuemin={0} aria-valuemax={track.duration || 0} aria-valuenow={elapsed}><span key={track.url || track.name} style={{ transform: `scaleX(${track.duration ? elapsed / track.duration : 0})` }} /></div><div className="spotify-times"><span>{time(elapsed)}</span><span>{time(track.duration)}</span></div></div>}
                <div className="spotify-footer">
                    <span className="spotify-status"><span className={`spotify-equalizer${playing ? ' is-playing' : ''}`} aria-hidden="true"><i /><i /><i /><i /></span>{label}</span>
                    {href && <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`Open ${track.name} on Spotify`}>Listen ↗</a>}
                </div>
              </div>
            </div>
        </aside>
    );
}
