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
5. Publish only to `davidchivers/davidchivers.co.uk`. The custom domain moved
   to this repository on 26 October 2026; `thomshutt/davidchivers` no longer
   has its custom-domain association. Do not mirror files or create PRs there.
6. Verify the workflow's HTTPS release check and the changed public URL.
   See `SITE_MAP.md` for current hosting configuration. Future updates use the same
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

### Lecture 3 revision, 19 October 2026

Lecture 3 now has 32 slides, with larger vector diagrams and aligned welfare
and integration sequences. The reaction functions and equilibrium graph share
one slide; the old l3-s09 anchor redirects to l3-s10. Only Lecture 3 HTML and
its PowerPoint export were replaced. The PowerPoint contains static slide
artwork and notes, matching the reviewed HTML captures. The existing Download
control still uses the stable lecture_3.pptx release asset. The legacy Lecture 3
PDF was not rebuilt or selected in the download control. Blackboard links,
visibility and other lectures are unchanged.

### Lecture 3 layout follow-up, 19 October 2026

The context, welfare question and migration preview now use clearer layouts.
Demand functions are grouped by market, and equations align beneath their
headings. Welfare diagrams give area B more room; the three integration panels
retain identical geometry with equilibrium and curve labels separated.
Industrial restructuring answers reveal below each question with the forward
controls and are all visible in the PowerPoint. All 32 slide captures and the
rendered export were checked. The stable HTML and Download links are preserved;
no other lecture, legacy PDF or Blackboard setting changed.

## Political Economy and seminar handouts

Political Economy has five HTML lectures at `/teaching/political-economy/lecture_N.html`, with its index at `/teaching/political-economy/`. Editable sources are under `teaching/political_economy_quarto` in the AI workspace. All 120 source slides remain in order.

The two Brexit seminar question sheets are scrolling HTML at `/teaching/macro-applications/seminars/seminar_N.html`, from `teaching/macro_seminars_quarto`. On 12 October 2026 the user authorised public answer pages with addresses that are difficult to guess. The two answer destinations are fixed opaque filenames in `DECKS` in `sync_slides.py`; preserve these paths on future updates. On 13 October the user requested question and answer links on the Teaching page and the course collections. They still carry `noindex`, and their Blackboard entries remain hidden until the user requests release there. Copy only explicitly selected outputs.

The Political Economy section now lists all five lectures individually and links to four seminar placeholders: questions and answers for each of two seminars. The placeholders are maintained in `political_economy_seminars_quarto/publication_placeholders/`, with stable destinations recorded in that project's `publication.json` and this site's sync script. The local seminar drafts and tutor notes are not published. Replace the placeholders at the same URLs only when their contents are ready and approved. All nine Political Economy Blackboard links are to be placed in the David section and kept hidden.

These seminar question pages are HTML. Seminar 1 links to three original reading PDFs under `macro-applications/seminars/readings/`, opening each in a new tab. The wider module Talis link remains. These are reading papers, not PDF exports of the handout; `READINGS` in the sync script preserves their explicit publication allow-list. Existing Brexit lecture downloads remain unchanged. This is a light-touch source conversion; preserved maths and references have not had an independent full audit.

### Lecture 3 teaching polish and shared previews, 19 October 2026

The welfare and restructuring questions now have explicit click-to-reveal
buttons. Welfare areas respond to hover, click and keyboard focus. Equations,
E-prime and A labels are spaced clearly, and the unexplained loss marker has
been removed. The empirical slide uses the European Commission's 2024 report
(data for 2000–2019), with its measure and causal limitation stated.

All five lectures share the closing-preview layout and preparation prompts;
Lecture 5 closes with revision. Chapter references give the chapter title and
identify the seventh edition for chapter numbers. There are now 24, 26, 32,
28 and 30 slides respectively. All five PowerPoints were rebuilt and rendered,
with disclosures open in these static student copies. Existing HTML and
Download URLs, the old l3-s09 redirect, and Blackboard visibility are preserved.

This selected publication used the canonical project's
`scripts/publish_teaching_polish.py` after its capture and validation checks.
It updates only the five HTML/PowerPoint pairs and their manifest records.
The legacy PDFs were not selected or rebuilt; a full sync requiring current
PDFs is therefore inappropriate for this revision.

### PhD workshop slides, 23 October 2026

The reviewed 43-slide workshop is published at the existing `ai-course.html`
address, with its income/substitution interactive example alongside it. The
opening now includes the silent Will Smith comparison, the revised LLM
explanation and the earlier learning section. The single-slide tasks section
was removed. The current PhD exercises are embedded in the slides.

The canonical source is `E:/AI/teaching/ai_workshop/revealjs/`. This scoped
publication copies only the two HTML files, adds noindex and retargets the
interactive example's return link to `ai-course.html`. The manifest records
source and published hashes. The videos stream from their existing hosts.

## PhD ending revision: 23 October 2026

The 41-slide workshop now ends with adapting the tools to research, AI writing
and discussion. The repeated threshold and dated-advice slides are removed;
risk-preference detail remains in the earlier notes. The appendix has a linked
reference index. Source order, internal targets and changed layouts checked.
