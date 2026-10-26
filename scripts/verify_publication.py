"""A Pages deployment is live only when the custom domain serves this release."""

import argparse
import hashlib
import json
from pathlib import Path
import re
import subprocess
import time
import urllib.request
from urllib.parse import urlsplit

BASE = 'https://davidchivers.co.uk'
REPOSITORY = 'davidchivers/davidchivers.co.uk'
ROOT = Path(__file__).resolve().parents[1]
ROUTES = {
    '/': 'index.html',
    '/cv/': 'cv/index.html',
    '/book/': 'book/index.html',
    '/blog/': 'blog/index.html',
    '/ai/': 'ai/index.html',
    '/teaching/ai-course.html': 'teaching/ai-course.html',
}


class SameSiteRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        target = urlsplit(newurl)
        if target.scheme != 'https' or target.hostname != 'davidchivers.co.uk':
            raise ValueError(f'Unexpected public-site redirect: {newurl}')
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def fetch(path, commit, base=BASE):
    request = urllib.request.Request(
        f'{base}{path}?publication={commit}',
        headers={'Cache-Control': 'no-cache', 'User-Agent': 'publication-verifier'},
    )
    with urllib.request.build_opener(SameSiteRedirect).open(request, timeout=30) as response:
        if response.status != 200:
            raise ValueError(f'{path}: HTTP {response.status}')
        if urlsplit(response.url).hostname != 'davidchivers.co.uk':
            raise ValueError(f'Expected canonical domain, received {response.url}')
        return response.read()


def verify(commit):
    expected = {'repository': REPOSITORY, 'branch': 'main', 'commit': commit}
    actual = json.loads(fetch('/publishing-release.json', commit))
    if actual != expected:
        raise ValueError(f'Wrong published release: expected {expected}, received {actual}')
    www = json.loads(fetch('/publishing-release.json', commit, 'https://www.davidchivers.co.uk'))
    if www != expected:
        raise ValueError('www does not redirect to the expected HTTPS release')
    print('HTTPS www redirect and release verified', flush=True)
    for route, filename in ROUTES.items():
        actual_bytes = fetch(route, commit)
        expected_bytes = subprocess.check_output(
            ['git', 'cat-file', 'blob', f'{commit}:{filename}'], cwd=ROOT
        )
        if hashlib.sha256(actual_bytes).digest() != hashlib.sha256(expected_bytes).digest():
            raise ValueError(f'{route}: public content differs from this checkout')
        print(f'HTTPS content verified: {BASE}{route}', flush=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('commit', help='Full commit SHA of the deployed checkout')
    parser.add_argument('--attempts', type=int, default=20)
    parser.add_argument('--delay', type=float, default=30)
    args = parser.parse_args()
    if not re.fullmatch(r'[0-9a-f]{40}', args.commit):
        parser.error('commit must be a full Git commit SHA')
    if args.attempts < 1 or args.delay < 0:
        parser.error('attempts must be positive and delay nonnegative')
    for attempt in range(args.attempts):
        try:
            verify(args.commit)
            print(f'LIVE: {REPOSITORY}@{args.commit} on {BASE}')
            return
        except (OSError, ValueError) as error:
            print(f'Publication not verified ({attempt + 1}/{args.attempts}): {error}', flush=True)
            if attempt + 1 == args.attempts:
                raise SystemExit('FAILED: repository deployment is not confirmed on the public website')
            time.sleep(args.delay)


if __name__ == '__main__':
    main()
