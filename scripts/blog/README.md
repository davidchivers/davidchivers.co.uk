# Blog source and publishing

The canonical source is this repository, `davidchivers/davidchivers.co.uk`.
The generated public section is `/blog/`; the homepage's Blog link points there.

## Rebuild

Python 3 with BeautifulSoup (`beautifulsoup4`) is needed to rebuild; the validator
also uses Pillow to decode-check images:

```powershell
$env:PYTHONUTF8='1'
python scripts/blog/build.py
python scripts/blog/validate.py
```

The build is offline. `source/blogger-feed.json` is the unchanged public Blogger
export captured on 6 October 2026, containing all 48 published posts. Reviewed
text edits live in `corrections.txt`, not in generated HTML. Each replacement must
match its original source; a mismatch fails the build. `build.py` owns the
templates, URL mapping and image descriptions. The CSS and JavaScript under
`blog/assets/` are maintained directly.

`CHANGES.md` lists every text correction, URL repair, unresolved reference and
the scope of editorial review. Machine-readable source inventories and reports
record the original image URLs, local filenames and link-check results.

To recheck external references and download image sources, install `requests`
and `Pillow` and run `python scripts/blog/audit_sources.py`. Recheck and review
the results before rebuilding: a block or paywall is not a dead link. Do not
overwrite the source feed with a new export as part of an ordinary rebuild.

## Design

- Static HTML: every article and index link works without JavaScript.
- Economy Class is grouped by year, newest first, with dated article previews.
  Search covers titles and previews; readers can sort newest/oldest/A–Z and
  select a year. All articles are available without JavaScript, with year links
  jumping to their sections. A–Z uses a single alphabetical list.
- The desktop sidebar includes a simple year list, selected reading and RSS.
  On small screens the year list folds away above the feed. Article text is unchanged.
- The title, footer and RSS use Economy Class. There are no taglines, topic
  labels or introductory article-count/date-range badges.
- Device colour preference by default; a manual light/dark choice is saved
  locally, with a storage-disabled fallback. No trackers or external fonts.
- Images served locally; tables scroll within the article on narrow screens.
- `/blog/feed.xml` is a conventional chronological RSS feed;
  `/blog/sitemap.xml` lists the index and all 48 articles.
- The public blog does not link back to the old Blogger site or load assets
  from it. The preserved source export supports offline rebuilding even if
  the old blog is deleted. The migration does not change Blogger settings,
  create redirects there, or import comments.

## Deployment

Use a feature branch and pull request. The canonical repository deploys `main`
with `.github/workflows/static.yml`. At the start of this migration, deployment
metadata confirmed that `thomshutt/davidchivers` still serves the custom domain
from `master`. Mirror **only** `blog/` and the homepage/research-page Blog-link changes to that
temporary bridge using its own pull request. Do not copy unrelated site files
or alter domain settings. Verify `https://davidchivers.co.uk/blog/` after Pages
reports successful deployment; the canonical workflow alone is not proof.
