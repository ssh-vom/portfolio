const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const querystring = require("querystring");
const fs = require("fs").promises;
const path = require("path");
// lol

dotenv.config();

const app = express();
const port = process.env.PORT || 8888;

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

// Path to store tokens
const TOKENS_PATH = path.join(__dirname, "tokens.json");

// In-memory token cache
let accessToken = null;
let refreshToken = null;
let tokenExpirationTime = null;

// Load tokens from file if they exist
async function loadTokens() {
  try {
    const data = await fs.readFile(TOKENS_PATH, "utf8");
    const tokens = JSON.parse(data);
    refreshToken = tokens.refreshToken;
    return true;
  } catch (error) {
    console.log("No stored tokens found. Server needs initial authentication.");
    return false;
  }
}

// Save tokens to file
async function saveTokens(tokens) {
  await fs.writeFile(TOKENS_PATH, JSON.stringify(tokens, null, 2));
}

// Refresh the access token using stored refresh token
async function refreshAccessToken() {
  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    accessToken = response.data.access_token;
    // Set expiration time (usually 1 hour) with a small buffer
    tokenExpirationTime = Date.now() + response.data.expires_in * 1000 - 60000;

    // If we got a new refresh token, store it
    if (response.data.refresh_token) {
      refreshToken = response.data.refresh_token;
      await saveTokens({ refreshToken });
    }

    return true;
  } catch (error) {
    console.error("Error refreshing token:", error.response?.data || error);
    return false;
  }
}

// Initial authentication route (only needed once during deployment)
app.get("/init-auth", (req, res) => {
  const scope = "user-read-playback-state user-read-currently-playing";
  const authURL = `https://accounts.spotify.com/authorize?${querystring.stringify(
    {
      response_type: "code",
      client_id: SPOTIFY_CLIENT_ID,
      scope: scope,
      redirect_uri: SPOTIFY_REDIRECT_URI,
    },
  )}`;

  res.redirect(authURL);
});

// Callback to handle initial authentication
app.get("/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('No "code" provided by Spotify.');
  }

  try {
    const tokenResponse = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify({
        code,
        redirect_uri: SPOTIFY_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    accessToken = tokenResponse.data.access_token;
    refreshToken = tokenResponse.data.refresh_token;
    tokenExpirationTime =
      Date.now() + tokenResponse.data.expires_in * 1000 - 60000;

    // Store tokens
    await saveTokens({ refreshToken });

    res.send(
      "Authentication successful! You can now close this window and restart the server.",
    );
  } catch (error) {
    console.error(
      "Error exchanging code for token:",
      error.response?.data || error,
    );
    res.status(500).send("Error during authorization");
  }
});

// Serve built React app if present
const distPath = path.join(__dirname, "dist");
const publicPath = path.join(__dirname, "public");

// Static for built assets first (so /assets/* resolves to built files)
app.use(express.static(distPath));
// Static for legacy/public assets (PDF, media)
app.use(express.static(publicPath));

// Current track endpoint - no user login required
app.get("/current-track", async (req, res) => {
  // Check if token needs refresh
  if (!accessToken || Date.now() >= tokenExpirationTime) {
    const refreshed = await refreshAccessToken();
    if (!refreshed) {
      return res.status(401).json({
        error: "Authorization failed. Server needs to be re-authenticated.",
      });
    }
  }

  try {
    const response = await axios.get(
      "https://api.spotify.com/v1/me/player/currently-playing",
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    if (!response.data || !response.data.item) {
      return res.status(404).json({ message: "No track is currently playing" });
    }

    const track = response.data.item;
    const trackInfo = {
      name: track.name,
      artist: track.artists.map((a) => a.name).join(", "),
      albumCover: track.album.images?.[0]?.url ?? null,
      currentTime: response.data.progress_ms,
      duration: track.duration_ms,
    };

    res.json(trackInfo);
  } catch (error) {
    console.error(
      "Error fetching current track:",
      error.response?.data || error,
    );

    if (error.response?.status === 401) {
      // Token expired, try refreshing one more time
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        return res.redirect("/current-track");
      }
    }

    res.status(500).json({ error: "Error fetching current track" });
  }
});

// SPA fallback to React build index.html if it exists
app.get("*", async (req, res, next) => {
  try {
    const indexFile = path.join(distPath, "index.html");
    await fs.access(indexFile);
    res.sendFile(indexFile);
  } catch (e) {
    next();
  }
});

// Initialize server and start listening
async function initializeServer() {
  const hasTokens = await loadTokens();
  if (hasTokens) {
    // Try to refresh the access token
    const refreshed = await refreshAccessToken();
    if (!refreshed) {
      console.log(
        "Failed to refresh token. Please visit /init-auth to re-authenticate.",
      );
    }
  } else {
    console.log("No tokens found. Please visit /init-auth to authenticate.");
  }

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    if (!hasTokens) {
      console.log(
        `Please visit http://localhost:${port}/init-auth to perform initial authentication`,
      );
    }
  });
}

initializeServer();
