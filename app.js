// server.js
const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const querystring = require('querystring');

dotenv.config();

const app = express();
const port = 8888;

// Grab from .env
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

// Store tokens in memory (not recommended in production)
let accessToken = null;
let refreshToken = null;

/**
 * Serve all static frontend files (index.html, CSS, audio, etc.)
 * from the "public" folder.
 */
app.use(express.static('public'));

/**
 * Spotify Authorization Flow
 */

// 1) Login endpoint: redirect to Spotify's authorize URL
app.get('/login', (req, res) => {
  const scope = 'user-read-playback-state user-read-currently-playing';
  const authURL = `https://accounts.spotify.com/authorize?${querystring.stringify({
    response_type: 'code',
    client_id: SPOTIFY_CLIENT_ID,
    scope: scope,
    redirect_uri: SPOTIFY_REDIRECT_URI
  })}`;

  res.redirect(authURL);
});

// 2) Callback endpoint: exchange code for access token & refresh token
app.get('/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('No "code" provided by Spotify.');
  }

  try {
    const tokenResponse = await axios.post(
      'https://accounts.spotify.com/api/token',
      querystring.stringify({
        code,
        redirect_uri: SPOTIFY_REDIRECT_URI,
        grant_type: 'authorization_code'
      }),
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    accessToken = tokenResponse.data.access_token;
    refreshToken = tokenResponse.data.refresh_token;

    console.log('Access token:', accessToken);
    console.log('Refresh token:', refreshToken);

    // Redirect the user back to the homepage (or to /current-track)
    res.redirect('/'); // or /current-track if you want to go there directly
  } catch (error) {
    console.error('Error exchanging code for token:', error.response?.data || error);
    res.status(500).send('Error during authorization');
  }
});

// 3) Current track endpoint
app.get('/current-track', async (req, res) => {
  if (!accessToken) {
    // If not authorized yet, instruct user to go to /login
    return res.status(401).json({ error: 'Not Authorized. Please visit /login first.' });
  }

  try {
    const response = await axios.get(
      'https://api.spotify.com/v1/me/player/currently-playing',
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!response.data || !response.data.item) {
      return res.status(404).json({ message: 'No track is currently playing' });
    }

    const track = response.data.item;
    const trackInfo = {
      name: track.name,
      artist: track.artists.map((a) => a.name).join(', '),
      albumCover: track.album.images?.[0]?.url ?? null
    };

    res.json(trackInfo);
  } catch (error) {
    console.error('Error fetching current track:', error.response?.data || error);

    // If token is expired, attempt a refresh
    if (error.response && error.response.status === 401) {
      await refreshAccessToken();
      return res.redirect('/current-track');
    }
    res.status(500).json({ error: 'Error fetching current track' });
  }
});

// 4) Token refresh function
async function refreshAccessToken() {
  if (!refreshToken) {
    console.warn('No refresh token available.');
    return;
  }

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      }),
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    accessToken = response.data.access_token;
    console.log('Refreshed Access Token:', accessToken);
  } catch (error) {
    console.error('Error refreshing access token:', error.response?.data || error);
  }
}

/**
 * Start the server
 */
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

