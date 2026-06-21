import { useState, useEffect, useCallback } from 'react';

export default function SpotifyNowPlaying() {
    const [track, setTrack] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchTrack = useCallback(async () => {
        try {
            const response = await fetch('/current-track');
            
            if (response.status === 404) {
                setTrack(null);
                setLoading(false);
                return;
            }
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            setTrack(data);
        } catch {
            setTrack(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTrack();
        const interval = setInterval(fetchTrack, 10000);
        return () => clearInterval(interval);
    }, [fetchTrack]);

    if (loading || !track) {
        return null; // Don't show if not playing
    }

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
