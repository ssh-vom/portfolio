import { useState, useEffect, useCallback } from 'react';

function formatTime(ms) {
    if (!ms && ms !== 0) return '0:00';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function SpotifyNowPlaying() {
    const [track, setTrack] = useState(null);
    const [error, setError] = useState(null);
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
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTrack();
        const interval = setInterval(fetchTrack, 10000);
        return () => clearInterval(interval);
    }, [fetchTrack]);

    const [progress, setProgress] = useState(0);
    
    useEffect(() => {
        if (!track) return;
        setProgress(track.currentTime);
        
        const interval = setInterval(() => {
            setProgress(p => {
                if (p >= track.duration) {
                    fetchTrack();
                    return p;
                }
                return Math.min(p + 1000, track.duration);
            });
        }, 1000);
        
        return () => clearInterval(interval);
    }, [track, fetchTrack]);

    if (loading || error || !track) {
        return null; // Don't show if not playing
    }

    return (
        <div className="spotify-widget">
            {track.albumCover && (
                <div className="spotify-album-art">
                    <img src={track.albumCover} alt={track.album} />
                </div>
            )}
            <div className="spotify-info">
                <div className="spotify-track">{track.name}</div>
                <div className="spotify-artist">{track.artist}</div>
            </div>
        </div>
    );
}
