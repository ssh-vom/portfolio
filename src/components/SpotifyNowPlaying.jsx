import React from 'react';

export default function SpotifyNowPlaying() {
  const [track, setTrack] = React.useState(null);
  const [error, setError] = React.useState('');

  const fetchSpotifyTrack = React.useCallback(async () => {
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

  React.useEffect(() => {
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
        <div className="steam-playing-box">
            <div className="steam-playing-header">Currently Playing</div>
             <div className="steam-playing-status">
                 <i className="fa fa-spotify"></i>
                 Not playing anything...
             </div>
        </div>
    );
  }

  if (!track) return null;

  const progress = (track.currentTime / track.duration) * 100;

  return (
    <div className="steam-playing-box">
      <div className="steam-playing-header">Currently Playing</div>
      <div className="steam-playing-details">
        <img src={track.albumCover || ''} alt="Album Art" className="steam-album-art" />
        <div className="steam-track-info">
          <div className="steam-track-title">{track.name}</div>
          <div className="steam-track-artist">{track.artist}</div>
          <div className="steam-track-meta">
             <i className="fa fa-music"></i> Playing on Spotify
          </div>
        </div>
      </div>

      <div className="steam-track-progress">
          <span className="steam-track-time">{formatTime(track.currentTime)}</span>
          <div className="steam-track-bar">
              <div className="steam-track-bar-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="steam-track-time">{formatTime(track.duration)}</span>
      </div>
    </div>
  );
}
