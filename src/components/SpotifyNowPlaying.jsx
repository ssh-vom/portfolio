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
    return <div className="player-container"><p>{error}</p></div>;
  }

  if (!track) return null;

  const progress = (track.currentTime / track.duration) * 100;

  return (
    <div className="player-container" style={{ transform: 'scale(0.9)' }}>
      <h3 id="CurrentlyPlaying" className="player-title" style={{ textAlign: 'left' }}>Currently Playing:</h3>
      <div className="player-header">
        <img id="albumCover" src={track.albumCover || ''} alt="Album Cover" className="album-cover" />
        <div className="track-info">
          <h3 id="trackName" className="track-name">{track.name}</h3>
          <p id="artistName" className="track-artist">{track.artist}</p>
        </div>
      </div>
      <div className="progress-container">
        <div className="progress-bar">
          <div id="progressBarFill" className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="time-display">
          <span id="currentTime">{formatTime(track.currentTime)}</span>
          <span id="totalDuration">{formatTime(track.duration)}</span>
        </div>
      </div>
    </div>
  );
}


