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

One hosting prerequisite remains unresolved. The GitHub Pages API checked on 23 October still assigned `davidchivers.co.uk` to the old repository; this repository's `cname` was null. Assigning the domain here returned HTTP 400, `Invalid cname`, because the domain was already taken. David's login has admin rights here but only write access on the old repository. Its owner must release the domain under Settings > Pages before it can be assigned here. Do not delete or disable the live site as a substitute for this transfer.

After the domain is released, assign `davidchivers.co.uk` in this repository's Pages settings, deploy `main`, and verify HTTPS and the live routes. Both repositories use Actions deployments, so a `CNAME` file alone does not configure the domain. Until the transfer is verified, a successful deployment at the GitHub backup address does not prove the custom domain has received a release.

## Before Pushing New Website Work

1. Confirm the route belongs in this repo.
2. Keep the canonical source in `other/email_app/email_drafter`.
3. Mirror only the files that should be public.
4. Then commit and push from this website repo, not from the shared `AI` checkout.
