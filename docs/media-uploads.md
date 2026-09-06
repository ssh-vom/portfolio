# Uploading creative media

Requires Python 3.11+ on macOS/Linux, Node, and local Wrangler OAuth login.
No upload endpoint or credentials are exposed to website visitors.

## First-time setup

```sh
npm --prefix cloudflare/media-worker ci
cd cloudflare/media-worker
npx wrangler login
cd ../..
```

The uploader reads the existing Wrangler OAuth config in the standard macOS/Linux
location (or `WRANGLER_CONFIG_PATH`). It never prints or stores the token in the repo.
Expired tokens fail closed: run login again. The config location is a Wrangler
implementation detail and may need updating when upgrading Wrangler.

## Validate without uploading

```sh
npm run media:upload -- ~/Downloads/my-edit.mp4 --title "Night Drive" --type video --dry-run
```

This reads the complete bucket inventory (billable listing operations), checks the
quota, and validates a temporary snapshot of the file. It does not upload, publish,
or change metadata. Basic magic-byte checks are not full media/codec validation;
export browser-compatible media (for MP4, normally H.264/AAC).

## Upload privately

```sh
npm run media:upload -- ~/Downloads/my-edit.mp4 --title "Night Drive" --type video
```

- Maximum file size: **100 MB decimal**.
- Maximum stored objects total: **8 GB decimal**; all objects in this bucket count.
- MP3, MP4, WebM, JPG/JPEG, PNG, WebP, GIF supported. `--type` is optional.
- File bytes determine a SHA-256 object key; identical content is not uploaded twice.
- A local OS lock serializes this tool across checkouts for the same OS user.
- A temporary snapshot prevents source-file changes during validation/upload.
- On success, `src/data/creative.json` receives the title, type, key, path, size, and date.
- Upload does NOT modify the Worker allowlist, deploy anything, or alter the website.

If upload succeeds but metadata saving fails, retry the same command: it will reuse
the content-addressed object. Do not manually overwrite content-addressed object keys.
Generate a video poster locally (requires ffmpeg and ffprobe):

```sh
npm run media:poster -- ~/Downloads/my-edit.mp4 --slug <slug-from-metadata> --time 6
```

This saves a lightweight JPG in `public/images/creative/` and adds its path and video
duration to the metadata. Posters ship with the website, avoiding R2 requests while
browsing tiles. Choose another timestamp to replace it. An admin UI is not implemented.

## Publish (explicit and separate)

```sh
npm run media:prepare-publish
# Review src/data/creative.json and cloudflare/media-worker/src/assets.json.
git diff
npm --prefix cloudflare/media-worker test
npm --prefix cloudflare/media-worker run check
npm --prefix cloudflare/media-worker run deploy
```

Set `published: true` on the entries you want public in `src/data/creative.json`
BEFORE running `prepare-publish`. New uploads default to `published: false`.
Both the gallery and generated Worker allowlist include only published entries.
Preparation is not deployment. Never rename the existing Durable Object/global counter identity.

Published media URLs use:

```
https://shivom-portfolio-media.shivom-sharma-eng.workers.dev/<path from metadata>
```

The stored `path` already starts with `/`; concatenate it directly with the origin.
The BOMJ test audio was deleted and its mapping removed at the owner's request.

Deploy the website through its usual workflow AFTER deploying the allowlist.
The homepage Creative section renders published items as cinematic tiles. Titles
split on ` — ` into a main title and subtitle; the last title word gets an accent.
Video/audio downloads start only when the viewer opens. The native dialog supports
Escape, focus containment/restoration, and a friendly unavailable state.
Removing an allowlist entry and redeploying stops new delivery, but does not delete
stored files or revoke downloads already in progress.

## Limits and caveats

This is a **single-owner, single-computer workflow**, not a distributed quota service.
Other computers, OS users, dashboard uploads, API clients, or in-flight multipart
uploads can bypass the lock/check. Use only this tool from one OS account and do not
upload elsewhere concurrently. The inventory sums completed objects, not unfinished
multipart parts. Failed uploads may require inspecting/cleaning unfinished parts in R2.

Keep other bucket usage and R2/Workers billing alerts under review. Free allowances
are account-wide, not reserved for this bucket. This is not a hard spending cap.
The 8 GB quota has headroom but does not guarantee $0, especially if other account
resources consume the free allowances. Existing files still count toward storage
when the Worker stops serving them.

Tests: `npm run media:test` and `npm --prefix cloudflare/media-worker test`.
