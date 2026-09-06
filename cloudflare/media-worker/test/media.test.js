import test from 'node:test';
import assert from 'node:assert/strict';
import { assets, parseRange, serveMedia } from '../src/media.js';
const publishedPath = Object.keys(assets)[0];

function fixture({ allowed = true, rate = true, broken = false } = {}) {
    let reads = 0;
    const meta = { size: 10, etag: 'abc', httpEtag: '"abc"' };
    const env = {
        MEDIA_ENABLED: 'true',
        VISITOR_LIMIT: { limit: async () => ({ success: rate }) },
        BUDGET: {
            idFromName: () => 'global',
            get: () => ({ fetch: async () => {
                if (broken) throw new Error('offline');
                return new Response(null, { status: allowed ? 204 : 429 });
            } }),
        },
        MEDIA: {
            head: async () => { reads++; return meta; },
            get: async (_key, options) => {
                reads++;
                const text = '0123456789';
                const r = options.range;
                return { ...meta, body: r ? text.slice(r.offset, r.offset + r.length) : text };
            },
        },
    };
    return { env, reads: () => reads };
}
const req = (options = {}, path = publishedPath) => new Request(`https://media.test${path}`, options);

test('ranges support bounded, open-ended, and suffix requests', () => {
    assert.deepEqual(parseRange('bytes=2-4', 10), { offset: 2, length: 3 });
    assert.deepEqual(parseRange('bytes=8-', 10), { offset: 8, length: 2 });
    assert.deepEqual(parseRange('bytes=-3', 10), { offset: 7, length: 3 });
    for (const r of ['bytes=20-', 'bytes=4-2', 'bytes=-0', 'bytes=0-1,3-4', 'garbage']) {
        assert.throws(() => parseRange(r, 10));
    }
});
test('internal cache cannot bypass budget or kill switch', async () => {
    const original = globalThis.caches;
    let lookups = 0;
    globalThis.caches = { default: { match: async () => {
        lookups++;
        return new Response('cached', { headers: { 'Cache-Control': 'public, max-age=3600' } });
    } } };
    const ctx = { waitUntil() {} };
    try {
        const denied = fixture({ allowed: false });
        assert.equal((await serveMedia(req(), denied.env, ctx)).status, 503);
        assert.equal(lookups, 0);
        const disabled = fixture();
        disabled.env.MEDIA_ENABLED = 'false';
        assert.equal((await serveMedia(req(), disabled.env, ctx)).status, 503);
        assert.equal(lookups, 0);
        const permitted = fixture();
        const response = await serveMedia(req(), permitted.env, ctx);
        assert.equal(await response.text(), 'cached');
        assert.equal(response.headers.get('Cache-Control'), 'no-store');
        assert.equal(permitted.reads(), 0);
        assert.equal(lookups, 1);
    } finally { globalThis.caches = original; }
});
test('GET serves allowlisted media', async () => {
    const f = fixture();
    const r = await serveMedia(req(), f.env);
    assert.equal(r.status, 200);
    assert.equal(await r.text(), '0123456789');
    assert.equal(f.reads(), 2);
});
test('HEAD reads metadata only', async () => {
    const f = fixture();
    const r = await serveMedia(req({ method: 'HEAD' }), f.env);
    assert.equal(r.status, 200);
    assert.equal(await r.text(), '');
    assert.equal(f.reads(), 1);
});
test('seeking returns 206 and correct bytes', async () => {
    const r = await serveMedia(req({ headers: { Range: 'bytes=2-4' } }), fixture().env);
    assert.equal(r.status, 206);
    assert.equal(r.headers.get('Content-Range'), 'bytes 2-4/10');
    assert.equal(await r.text(), '234');
});
test('invalid ranges return 416 without object GET', async () => {
    const f = fixture();
    const r = await serveMedia(req({ headers: { Range: 'bytes=99-' } }), f.env);
    assert.equal(r.status, 416);
    assert.equal(f.reads(), 1);
});
test('limits and failures block all R2 access', async () => {
    for (const options of [{ allowed: false }, { rate: false }, { broken: true }]) {
        const f = fixture(options);
        assert.ok((await serveMedia(req(), f.env)).status >= 429);
        assert.equal(f.reads(), 0);
    }
});
test('kill switch, unknown paths, queries, and writes cannot access R2', async () => {
    const f = fixture();
    assert.equal((await serveMedia(req({ method: 'POST' }), f.env)).status, 405);
    assert.equal((await serveMedia(req({}, '/other.mp3'), f.env)).status, 404);
    assert.equal((await serveMedia(req({}, `${publishedPath}?x=1`), f.env)).status, 404);
    f.env.MEDIA_ENABLED = 'false';
    assert.equal((await serveMedia(req(), f.env)).status, 503);
    assert.equal(f.reads(), 0);
});
