#!/usr/bin/env python3
"""Generate a lightweight local poster; never uploads or deploys media."""
import argparse
import json
from pathlib import Path
import subprocess
import sys
from media_upload import ROOT, MANIFEST, upload_lock, save_json


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('file', type=Path)
    parser.add_argument('--slug', required=True)
    parser.add_argument('--time', type=float, default=3.0, help='Frame timestamp in seconds')
    args = parser.parse_args()
    if args.time < 0:
        parser.error('--time must be nonnegative')
    with upload_lock():
        entries = json.loads(MANIFEST.read_text())
        entry = next((e for e in entries if e['slug'] == args.slug), None)
        if not entry or entry['type'] != 'video':
            raise ValueError('Choose the slug of an existing video in src/data/creative.json')
        if not all(c.isalnum() or c in '-_' for c in args.slug):
            raise ValueError('Invalid slug')
        source = args.file.expanduser().resolve(strict=True)
        duration = float(subprocess.check_output([
            'ffprobe', '-v', 'error', '-show_entries', 'format=duration',
            '-of', 'default=noprint_wrappers=1:nokey=1', str(source),
        ], text=True).strip())
        if not 0 <= args.time < duration:
            raise ValueError(f'Timestamp must be less than the video duration ({duration:.2f}s)')
        folder = ROOT / 'public/images/creative'
        folder.mkdir(parents=True, exist_ok=True)
        output = folder / f'{args.slug}.jpg'
        temporary = folder / f'{args.slug}.tmp.jpg'
        try:
            subprocess.run([
                'ffmpeg', '-v', 'error', '-y', '-ss', str(args.time), '-i', str(source),
                '-frames:v', '1', '-vf', 'scale=960:-2', '-q:v', '3', str(temporary),
            ], check=True)
            if not temporary.is_file() or temporary.stat().st_size == 0:
                raise ValueError('No frame generated')
            temporary.replace(output)
        finally:
            temporary.unlink(missing_ok=True)
        entry['poster'] = f'/images/creative/{args.slug}.jpg'
        entry['duration'] = round(duration, 2)
        save_json(MANIFEST, entries)
        print(f'Poster saved: {output.relative_to(ROOT)} ({output.stat().st_size:,} bytes)')
        print('Local website asset only; no R2 upload or deployment performed.')


if __name__ == '__main__':
    try:
        main()
    except (ValueError, OSError, subprocess.CalledProcessError) as error:
        print(f'Error: {error}', file=sys.stderr)
        sys.exit(1)
