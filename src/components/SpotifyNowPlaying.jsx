import { useState, useEffect, useCallback } from 'react';

export default function SpotifyNowPlaying() {
    const [track, setTrack] = useState(null);
    const [error, setError] = useState('');

    const fetchSpotifyTrack = useCallback(async () => {
        try {
            const res = await fetch('/current-track');
            if (!res.ok) {
                setTrack(null);
                setError('No track data available');
                return;
            }
            const data = await res.json();
            if (data && data.name) {
                setTrack(data);
                setError('');
            } else {
                setTrack(null);
                setError('No track is currently playing');
            }
        } catch (e) {
            setTrack(null);
            setError('Error fetching track data');
        }
    }, []);

    useEffect(() => {
        fetchSpotifyTrack();
        const id = setInterval(fetchSpotifyTrack, 10000);
        return () => clearInterval(id);
    }, [fetchSpotifyTrack]);

    const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    if (error && !track) {
        return (
            <div className="spotify-widget">
                <div className="spotify-header">
                    <i className="fab fa-spotify"></i>
                    Now Playing
                </div>
                <div className="spotify-not-playing">
                    Silence...
                </div>
            </div>
        );
    }

    if (!track) return null;

    const progress = (track.currentTime / track.duration) * 100;

    return (
        <div className="spotify-widget">
            <div className="spotify-header">
                <i className="fab fa-spotify"></i>
                Now Playing
            </div>
            
            <div className="spotify-content">
                <div className="spotify-album-art">
                    <img src={track.albumCover || ''} alt="Album Art" />
                </div>
                
                <div className="spotify-info">
                    <div className="spotify-track">{track.name}</div>
                    <div className="spotify-artist">{track.artist}</div>
                    <div className="spotify-meta">Spotify</div>
                </div>
            </div>

            <div className="spotify-progress">
                <div className="spotify-progress-bar">
                    <div 
                        className="spotify-progress-fill" 
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <div className="spotify-time">
                    <span>{formatTime(track.currentTime)}</span>
                    <span>{formatTime(track.duration)}</span>
                </div>
            </div>
        </div>
    );
}
