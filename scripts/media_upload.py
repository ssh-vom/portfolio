#!/usr/bin/env python3
"""Owner-only R2 uploader. Python 3.11+; uses existing Wrangler OAuth login."""
import argparse
import contextlib
import datetime
import fcntl
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import tomllib
import urllib.error
import urllib.parse
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
WORKER = ROOT / 'cloudflare/media-worker'
ACCOUNT = 'bdcbce64f5dbcfeca7698feb6e5efbf5'
BUCKET = 'shivom-portfolio-assets'
MAX_FILE = 100_000_000
MAX_STORAGE = 8_000_000_000
MANIFEST = ROOT / 'src/data/creative.json'
FORMATS = {
    '.mp3': ('audio', 'audio/mpeg'), '.mp4': ('video', 'video/mp4'),
    '.webm': ('video', 'video/webm'), '.jpg': ('image', 'image/jpeg'),
    '.jpeg': ('image', 'image/jpeg'), '.png': ('image', 'image/png'),
    '.webp': ('image', 'image/webp'), '.gif': ('image', 'image/gif'),
}


def validate(path):
    if not path.is_file():
        raise ValueError(f'Not a regular file: {path}')
    ext = path.suffix.lower()
    if ext not in FORMATS:
        raise ValueError('Unsupported format. Use MP3, MP4, WebM, JPG, PNG, WebP, or GIF.')
    size = path.stat().st_size
    if not 0 < size <= MAX_FILE:
        raise ValueError('File must be nonempty and at most 100 MB (decimal).')
    with path.open('rb') as f:
        head = f.read(32)
    valid = {
        '.mp3': head.startswith(b'ID3') or (len(head) > 1 and head[0] == 255 and head[1] & 224 == 224),
        '.mp4': head[4:8] == b'ftyp', '.webm': head.startswith(b'\x1aE\xdf\xa3'),
        '.jpg': head.startswith(b'\xff\xd8\xff'), '.jpeg': head.startswith(b'\xff\xd8\xff'),
        '.png': head.startswith(b'\x89PNG\r\n\x1a\n'),
        '.webp': head.startswith(b'RIFF') and head[8:12] == b'WEBP',
        '.gif': head.startswith((b'GIF87a', b'GIF89a')),
    }[ext]
    if not valid:
        raise ValueError('File signature does not match extension (basic check, not codec validation).')
    return size, *FORMATS[ext]


def oauth_token():
    override = os.environ.get('WRANGLER_CONFIG_PATH')
    candidates = [Path(override)] if override else [
        Path.home() / 'Library/Preferences/.wrangler/config/default.toml',
        Path(os.environ.get('XDG_CONFIG_HOME', str(Path.home() / '.config'))) / '.wrangler/config/default.toml',
        Path.home() / '.wrangler/config/default.toml',
    ]
    for path in candidates:
        if path.is_file():
            token = tomllib.loads(path.read_text()).get('oauth_token')
            if token:
                return token
    raise ValueError('Wrangler OAuth login not found. Run npx wrangler login first.')


def api_page(cursor=None):
    query = urllib.parse.urlencode({'per_page': 1000, **({'cursor': cursor} if cursor else {})})
    url = f'https://api.cloudflare.com/client/v4/accounts/{ACCOUNT}/r2/buckets/{BUCKET}/objects?{query}'
    request = urllib.request.Request(url, headers={
        'Authorization': 'Bearer ' + oauth_token(), 'User-Agent': 'portfolio-media-uploader/1.0',
    })
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            page = json.load(response)
    except urllib.error.HTTPError as error:
        raise ValueError(f'Bucket inspection failed (HTTP {error.code}); no upload. Try wrangler login again.') from None
    if page.get('success') is not True:
        raise ValueError('Cloudflare could not list the bucket; refusing upload.')
    return page


def inventory(fetch=api_page):
    """Fail closed if pagination or the listing response is unfamiliar."""
    total, keys, cursors = 0, set(), set()
    cursor = None
    for _ in range(10000):
        page = fetch(cursor)
        objects = page.get('result')
        if not isinstance(objects, list):
            raise ValueError('Unexpected object listing format; refusing upload.')
        for obj in objects:
            key, size = obj.get('key'), obj.get('size')
            if not isinstance(key, str) or type(size) is not int or size < 0 or key in keys:
                raise ValueError('Invalid or duplicate object listing; refusing upload.')
            keys.add(key)
            total += size
        info = page.get('result_info') or {}
        cursor = info.get('cursor')
        if cursor:
            if cursor in cursors:
                raise ValueError('Repeated listing cursor; refusing upload.')
            cursors.add(cursor)
            continue
        # This account API omits pagination metadata for a short complete result.
        # Ambiguous full pages or reported additional results must never undercount.
        if (len(objects) >= info.get('per_page', 1000) and info.get('is_truncated') is not False) or info.get('is_truncated') or info.get('truncated') or info.get('delimited') or info.get('total_count', len(keys)) > len(keys):
            raise ValueError('Cannot prove bucket listing is complete; refusing upload.')
        return total, keys
    raise ValueError('Too many listing pages; refusing upload.')


