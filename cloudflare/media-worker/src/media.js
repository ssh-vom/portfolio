import publishedAssets from './assets.json' with { type: 'json' };

// Generated only by the explicit prepare-publish step, not by uploads.
export const assets = Object.freeze(publishedAssets);

export function parseRange(value, size) {
    if (!value) return null;
    const match = /^bytes=(\d*)-(\d*)$/.exec(value);
    if (!match || (!match[1] && !match[2])) throw new Error('Invalid range');
    let start;
    let end;
    if (!match[1]) {
        const suffix = Number(match[2]);
        if (!Number.isSafeInteger(suffix) || suffix <= 0) throw new Error('Invalid suffix');
        start = Math.max(0, size - suffix);
        end = size - 1;
    } else {
        start = Number(match[1]);
        end = match[2] ? Number(match[2]) : size - 1;
        if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end)) throw new Error('Invalid range');
        end = Math.min(end, size - 1);
    }
    if (start >= size || start > end) throw new Error('Unsatisfiable range');
    return { offset: start, length: end - start + 1 };
}

function unavailable(status, message, extra = {}) {
    return new Response(message, {
        status,
        headers: { 'Cache-Control': 'no-store', ...extra },
    });
}

export async function serveMedia(request, env, ctx) {
    if (env.MEDIA_ENABLED !== 'true') return unavailable(503, 'Media temporarily unavailable');
    if (!['GET', 'HEAD'].includes(request.method)) {
        return unavailable(405, 'Read-only endpoint', { Allow: 'GET, HEAD' });
    }
    const url = new URL(request.url);
    const asset = Object.hasOwn(assets, url.pathname) && assets[url.pathname];
    if (!asset || url.search) return unavailable(404, 'Not found');

    try {
        const visitor = request.headers.get('CF-Connecting-IP') || 'unknown';
        const rate = await env.VISITOR_LIMIT.limit({ key: visitor });
        if (!rate.success) return unavailable(429, 'Too many requests', { 'Retry-After': '60' });
        const budget = env.BUDGET.get(env.BUDGET.idFromName('global-v1'));
        const permission = await budget.fetch('https://budget.internal/consume', { method: 'POST' });
        if (!permission.ok) return unavailable(503, 'Media request budget exhausted', { 'Retry-After': '3600' });

        // Internal full-response cache only, always AFTER admission and kill-switch checks.
        // Range requests deliberately use R2; browsers/CDN receive no-store headers.
        const cache = request.method === 'GET' && !request.headers.has('Range') && ctx?.waitUntil
            ? globalThis.caches?.default : null;
        const cacheKey = new Request(url.origin + url.pathname);
        if (cache) {
            try {
                const hit = await cache.match(cacheKey);
                if (hit) {
                    const response = new Response(hit.body, hit);
                    response.headers.set('Cache-Control', 'no-store');
                    return response;
                }
            } catch { /* Cache is an optimization, not a budget authority. */ }
        }
        // At most two R2 reads per admitted request. Count before any R2 operation.
        const metadata = await env.MEDIA.head(asset.key);
        if (!metadata) return unavailable(404, 'Not found');
        const headers = new Headers({
            'Content-Type': asset.type,
            'Content-Length': String(metadata.size),
            'Accept-Ranges': 'bytes',
            'ETag': metadata.httpEtag,
            'X-Content-Type-Options': 'nosniff',
            // No cache bypass of the budget/kill switch in the first version.
            'Cache-Control': 'no-store',
        });
        if (request.method === 'HEAD') return new Response(null, { headers });
        let range;
        try {
            const ifRange = request.headers.get('If-Range');
            range = parseRange(!ifRange || ifRange === metadata.httpEtag ? request.headers.get('Range') : null, metadata.size);
        } catch {
            return unavailable(416, 'Invalid or unsatisfiable range', { 'Content-Range': `bytes */${metadata.size}` });
        }
        const object = await env.MEDIA.get(asset.key, {
            onlyIf: { etagMatches: metadata.etag },
            ...(range ? { range } : {}),
        });
        if (!object) return unavailable(404, 'Not found');
        if (!object.body) return unavailable(503, 'Media changed; retry');
        if (range) {
            headers.set('Content-Range', `bytes ${range.offset}-${range.offset + range.length - 1}/${metadata.size}`);
            headers.set('Content-Length', String(range.length));
        }
        const response = new Response(object.body, { status: range ? 206 : 200, headers });
        if (cache && !range) {
            const cached = response.clone();
            cached.headers.set('Cache-Control', 'public, max-age=3600');
            ctx.waitUntil(cache.put(cacheKey, cached).catch(() => {}));
        }
        return response;
    } catch {
        // A missing binding, failed coordinator, or R2 error must never bypass limits.
        return unavailable(503, 'Media temporarily unavailable');
    }
}
