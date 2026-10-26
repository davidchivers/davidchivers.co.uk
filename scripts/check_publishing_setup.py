"""Fail before deployment if the repository no longer owns the public website."""

import json
import os
import urllib.request

REPOSITORY = 'davidchivers/davidchivers.co.uk'


def validate_context(repository, ref):
    if repository != REPOSITORY or ref != 'refs/heads/main':
        raise ValueError('Publication is allowed only from davidchivers/davidchivers.co.uk main')


def validate_pages(pages):
    expected = {
        'cname': 'davidchivers.co.uk',
        'build_type': 'workflow',
        'protected_domain_state': 'verified',
        'https_enforced': True,
    }
    for key, value in expected.items():
        if pages.get(key) != value:
            raise ValueError(f'Pages configuration mismatch: {key} must be {value!r}')
    if pages.get('source') != {'branch': 'main', 'path': '/'}:
        raise ValueError('Pages source must be main at the repository root')


def main():
    validate_context(os.environ.get('GITHUB_REPOSITORY'), os.environ.get('GITHUB_REF'))
    request = urllib.request.Request(
        f'https://api.github.com/repos/{REPOSITORY}/pages',
        headers={
            'Authorization': 'Bearer ' + os.environ['GH_TOKEN'],
            'Accept': 'application/vnd.github+json',
            'User-Agent': 'website-publishing-check',
        },
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        validate_pages(json.load(response))
    print('Verified: main owns davidchivers.co.uk, domain ownership verified, HTTPS enforced')


if __name__ == '__main__':
    main()
