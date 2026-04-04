#!/usr/bin/env python3
"""
bust.py — Content-hash cache busting for static sites.

For every local CSS/JS file, computes a short MD5 hash and rewrites
<link href="..."> / <script src="..."> in all HTML files to append
?v=<hash>.  Idempotent — safe to run on every commit.

Works on GitHub Pages, Netlify, localhost — anywhere.
"""

import hashlib
import re
from pathlib import Path

ROOT = Path(__file__).parent

# File extensions to hash
ASSET_EXTS = {'.css', '.js'}

# Matches href="path" or href="path?old=stuff" in <link> tags
LINK_RE = re.compile(
    r'(<link\b[^>]*\shref=")([^"#?]+)(\?[^"#]*)?(")',
    re.IGNORECASE,
)

# Matches src="path" or src="path?old=stuff" in <script> tags
SCRIPT_RE = re.compile(
    r'(<script\b[^>]*\ssrc=")([^"#?]+)(\?[^"#]*)?(")',
    re.IGNORECASE,
)


def _skip(path: Path) -> bool:
    """Skip hidden directories (.git, .idea, etc.)."""
    return any(part.startswith('.') for part in path.parts)


def file_hash(path: Path) -> str:
    return hashlib.md5(path.read_bytes()).hexdigest()[:8]


def resolve_asset(html_file: Path, asset_path: str):
    """Resolve a relative or root-relative asset path to an absolute Path."""
    if asset_path.startswith(('http://', 'https://', '//')):
        return None  # external — skip
    if asset_path.startswith('/'):
        candidate = ROOT / asset_path.lstrip('/')
    else:
        candidate = html_file.parent / asset_path
    resolved = candidate.resolve()
    return resolved if resolved.exists() else None


def bust_html(html_file: Path, hashes: dict) -> bool:
    text = html_file.read_text(encoding='utf-8')
    original = text

    def replacer(m):
        before, path, _old_qs, quote = m.group(1), m.group(2), m.group(3), m.group(4)
        abs_path = resolve_asset(html_file, path)
        if abs_path is None or abs_path not in hashes:
            return m.group(0)
        return f'{before}{path}?v={hashes[abs_path]}{quote}'

    text = LINK_RE.sub(replacer, text)
    text = SCRIPT_RE.sub(replacer, text)

    if text != original:
        html_file.write_text(text, encoding='utf-8')
        return True
    return False


def main():
    # 1. Hash every CSS/JS file
    hashes = {}
    for ext in ASSET_EXTS:
        for f in ROOT.rglob(f'*{ext}'):
            if _skip(f):
                continue
            hashes[f.resolve()] = file_hash(f)

    print(f'Hashed {len(hashes)} asset(s).')

    # 2. Rewrite HTML files
    changed = []
    for html in ROOT.rglob('*.html'):
        if _skip(html):
            continue
        if bust_html(html, hashes):
            changed.append(html.relative_to(ROOT))

    if changed:
        print(f'Updated {len(changed)} HTML file(s):')
        for p in changed:
            print(f'  {p}')
    else:
        print('No HTML files needed updating.')


if __name__ == '__main__':
    main()
