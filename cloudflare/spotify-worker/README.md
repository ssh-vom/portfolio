# Spotify Worker

Now-playing backend for the portfolio widget. Runs on Cloudflare Workers free
tier with KV-backed Spotify tokens, edge caching, and a daily request cap.

## Why not the Express server on Render?

Render's free tier has an ephemeral filesystem, so `tokens.json` was wiped on
every restart. Spotify **rotates refresh tokens** (each refresh invalidates the
previous one), so a lost `tokens.json` meant the stored token was always
already revoked (`invalid_grant: Refresh token revoked`). KV solves this: the
rotated token is written to KV on every refresh and persists forever.

## Setup (one time)

```sh
npm --prefix cloudflare/spotify-worker install

# create the KV namespace, then paste its id into wrangler.jsonc
cd cloudflare/spotify-worker
npx wrangler kv namespace create SPOTIFY_KV

# set secrets
npx wrangler secret put SPOTIFY_CLIENT_ID
npx wrangler secret put SPOTIFY_CLIENT_SECRET

npm run deploy
```

After deploy, the worker lives at
`https://shivom-portfolio-spotify.shivom-sharma-eng.workers.dev`.

1. Add `<worker-origin>/callback` as a Redirect URI in the
   [Spotify dashboard](https://developer.spotify.com/dashboard).
2. Visit `https://<worker-origin>/init-auth` once to authenticate.

## Request budget

Free tier is **100k requests/day per account, shared** with
`shivom-portfolio-media`. Protections in place:

- `MAX_DAILY_REQUESTS` (default 5000): past the cap, `/current-track` returns
  204 and the widget shows "not playing" instead of burning requests.
- `TRACK_CACHE_TTL` (default 20s): responses are edge-cached, so Spotify API
  calls stay at ~2/min total regardless of visitor count.
- The frontend polls every 30s and pauses when the tab is hidden (~1-2k
  req/day worst case per open tab).

## Endpoints

- `GET /init-auth` — start Spotify OAuth
- `GET /callback?code=...` — exchange code, store refresh token in KV
- `GET /current-track` — `{name, artist, album, albumCover, url, isPlaying, currentTime, duration}` or 404 when idle
