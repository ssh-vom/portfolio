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
     // Show something even if error/offline to maintain layout? Or hide?
     // Steam usually shows "Last Online" etc.
     // I'll show a "Not Playing" state
    return (
        <div className="steam-playing-box">
            <div className="steam-playing-header">Currently Playing</div>
             <div style={{ color: '#8f98a0', fontSize: '13px' }}>
                 <i className="fa fa-spotify" style={{ marginRight: '8px' }}></i>
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
      <div style={{ display: 'flex', gap: '12px', marginBottom: '10px' }}>
        <img src={track.albumCover || ''} alt="Album Art" style={{ width: '60px', height: '60px', borderRadius: '4px', border: '1px solid #3d4450' }} />
        <div style={{ overflow: 'hidden' }}>
          <div style={{ color: '#fff', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 'bold' }}>{track.name}</div>
          <div style={{ color: '#66c0f4', fontSize: '12px' }}>{track.artist}</div>
          <div style={{ color: '#8f98a0', fontSize: '11px', marginTop: '2px' }}>
             <i className="fa fa-music"></i> Playing on Spotify
          </div>
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#8f98a0' }}>
          <span>{formatTime(track.currentTime)}</span>
          <div style={{ flex: 1, height: '4px', background: '#3d4450', borderRadius: '2px' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: '#c6d4df', borderRadius: '2px' }}></div>
          </div>
          <span>{formatTime(track.duration)}</span>
      </div>
    </div>
  );
}
