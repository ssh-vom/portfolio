import { useState, useEffect } from 'react';

export default function SpotifyNowPlaying() {
    const [track, setTrack] = useState(null);

    useEffect(() => {
        let alive = true;
        const fetchTrack = async () => {
            try {
                const response = await fetch('/current-track');
                if (response.status === 404) {
                    if (alive) setTrack(null);
                    return;
                }
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const data = await response.json();
                if (alive) setTrack(data);
            } catch {
                if (alive) setTrack(null);
            }
        };
        fetchTrack();
        const interval = setInterval(fetchTrack, 10000);
        return () => {
            alive = false;
            clearInterval(interval);
        };
    }, []);

    if (!track) return null;

    return (
        <div className="spotify-widget">
            {track.albumCover && (
                <div className="spotify-album-art">
                    <img src={track.albumCover} alt="" />
                </div>
            )}
            <div className="spotify-info">
                <div className="spotify-track">{track.name}</div>
                <div className="spotify-artist">{track.artist}</div>
            </div>
        </div>
    );
}
