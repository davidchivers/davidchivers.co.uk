# Site Map

This file is the quick orientation note for the public website repo.

## Repo

- Local repo: `C:\Users\Dave_\OneDrive\Documents\GitHub\davidchivers.co.uk`
- Remote: `https://github.com/davidchivers/davidchivers.co.uk.git`
- Branch: `main`

## What This Repo Appears To Own

Confirmed from the local repo contents:

- `/` via `index.html`
- `/papers.html`
- `/results.html`
- `/alcohol.html`
- `/ai_install/`
- `/countdown/`
- `/drafter/`
- `/email_app/`
- `/metal_map/`
- `/wine_bar/`

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
  - `C:\Users\Dave_\AI\other\email_app\email_drafter\`
- This website repo is the publish target copy for the public site:
  - `C:\Users\Dave_\OneDrive\Documents\GitHub\davidchivers.co.uk\drafter\`

Recommended rule:

- Edit the drafter in `other/email_app/email_drafter`
- Mirror approved files into this repo when publishing

## Legacy Repo

- Legacy migration source:

- `C:\Users\Dave_\AI\_playground\sandbox_repos\davidchivers_site`
- remote `https://github.com/thomshutt/davidchivers.git`

Current rule:

- `davidchivers/davidchivers.co.uk` is the canonical website repo
- `thomshutt/davidchivers` is only a temporary Pages bridge until the custom domain is moved
- do not treat the legacy repo as the long-run deployment authority

## Before Pushing New Website Work

1. Confirm the route belongs in this repo.
2. Keep the canonical source in `other/email_app/email_drafter`.
3. Mirror only the files that should be public.
4. Then commit and push from this website repo, not from the shared `AI` checkout.