def check_quota(used, incoming):
    if used + incoming > MAX_STORAGE:
        raise ValueError(f'8 GB quota exceeded: {used:,} stored + {incoming:,} incoming bytes.')


@contextlib.contextmanager
def upload_lock():
    # OS releases the lock after crashes. Never delete the lock file (inode races).
    path = Path.home() / '.cache/portfolio-media' / f'{ACCOUNT}-{BUCKET}.lock'
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open('a') as handle:
        try:
            fcntl.flock(handle, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            raise ValueError('Another media upload/publish is running on this computer.') from None
        yield


def save_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(mode='w', dir=path.parent, delete=False) as f:
        json.dump(value, f, indent=2)
        f.write('\n')
        temporary = f.name
    os.replace(temporary, path)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('file', nargs='?', type=Path)
    parser.add_argument('--title')
    parser.add_argument('--type', choices=['audio', 'video', 'image'])
    parser.add_argument('--dry-run', action='store_true', help='Validate and inspect quota, without uploading or writing metadata')
    parser.add_argument('--prepare-publish', action='store_true', help='Generate Worker allowlist from gallery metadata; does NOT deploy')
    args = parser.parse_args()
    with upload_lock():
        entries = json.loads(MANIFEST.read_text()) if MANIFEST.exists() else []
        if args.prepare_publish:
            if args.file or args.dry_run:
                parser.error('--prepare-publish cannot be combined with a file or --dry-run')
            save_json(WORKER / 'src/assets.json', {
                item['path']: {'key': item['key'], 'type': item['contentType']} for item in entries if item.get('published') is True
            })
            print('Prepared Worker allowlist. Review git diff, then deploy Worker and website separately.')
            return
        if not args.file or not args.title or not args.title.strip():
            parser.error('Provide a file and --title')
        source = args.file.expanduser().resolve()
        # Snapshot prevents editing the source after validation and quota checks.
        with tempfile.TemporaryDirectory(prefix='portfolio-media-') as temp:
            snapshot = Path(temp) / ('asset' + source.suffix.lower())
            validate(source)
            with source.open('rb') as src, snapshot.open('wb') as dst:
                remaining = MAX_FILE + 1
                while remaining:
                    chunk = src.read(min(1024 * 1024, remaining))
                    if not chunk:
                        break
                    dst.write(chunk)
                    remaining -= len(chunk)
            size, kind, content_type = validate(snapshot)
            if args.type and args.type != kind:
                raise ValueError('--type does not match the file format')
            digest = hashlib.sha256(snapshot.read_bytes()).hexdigest()
            key = f'creative/{digest}{snapshot.suffix}'
            public_path = '/' + key
            used, keys = inventory()
            check_quota(used, 0 if key in keys else size)
            print(f'Bucket: {used:,} bytes used / {MAX_STORAGE:,}; file: {size:,} bytes')
            print(f'Media path: {public_path}')
            if args.dry_run:
                print('Dry run passed. No object, metadata, or deployment changes.')
                return
            if key not in keys:
                subprocess.run([
                    str(WORKER / 'node_modules/.bin/wrangler'), 'r2', 'object', 'put',
                    f'{BUCKET}/{key}', '--remote', '--file', str(snapshot),
                    '--content-type', content_type, '--storage-class', 'Standard',
                ], cwd=WORKER, check=True)
            else:
                print('Identical content already stored; skipping upload.')
            entry = {
                'slug': digest[:16], 'title': args.title.strip(), 'type': kind,
                'key': key, 'path': public_path, 'contentType': content_type,
                'size': size, 'date': datetime.date.today().isoformat(), 'featured': False, 'published': False,
            }
            existing = next((item for item in entries if item['key'] == key), None)
            if existing:
                existing['title'] = entry['title']
            else:
                entries.append(entry)
            save_json(MANIFEST, entries)
            print('Uploaded privately and saved src/data/creative.json. Not published.')
            print('Next: npm run media:prepare-publish, review changes, then deploy.')


if __name__ == '__main__':
    try:
        main()
    except (ValueError, OSError, subprocess.CalledProcessError) as error:
        print(f'Error: {error}', file=sys.stderr)
        sys.exit(1)
