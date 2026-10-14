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
   staff edits using that project's instructions and reconcile them into the QMD before rendering without the optional editor. Student releases omit browser editing controls; the sync script rejects editor-enabled output.
2. Render the affected project with Quarto. For example, from
   `E:/AI/teaching/induction_quarto`, run
   `& 'E:/AI_tools/quarto-1.10.18/bin/quarto.cmd' render induction.qmd`.
3. From a clean worktree of `davidchivers/davidchivers.co.uk`, run
   `python teaching/sync_slides.py E:/AI`. This copies only selected rendered
   files, adds `noindex`, and records both source and published SHA-256 hashes
   in `manifest.json`. It also preserves `noindex` on the collection index.
   For Macro Applications, regenerate the matching PowerPoint and PDF downloads
   first, following the canonical project's README. The sync script verifies
   their source-HTML and file hashes and rejects stale exports.
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

The published collection contains twelve current presentations, two seminar question sheets and two unlisted answer sheets. The separate
staff slide-creation guide remains at `/slides/` and is not part of this collection.
Each Macro lecture has one **Download** link throughout the deck, saving PowerPoint,
with no format menu or PDF option. Its stable download target is
`https://github.com/davidchivers/davidchivers.co.uk/releases/download/macro-lecture-downloads/lecture_N.pptx`
for the corresponding lecture. GitHub serves these as attachments, avoiding
the extra Office preview seen with the ordinary website file links. The
`lecture-downloads.yml` workflow automatically updates them when new exports are
published, using `teaching/publish_download_assets.py` to verify checksums before
and after upload. Keep the release tag and filenames unchanged. These links are
public and require no student GitHub account. A previously downloaded copy does
not change; students download again to obtain the current version. Existing
`macro-applications/downloads/lecture_N.pptx` and `.pdf` URLs remain available.
Both preserve the current slide
appearance as static artwork. PowerPoint users can add notes; the editable
master and interactive version remain the Quarto source and HTML respectively.
Check the **Publish lecture downloads** workflow as well as Pages after each
update. On 14 October 2026 the release PowerPoint link saved a matching local
file directly in desktop Edge; the native Blackboard app remains untested.
Blackboard retains one HTML link per lecture. On 14 October 2026 David tested
the repaired download successfully and requested the shorter **Download** label.
The five temporary separate PowerPoint links were removed at his request;
Lectures 1–2 remain visible and Lectures 3–5 hidden. Keep this single-link layout
unless asked to change it.
Earlier source
PowerPoints, development previews, QA files and build folders remain outside
this public collection. The sync step adds search metadata without altering slide content. Keep existing Blackboard URLs unchanged when replacing a deck.

## Political Economy and seminar handouts

Political Economy has five HTML lectures at `/teaching/political-economy/lecture_N.html`, with its index at `/teaching/political-economy/`. Editable sources are under `teaching/political_economy_quarto` in the AI workspace. All 120 source slides remain in order.

The two Brexit seminar question sheets are scrolling HTML at `/teaching/macro-applications/seminars/seminar_N.html`, from `teaching/macro_seminars_quarto`. On 12 October 2026 the user authorised public answer pages with addresses that are difficult to guess. The two answer destinations are fixed opaque filenames in `DECKS` in `sync_slides.py`; preserve these paths on future updates. On 13 October the user requested question and answer links on the Teaching page and the course collections. They still carry `noindex`, and their Blackboard entries remain hidden until the user requests release there. Copy only explicitly selected outputs.

The Political Economy section now lists all five lectures individually and links to four seminar placeholders: questions and answers for each of two seminars. The placeholders are maintained in `political_economy_seminars_quarto/publication_placeholders/`, with stable destinations recorded in that project's `publication.json` and this site's sync script. The local seminar drafts and tutor notes are not published. Replace the placeholders at the same URLs only when their contents are ready and approved. All nine Political Economy Blackboard links are to be placed in the David section and kept hidden.

These seminar question pages are HTML. Seminar 1 links to three original reading PDFs under `macro-applications/seminars/readings/`, opening each in a new tab. The wider module Talis link remains. These are reading papers, not PDF exports of the handout; `READINGS` in the sync script preserves their explicit publication allow-list. Existing Brexit lecture downloads remain unchanged. This is a light-touch source conversion; preserved maths and references have not had an independent full audit.
