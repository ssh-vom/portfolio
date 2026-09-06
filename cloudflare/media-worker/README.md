# Portfolio media Worker

Isolated backend; no changes to the portfolio UI, hosting, or DNS.

Deployed at https://shivom-portfolio-media.shivom-sharma-eng.workers.dev.
Live smoke checks passed: audio HEAD 200, byte-range GET 206 (32 requested bytes),
unknown path 404, and POST 405. Python's default user agent was blocked by Cloudflare
(error 1010); a browser-style user agent succeeded without changing security settings.

## Commands

```sh
cd cloudflare/media-worker
npm ci
npm test
npm run check                 # deployment dry run
npm run dev                   # local R2, NOT the live bucket
npm run deploy                # creates Worker + SQLite Durable Object in Cloudflare
```

Before deploying, confirm the account is on **Workers Free**, check other account usage,
verify R2 public development access is disabled and there are no R2 custom domains,
and configure billing alerts. Do not upgrade plans automatically.
SQLite Durable Objects support Workers Free; exhausted Free-plan resource limits fail
rather than automatically becoming paid usage. R2 remains independently metered.

Published paths come from `src/assets.json`, generated from the gallery metadata.
The BOMJ test audio was deleted from R2 and removed from the allowlist.
No DNS migration is needed for workers.dev.
Only add `media.shivom.dev` as a WORKER custom domain after testing.

## Implemented safeguards

- Exact asset allowlist; no listing, upload, or deletion endpoints.
- GET/HEAD only. Unknown paths and query strings rejected before R2 access.
- Approximate per-IP limit: 60/minute per Cloudflare location (not a hard global limit).
- Single SQLite Durable Object, transactional daily/monthly counters, UTC calendar windows.
- Defaults: 1,000 admitted requests/day and 20,000/month; at most two R2 reads per admission.
- All admissions count, including missing files and malformed ranges. No retries to R2.
- Budget service or storage failure returns 503, never bypasses checks.
- Single validated byte ranges, suffix ranges, and If-Range ETag handling for seeking.
- `MEDIA_ENABLED=false` rejects media requests before any binding access.
- Logs disabled by default to avoid unnecessary telemetry storage.

## Emergency disable

Change `MEDIA_ENABLED` to `"false"` in wrangler.jsonc and deploy again.
Propagation is not instantaneous; already-running downloads cannot be revoked.
Keep `global-v1`, the Durable Object class, and its stored state intact: renaming or
removing them can reset counters. Lower limits without resetting counters.

## Important limitations / remaining work

- **No guaranteed $0 bill.** Rejected traffic still invokes the Worker, and requests
  reaching an exhausted coordinator still incur Durable Object requests/reads.
  Keep Workers Free for platform-level free-tier cutoffs; account usage is shared.
- These are request budgets, not dollar or byte budgets. UTC calendar months differ
  from any rolling measurement windows used by other services.
- R2 storage persists and incurs charges independently of serving cutoffs.
- Owner upload tooling now enforces 100 MB/file and 8 GB total, with a same-OS-user
  local lock. See [upload instructions](../../docs/media-uploads.md). Dashboard/API
  uploads, other computers/users, and unfinished multipart uploads bypass its checks.
- Full GET responses use the internal Worker cache for one hour, strictly AFTER
  allowlist, kill-switch, rate-limit, and global-budget checks. Range/HEAD requests
  still use R2. Outgoing responses are no-store, so there is no public cache route
  bypassing the Worker. Removing an allowlist entry blocks even internally cached data.
- No CORS needed for native audio/video elements. Cross-origin JavaScript fetch or
  canvas use would need a narrowly scoped Worker-side CORS policy.
- Public-access settings, billing plan, and alerts must be verified separately;
  this configuration does not change them.

## Tests

`npm test` covers media GET/HEAD, range validation/seeking, read limits, failure closure,
kill switch, path filtering, and method restrictions using mocked bindings.
A separate local Wrangler runtime smoke test verified the actual SQLite Durable Object
returns 503 on request three with a daily limit of two (empty local R2 returns 404 for
the first two). Live video HTTP delivery/range checks and actual Chrome playback/seeking passed.
Gallery browser checks covered mobile overflow, filters, native dialog focus handling,
audio playback (before test-audio removal), and the unavailable state. A local runtime
concurrency test sent 10 simultaneous requests with a monthly budget of 3: exactly
3 were admitted and 7 rejected. Calendar rollover remains an additional operational
check; none of these tests constitute a billing guarantee.

References:
- https://developers.cloudflare.com/durable-objects/platform/pricing/
- https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/
- https://developers.cloudflare.com/r2/pricing/
