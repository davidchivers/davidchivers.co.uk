# Site Map

This file is the quick orientation note for the public website repo.

## Repo

- Shared local repo: `E:\AI\other\davidchivers_site` (preserve local changes; publish from a separate clean checkout)
- Remote: `https://github.com/davidchivers/davidchivers.co.uk.git`
- Branch: `main`

## What This Repo Appears To Own

Confirmed from the local repo contents:

- `/` via `index.html`
- `/book/`, `/book/statistical-style-guide/` and `/book/corrections/`
- `/cv/`
- `/blog/`
- `/papers.html`
- `/results.html`
- `/alcohol.html`
- `/ai_install/`
- `/ai/` - student AI course
- `/teaching/ai-course.html` - PhD AI workshop
- `/countdown/`
- `/drafter/`
- `/email_app/`
- `/metal_map/`
- `/wine_bar/`
- `/seminars/` - external seminar programme and separate seminar/coffee calendar subscriptions; internal seminars reserved for later.

This repo is now the intended source for the root `davidchivers.co.uk` site and its project subpaths.

## Email Drafter

- Intended public route: `/drafter/`
- Public files for that route should live in `drafter/`
- `/email_drafter/` should only be a compatibility redirect to `/drafter/`
- Current files:
  - `drafter/index.html`
  - `drafter/responses.json`
  - `drafter/save-config.js`

## Canonical Source vs Publish Target

To avoid confusion:

- Canonical working source for the drafter lives in the AI workspace:
  - `E:\AI\other\email_app\email_drafter\`
- This website repo is the publish target copy for the public site:
  - `E:\AI\other\davidchivers_site\drafter\`

Recommended rule:

- Edit the drafter in `other/email_app/email_drafter`
- Mirror approved files into this repo when publishing

## Single publishing repository

David's instruction on 23 October 2026 is to use only this repository for future publication. Do not push updates or create mirror pull requests in `thomshutt/davidchivers`. Earlier guidance to use it as a temporary publishing bridge is superseded.

The custom-domain transfer was completed on 26 October 2026. Account-level ownership verification released the domain from the old repository without requiring its owner's admin access. The Pages API now assigns `davidchivers.co.uk` to this repository, with `protected_domain_state: verified`, an approved certificate, and HTTPS enforcement enabled. The old repository's custom domain is null.

### Hosting and DNS

- Publishing repository: `davidchivers/davidchivers.co.uk`, branch `main`, root directory, GitHub Actions workflow `.github/workflows/static.yml`.
- Canonical public URL: `https://davidchivers.co.uk/`.
- Registrar and DNS management: 123 Reg. Nameservers: `ns01.domaincontrol.com`, `ns02.domaincontrol.com`.
- Preserve the ownership TXT record permanently: `_github-pages-challenge-davidchivers` = `e53f4219ce341799be1ceab05b89ec`. It was added through 123 Reg with its default TTL; authoritative/public DNS reported 3600 seconds.
- Existing apex A records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
- Existing apex AAAA records: `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`.
- `www` CNAME: `davidchivers.github.io`, TTL 1 hour. The old value pointed to the apex and failed HTTPS certificate validation. GitHub requires this direct CNAME for the www HTTPS redirect.
- `_domainconnect`, NS, SOA, apex A and AAAA records were preserved. The inspected zone had no MX records. DNS changes were limited to the verification TXT record and the www correction.
- A `CNAME` file alone does not configure an Actions-hosted domain; the repository's Pages settings are authoritative.

### Publication verification

The Pages workflow writes `publishing-release.json` into each deployment with the repository, branch and full commit SHA. After deployment, `scripts/verify_publication.py` requires that exact identity from the custom domain over validated HTTPS and through the HTTPS www redirect, then compares the live homepage, CV, Book, Blog, student AI course and PhD workshop against the deployed Git objects. It rejects redirects to another host or HTTP and retries while CDN caches update. Failure makes the workflow fail even when GitHub accepted the deployment.

To verify a release manually from a checkout containing that commit, run `python scripts/verify_publication.py <full-main-commit-sha>`. Also inspect the specific changed routes and their assets. Do not call a release live from the deployment step alone.

Before transfer, the destination's key pages and shared stylesheet matched `main` byte-for-byte at its GitHub Pages address, and every file path in the old repository's current default branch existed in this repository.

## Before Pushing New Website Work

1. Confirm the route belongs in this repo.
2. Keep the canonical source in `other/email_app/email_drafter`.
3. Mirror only the files that should be public.
4. Then commit and push from this website repo, not from the shared `AI` checkout.
