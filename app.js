const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const querystring = require("querystring");
const fs = require("fs").promises;
const path = require("path");
const matter = require("gray-matter");

dotenv.config();

const PUBLIC_SITE_URL = process.env.PUBLIC_SITE_URL || "https://shivom.dev";
const BLOG_DIR = path.join(__dirname, "src", "blog");
const DEFAULT_META = {
  title: "Shivom Sharma Portfolio",
  description: "Portfolio and blog of Shivom Sharma.",
  image: "/images/pfp.jpeg",
  siteName: "Shivom Sharma",
};
const META_BLOCK_REGEX =
  /<!--\s*opencode:meta\s*-->[\s\S]*?<!--\s*\/opencode:meta\s*-->/;

const app = express();
const port = process.env.PORT || 8888;

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
const spotifyConfigured =
  SPOTIFY_CLIENT_ID && SPOTIFY_CLIENT_SECRET && SPOTIFY_REDIRECT_URI;

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
    if (!refreshToken) {
      return false;
    }
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

function normalizeBaseUrl(url) {
  return String(url || "").replace(/\/+$/, "");
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function toAbsoluteUrl(baseUrl, pathOrUrl) {
  if (!pathOrUrl) return "";
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const normalizedPath = pathOrUrl.startsWith("/")
    ? pathOrUrl
    : `/${pathOrUrl}`;
  return `${baseUrl}${normalizedPath}`;
}

function toIsoDate(dateValue) {
  if (!dateValue) return null;
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

async function collectMarkdownFiles(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...(await collectMarkdownFiles(fullPath)));
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        files.push(fullPath);
      }
    }
    return files;
  } catch (error) {
    console.warn("Blog directory not found:", dir);
    return [];
  }
}

let cachedBlogPosts = null;

async function loadBlogPosts() {
  if (cachedBlogPosts) return cachedBlogPosts;
  const files = await collectMarkdownFiles(BLOG_DIR);
  const posts = [];

  for (const filePath of files) {
    try {
      const raw = await fs.readFile(filePath, "utf8");
      const { data } = matter(raw);
      const slug = data.slug || path.basename(filePath, ".md");
      posts.push({
        slug,
        title: data.title || slug,
        description: data.description || "",
        image: data.image || "",
        date: data.date || "",
      });
    } catch (error) {
      console.warn("Failed to parse blog post:", filePath, error.message);
    }
  }

  cachedBlogPosts = posts;
  return posts;
}

async function getBlogPostBySlug(slug) {
  const posts = await loadBlogPosts();
  return posts.find((post) => post.slug === slug) || null;
}

function buildMetaTags({
  title,
  description,
  image,
  url,
  type,
  siteName,
  publishedTime,
}) {
  const tags = [
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:image" content="${escapeHtml(image)}" />`,
    `<meta property="og:url" content="${escapeHtml(url)}" />`,
    `<meta property="og:type" content="${escapeHtml(type)}" />`,
    `<meta property="og:site_name" content="${escapeHtml(siteName)}" />`,
  ];

  if (publishedTime) {
    tags.push(
      `<meta property="article:published_time" content="${escapeHtml(publishedTime)}" />`,
    );
  }

  tags.push(
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(image)}" />`,
  );

  return tags.join("\n");
}

function formatMetaBlock(metaTags) {
  const indentedTags = metaTags
    .split("\n")
    .map((line) => `    ${line}`)
    .join("\n");
  return `    <!-- opencode:meta -->\n${indentedTags}\n    <!-- /opencode:meta -->`;
}

function replaceMetaBlock(html, metaTags) {
  const metaBlock = formatMetaBlock(metaTags);
  if (META_BLOCK_REGEX.test(html)) {
    return html.replace(META_BLOCK_REGEX, metaBlock);
  }
  return html.replace("</head>", `${metaBlock}\n  </head>`);
}

function updateTitle(html, title) {
  const safeTitle = escapeHtml(title);
  if (/<title>[\s\S]*?<\/title>/i.test(html)) {
    return html.replace(
      /<title>[\s\S]*?<\/title>/i,
      `<title>${safeTitle}</title>`,
    );
  }
  return html.replace("</head>", `  <title>${safeTitle}</title>\n</head>`);
}

function buildMetaForPost(post, baseUrl) {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
  const hasPost = Boolean(post);
  const title = hasPost ? post.title : DEFAULT_META.title;
  const description = hasPost && post.description
    ? post.description
    : DEFAULT_META.description;
  const imagePath = hasPost && post.image ? post.image : DEFAULT_META.image;
  const image = toAbsoluteUrl(normalizedBaseUrl, imagePath);
  const url = hasPost
    ? `${normalizedBaseUrl}/blog/${encodeURIComponent(post.slug)}`
    : normalizedBaseUrl;
  const type = hasPost ? "article" : "website";
  const publishedTime = hasPost ? toIsoDate(post.date) : null;

  return {
    pageTitle: hasPost ? `${title} | ${DEFAULT_META.siteName}` : title,
    metaTags: buildMetaTags({
      title,
      description,
      image,
      url,
      type,
      siteName: DEFAULT_META.siteName,
      publishedTime,
    }),
  };
}

// Refresh the access token using stored refresh token
async function refreshAccessToken() {
  if (!spotifyConfigured || !refreshToken) {
    return false;
  }
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
  if (!spotifyConfigured) {
    return res.status(503).send("Spotify is not configured.");
  }
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
  if (!spotifyConfigured) {
    return res.status(503).send("Spotify is not configured.");
  }
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
const isProduction = process.env.NODE_ENV === "production";

// Static for built assets in production only.
if (isProduction) {
  app.use(express.static(distPath));
}
// Static for legacy/public assets (PDF, media) without serving index.html
app.use(express.static(publicPath, { index: false }));

// Blog post route with social meta tags (production only)
app.get("/blog/:slug", async (req, res, next) => {
  if (!isProduction) {
    return next();
  }

  try {
    const { slug } = req.params;
    const post = await getBlogPostBySlug(slug);
    const { metaTags, pageTitle } = buildMetaForPost(post, PUBLIC_SITE_URL);

    const indexFile = path.join(distPath, "index.html");
    let html = await fs.readFile(indexFile, "utf8");
    html = updateTitle(html, pageTitle);
    html = replaceMetaBlock(html, metaTags);

    res.setHeader("Content-Type", "text/html");
    res.status(200).send(html);
  } catch (error) {
    next(error);
  }
});

// Current track endpoint - no user login required
app.get("/current-track", async (req, res) => {
  if (!spotifyConfigured) {
    return res.status(503).json({ error: "Spotify is not configured." });
  }
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
  if (!isProduction) {
    return next();
  }
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
  if (!spotifyConfigured) {
    console.warn(
      "Spotify environment variables missing. /current-track will be unavailable.",
    );
  }
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
