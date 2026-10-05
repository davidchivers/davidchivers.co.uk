# Teaching slides

Public, unlisted collection: https://davidchivers.co.uk/teaching/

Every HTML page in this collection carries a robots `noindex` tag, including
each presentation and the Macro lecture index. Keep this collection out of
public website navigation and sitemaps. Do not block it in `robots.txt`:
search engines need to crawl the HTML to see `noindex`.

Anyone with a link can still open or share it, and the public GitHub repository
remains browsable. Search engines apply the rule when they next crawl the page;
this is a discovery preference, not a restriction on access.

Keep these paths unchanged when replacing slide contents. Blackboard links
point to the published HTML, not a GitHub file preview or commit-specific URL.

| Slides | Stable URL path | Editable source in the AI workspace |
| --- | --- | --- |
| Economics induction | `/teaching/induction.html` | `teaching/induction_quarto/induction.qmd` and companion staff edits |
| Macro Applications, lectures 1–5 | `/teaching/macro-applications/lecture_1.html` through `lecture_5.html` | `teaching/macro_applications_quarto/lecture_N.qmd` |
| Macro lecture collection | `/teaching/macro-applications/` | `teaching/macro_applications_quarto/index.qmd` |
| AI for Economic Research | `/teaching/ai-course.html` | `teaching/ai_workshop/revealjs/ai_course.qmd` |

## Update and publish

1. Edit the canonical Quarto project under `E:/AI/teaching/`. Import any saved
   staff edits using that project's instructions before rendering.
2. Render the affected project with Quarto. For example, from
   `E:/AI/teaching/induction_quarto`, run
   `& 'E:/AI_tools/quarto-1.10.18/bin/quarto.cmd' render induction.qmd`.
3. From a clean worktree of `davidchivers/davidchivers.co.uk`, run
   `python teaching/sync_slides.py E:/AI`. This copies only selected rendered
   files, adds `noindex`, and records both source and published SHA-256 hashes
   in `manifest.json`. It also preserves `noindex` on the collection index.
4. Check the changed presentation and scoped Git diff. Commit only intended
   changes and publish through a feature branch and pull request to `main`.
   The existing GitHub Pages deployment publishes the merged files.
5. While the custom domain still uses the temporary `thomshutt/davidchivers`
   bridge, mirror the same `teaching/` files to its `master` branch through a
   pull request. Do not assume a canonical Pages run updates the custom domain.
6. Verify the public URL after deployment. Future updates use the same
   Blackboard link; Pages deployment and browser caching may take a few minutes.

The induction link belongs immediately below **Programme Director Welcome
Video - Start Here** in **Economics Induction (26/27)** on Durham Blackboard,
with the visible title **Induction slides**.

The published collection contains seven current presentations. The separate
staff slide-creation guide remains at `/slides/` and is not part of this collection.
Earlier source
PowerPoints, development previews, QA files and build folders remain outside
this public collection. Publishing changes only search metadata; slide content
and existing Blackboard URLs stay unchanged.
