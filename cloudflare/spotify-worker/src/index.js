/**
 * Spotify Now-Playing worker.
 *
 * Endpoints:
 *   GET /init-auth     -> redirect to Spotify consent screen
 *   GET /callback      -> exchange auth code, store refresh token in KV
 *   GET /current-track -> cached currently-playing payload (20s edge cache)
 *
 * Budget protection:
 *   - Daily request counter in KV with MAX_DAILY_REQUESTS cap; past the cap the
 *     /current-track endpoint returns 204 so the widget shows "not playing".
 *   - Track responses are edge-cached, so Spotify API calls stay at ~2/min total
 *     regardless of visitor count.
 *   - Refresh tokens rotate on every refresh; the fresh one is written back to
 *     KV immediately, so persistence is automatic.
 *
 * Redirect URI is derived from the request origin, so no configuration is
 * needed beyond adding `<origin>/callback` in the Spotify dashboard.
 */

const SPOTIFY_ACCOUNTS = "https://accounts.spotify.com";
const SPOTIFY_API = "https://api.spotify.com/v1";
const SCOPES = "user-read-playback-state user-read-currently-playing";

const KV_REFRESH_TOKEN = "refresh_token";
const KV_ACCESS_TOKEN = "access_token";
const KV_ACCESS_TOKEN_EXP = "access_token_expires_at";
const KV_REQ_PREFIX = "req_count:";

const jsonHeaders = { "content-type": "application/json; charset=utf-8" };

function todayKey() {
  return KV_REQ_PREFIX + new Date().toISOString().slice(0, 10);
}

async function recordRequest(env) {
  const key = todayKey();
  const count = parseInt((await env.SPOTIFY_KV.get(key)) || "0", 10);
  if (count >= parseInt(env.MAX_DAILY_REQUESTS || "5000", 10)) return false;
  // ttl 90000s (~25h) keeps the counter key from lingering.
  await env.SPOTIFY_KV.put(key, String(count + 1), { expirationTtl: 90000 });
  return true;
}

async function getAccessToken(env) {
  const cached = await env.SPOTIFY_KV.get(KV_ACCESS_TOKEN);
  const expiresAt = parseInt(
    (await env.SPOTIFY_KV.get(KV_ACCESS_TOKEN_EXP)) || "0",
    10,
  );
  if (cached && Date.now() < expiresAt) return cached;

  const refreshToken = await env.SPOTIFY_KV.get(KV_REFRESH_TOKEN);
  if (!refreshToken) return null;

  const response = await fetch(`${SPOTIFY_ACCOUNTS}/api/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });
  if (!response.ok) {
    console.error("Token refresh failed:", response.status);
    return null;
  }
  const data = await response.json();
  const puts = [
    env.SPOTIFY_KV.put(KV_ACCESS_TOKEN, data.access_token),
    env.SPOTIFY_KV.put(
      KV_ACCESS_TOKEN_EXP,
      String(Date.now() + data.expires_in * 1000 - 60000),
    ),
  ];
  // Spotify rotates refresh tokens; persist the new one immediately.
  if (data.refresh_token) {
    puts.push(env.SPOTIFY_KV.put(KV_REFRESH_TOKEN, data.refresh_token));
  }
  await Promise.all(puts);
  return data.access_token;
}

async function handleCallback(request, env) {
  const code = new URL(request.url).searchParams.get("code");
  if (!code) return new Response('No "code" provided by Spotify.', { status: 400 });

  const response = await fetch(`${SPOTIFY_ACCOUNTS}/api/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      redirect_uri: `${new URL(request.url).origin}/callback`,
      grant_type: "authorization_code",
    }),
  });
  if (!response.ok) {
    const detail = await response.text();
    console.error("Code exchange failed:", detail);
    return new Response("Error during authorization", { status: 500 });
  }
  const data = await response.json();
  await env.SPOTIFY_KV.put(KV_REFRESH_TOKEN, data.refresh_token);
  await env.SPOTIFY_KV.put(KV_ACCESS_TOKEN, data.access_token);
  await env.SPOTIFY_KV.put(
    KV_ACCESS_TOKEN_EXP,
    String(Date.now() + data.expires_in * 1000 - 60000),
  );
  return new Response(
    "<h1>Authentication successful!</h1><p>You can close this window.</p>",
    { headers: { "content-type": "text/html; charset=utf-8" } },
  );
}

async function handleCurrentTrack(request, env, ctx) {
  const cache = caches.default;
  const cacheKey = new Request(request.url, { method: "GET" });
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  if (!(await recordRequest(env))) {
    // Budget exhausted: fuse off, widget shows "not playing".
    return new Response(null, {
      status: 204,
      headers: { "cache-control": "public, max-age=60" },
    });
  }

  const accessToken = await getAccessToken(env);
  if (!accessToken) {
    return new Response(
      JSON.stringify({ error: "Not authenticated. Visit /init-auth." }),
      { status: 401, headers: jsonHeaders },
    );
  }

  const response = await fetch(`${SPOTIFY_API}/me/player/currently-playing`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (response.status === 204 || response.status === 404) {
    const empty = new Response(null, {
      status: 404,
      headers: { "cache-control": `public, max-age=${env.TRACK_CACHE_TTL}` },
    });
    ctx.waitUntil(cache.put(cacheKey, empty.clone()));
    return empty;
  }
  if (response.status === 401) {
    await env.SPOTIFY_KV.delete(KV_ACCESS_TOKEN);
    return new Response(
      JSON.stringify({ error: "Token rejected. Visit /init-auth." }),
      { status: 401, headers: jsonHeaders },
    );
  }
  if (!response.ok) {
    return new Response(
      JSON.stringify({ error: `Spotify HTTP ${response.status}` }),
      { status: 502, headers: jsonHeaders },
    );
  }

  const data = await response.json();
  const track = data.item;
  if (!track) {
    return new Response(null, {
      status: 404,
      headers: { "cache-control": `public, max-age=${env.TRACK_CACHE_TTL}` },
    });
  }

  const payload = {
    name: track.name,
    artist:
      track.artists?.map((a) => a.name).join(", ") ||
      track.show?.name ||
      "Unknown artist",
    album: track.album?.name ?? null,
    albumCover: track.album?.images?.[0]?.url ?? track.images?.[0]?.url ?? null,
    url: track.external_urls?.spotify ?? null,
    isPlaying: data.is_playing === true,
    currentTime: data.progress_ms,
    duration: track.duration_ms,
  };

  const answer = new Response(JSON.stringify(payload), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": `public, max-age=${env.TRACK_CACHE_TTL}`,
      "access-control-allow-origin": "*",
    },
  });
  ctx.waitUntil(cache.put(cacheKey, answer.clone()));
  return answer;
}

export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);

    if (pathname === "/init-auth") {
      if (!env.SPOTIFY_CLIENT_ID || !env.SPOTIFY_CLIENT_SECRET) {
        return new Response("Spotify is not configured.", { status: 503 });
      }
      const params = new URLSearchParams({
        response_type: "code",
        client_id: env.SPOTIFY_CLIENT_ID,
        scope: SCOPES,
        redirect_uri: `${new URL(request.url).origin}/callback`,
      });
      return Response.redirect(`${SPOTIFY_ACCOUNTS}/authorize?${params}`, 302);
    }

    if (pathname === "/callback") {
      return handleCallback(request, env);
    }

    if (pathname === "/current-track") {
      return handleCurrentTrack(request, env, ctx);
    }

    return new Response("Not found", { status: 404 });
  },
};
