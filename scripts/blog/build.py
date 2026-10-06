"""Rebuild the static blog from the preserved public Blogger feed and reviewed edits."""
from collections import Counter
from datetime import datetime
from html import escape
import json
from pathlib import Path
import re
from urllib.parse import urlparse, urlunparse
from bs4 import BeautifulSoup, Comment, NavigableString

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
BASE = 'https://davidchivers.co.uk'
feed = json.loads((HERE / 'source/blogger-feed.json').read_text(encoding='utf-8'))['feed']
posts = []
for entry in feed['entry']:
    url = next(x['href'] for x in entry['link'] if x['rel'] == 'alternate')
    posts.append(dict(title=entry['title']['$t'].strip(), published=entry['published']['$t'],
                      original_url=url, slug=url.rsplit('/', 1)[-1][:-5], html=entry['content']['$t']))
assert len(posts) == int(feed['openSearch$totalResults']['$t']), 'Incomplete Blogger export'
assert len({p['slug'] for p in posts}) == len(posts), 'Duplicate post slugs'
media = json.loads((HERE / 'reports/media.json').read_text(encoding='utf-8'))
links = json.loads((HERE / 'reports/links.json').read_text(encoding='utf-8'))
edits = []
for line in (HERE / 'corrections.txt').read_text(encoding='utf-8').splitlines():
    if line and not line.startswith('#'):
        key, before, after = line.split('|', 2)
        edits.append((key, before, after))

ALT = [
    'UK election turnout by age, 1970–2017: older age groups generally have higher turnout than 18–34-year-olds.',
    'US presidential election turnout by age: turnout among people aged 60 and over is higher than among 18–29-year-olds.',
    'Age groups among parish councillors: the share aged 60 and over is largest, and the share under 40 is smallest.',
    'Midwit meme: both ends of the bell curve say “build more housing”, while the middle gives a complicated objection.',
    'Midwit meme: both ends say buying local combats global warming; the middle notes that transport is a small share of food emissions.',
    'Midwit meme: both ends laugh at midwits, while the middle argues that midwits are being treated unfairly.',
    'Ben Golub on queuing: with random arrivals at 5.8 per hour and ten-minute service, one teller gives a five-hour expected wait; two give three minutes.',
    'A Tetris board with a backlog of stacked blocks, illustrating how a queue becomes harder to clear.',
    'ICU rejection rate rises sharply as bed utilisation approaches full capacity, especially above about 80–85%.',
    'Trolley problem illustration: a lever switches a tram between tracks, each with a person tied to it.',
    'Confusion matrix illustrated with pregnancy tests, showing true positives, false positives, false negatives and true negatives.',
    'A man holding a banana, used in the example of renaming a banana an orange.',
    'Historical economics citation ranking with Nicholas Cox in 35th place, just below Paul Krugman and Ben Bernanke.',
    'Five-a-side football pitch divided into ten player boxes, separated by two-metre gaps; red and blue dots mark the two teams.'
]
assert len(ALT) == len(media)
media_map = {}
for item, alt in zip(media, ALT):
    assert item['status'] == 'saved', item
    item['alt'] = alt
    media_map[item['src']] = item
    if item.get('parent'):
        media_map[item['parent']] = item

post_map = {urlparse(p['original_url']).path: '/blog/' + p['slug'] + '/' for p in posts}
replacements = {}
for item in links:
    old, new = item['url'], item.get('final_url', item['url'])
    # Only use observed, successful redirects to content, not block or login pages.
    if item['status'] == 200 and old != new and not any(x in new for x in ('accounts.', '/login', '/signin')):
        replacements[old] = new.split('#axzz')[0]
PAPER_OLD = 'https://pubs.asahq.org/anesthesiology/article/100/5/1271/6428/Queuing-Theory-Accurately-Models-the-Need-for'
PAPER_NEW = 'https://www.dcscience.net/mcmanus-stochastic-beds-2004.pdf'
replacements[PAPER_OLD] = PAPER_NEW
replacements['https://www.youtube.com/watch?v=h5SKpItRY9k'] = 'https://www.nasa.gov/wp-content/uploads/2015/01/590331main_ringtone_smallStep.mp3'
DEAD = 'http://kill-or-cure.herokuapp.com/'
fixes, link_fixes, issues, preservation = [], [], [], []

def plain(value):
    return re.sub(r'\s+', ' ', value).strip()

def replace_text(soup, before, after):
    """Replace reviewed text even when Word/Blogger splits it across inline tags."""
    nodes = list(soup.find_all(string=lambda s: not isinstance(s, Comment)))
    text = ''.join(str(n) for n in nodes)
    pattern = r'\s+'.join(re.escape(part) for part in before.split())
    matches = list(re.finditer(pattern, text))
    if not matches:
        raise ValueError('Correction does not match source: ' + before)
    # Work backwards so offsets before each match remain unchanged.
    for match in reversed(matches):
        current_nodes = list(soup.find_all(string=lambda s: not isinstance(s, Comment)))
        offset = 0
        inserted = False
        for node in current_nodes:
            value = str(node)
            end = offset + len(value)
            if end > match.start() and offset < match.end():
                lo, hi = max(0, match.start() - offset), min(len(value), match.end() - offset)
                node.replace_with(value[:lo] + (after if not inserted else '') + value[hi:])
                inserted = True
            offset = end
    return len(matches)

def clean_html(soup):
    # Word's pre-wrapped text contains real paragraph breaks rather than <br>s.
    for node in list(soup.find_all(string=True)):
        if isinstance(node, Comment):
            node.extract()
        elif any('pre-wrap' in t.get('style', '') for t in node.parents if t.name):
            value = str(node)
            if re.search(r'\n\s*\n', value):
                parts = re.split(r'\n\s*\n', value)
                for i, part in enumerate(parts):
                    if i:
                        node.insert_before(soup.new_tag('br'))
                        node.insert_before(soup.new_tag('br'))
                    node.insert_before(NavigableString(part))
                node.extract()
    for tag in list(soup.find_all(['script', 'style', 'iframe', 'object', 'embed', 'colgroup', 'col'])):
        tag.decompose()
    for tag in list(soup.find_all(['span', 'font', 'o:p'])):
        tag.unwrap()
    for tag in soup.find_all(True):
        allowed = {'href', 'id', 'name', 'src', 'alt', 'width', 'height', 'colspan', 'rowspan'}
        tag.attrs = {k: v for k, v in tag.attrs.items() if k in allowed}
        if tag.name == 'strike':
            tag.name = 's'
        if tag.name in ('h1', 'h3', 'h4'):
            tag.name = 'h2'
    for node in list(soup.find_all(string=True)):
        node.replace_with(re.sub(r'\s+', ' ', str(node).replace('\xa0', ' ')))
    # Unwrap layout containers, retaining leaf paragraphs and every inline emphasis.
    for div in reversed(list(soup.find_all('div'))):
        if div.find(['div', 'p', 'h2', 'ul', 'ol', 'table', 'blockquote']):
            div.unwrap()
        else:
            div.name = 'p'
    # Some Blogger posts have bare text between image containers. Give that text
    # semantic paragraphs too, before splitting the original blank-line breaks.
    blocks = ['p', 'h2', 'ul', 'ol', 'table', 'blockquote']
    for p in list(soup.find_all('p')):
        if p.find(blocks):
            p.unwrap()
    pending = []
    for node in list(soup.contents):
        if getattr(node, 'name', None) in blocks:
            if pending:
                para = soup.new_tag('p')
                node.insert_before(para)
                for child in pending:
                    para.append(child)
                pending = []
        else:
            pending.append(node)
    if pending:
        para = soup.new_tag('p')
        soup.append(para)
        for child in pending:
            para.append(child)
    for p in list(soup.find_all('p')):
        pieces = re.split(r'(?:<br\s*/?>\s*){2,}', p.decode_contents())
        if len(pieces) > 1:
            for piece in pieces:
                new = soup.new_tag('p')
                for child in list(BeautifulSoup(piece, 'html.parser').contents):
                    new.append(child)
                p.insert_before(new)
            p.decompose()
    for p in list(soup.find_all(['p', 'h2', 'blockquote'])):
        while p.contents and (str(p.contents[-1]).strip() == '' or getattr(p.contents[-1], 'name', None) == 'br'):
            p.contents[-1].extract()
        while p.contents and (str(p.contents[0]).strip() == '' or getattr(p.contents[0], 'name', None) == 'br'):
            p.contents[0].extract()
        if not p.get_text(strip=True) and not p.find('img'):
            p.decompose()
            continue
        if p.name == 'p' and not p.find_parent(['td', 'th', 'blockquote']):
            b = p.find(['b', 'strong'], recursive=False)
            if b and plain(b.get_text()) == plain(p.get_text()) and 0 < len(p.get_text().split()) < 20:
                p.name = 'h2'
                b.unwrap()
    # The exponential-growth article's three numeric tables have real header rows.
    for i, table in enumerate(soup.find_all('table')):
        caption = soup.new_tag('caption')
        caption.string = ['Days 1–5', 'Days 6–10', 'Days 11–20'][i]
        table.insert(0, caption)
        for cell in table.find('tr').find_all('td'):
            cell.name = 'th'
            cell['scope'] = 'col'
        wrap = soup.new_tag('div', attrs={'class': 'table-wrap', 'tabindex': '0', 'role': 'region', 'aria-label': caption.string})
        table.wrap(wrap)
    return soup

def page(title, path, description, main, extra=''):
    return f'''<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{escape(title)} · David Chivers</title>
<meta name="description" content="{escape(description, quote=True)}">
<link rel="canonical" href="{BASE}{path}">
<meta property="og:title" content="{escape(title, quote=True)}">
<meta property="og:description" content="{escape(description, quote=True)}">
<meta property="og:url" content="{BASE}{path}">
<link rel="icon" href="/favicon.ico">
<link rel="alternate" type="application/rss+xml" title="Economy Class · David Chivers" href="/blog/feed.xml">
<script src="/blog/assets/theme.js"></script>
<link rel="stylesheet" href="/blog/assets/blog.css?v=3">
<script defer src="/blog/assets/blog.js?v=3"></script>
{extra}
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
<a class="brand" href="/">David Chivers</a>
<nav class="header-actions" aria-label="Main navigation"><a href="/blog/">Blog</a>
<button class="theme-toggle" type="button" aria-label="Switch to dark mode" hidden>
<svg class="theme-icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M20.5 13A8.5 8.5 0 0 1 11 3.5 8.5 8.5 0 1 0 20.5 13Z"/></svg>
<span class="theme-label">Dark mode</span></button></nav>
</header>
{main}
<footer class="site-footer"><span>Economy Class · David Chivers</span><span><a href="/">Website</a> &nbsp; / &nbsp; <a href="/blog/feed.xml">RSS</a></span></footer>
</body>
</html>
'''

for number, post in enumerate(posts, 1):
    soup = BeautifulSoup(post['html'], 'html.parser')
    for key, before, after in edits:
        if key == str(number):
            n = replace_text(soup, before, after)
            fixes.append(dict(post=number, title=post['title'], before=before, after=after, occurrences=n, kind='body'))
        elif key == 'T' + str(number):
            assert before in post['title'], (number, before)
            post['title'] = post['title'].replace(before, after)
            fixes.append(dict(post=number, title=post['title'], before=before, after=after, occurrences=1, kind='title'))
    before_cleanup = re.sub(r'\s+', '', soup.get_text())
    soup = clean_html(soup)
    # Captions are the only text inserted during layout cleanup.
    clean_text = BeautifulSoup(str(soup), 'html.parser')
    for caption in clean_text.find_all('caption'):
        caption.decompose()
    assert before_cleanup == re.sub(r'\s+', '', clean_text.get_text()), f'Text lost in post {number}'
    for img in soup.find_all('img'):
        item = media_map[img['src']]
        img.attrs = {k: item[k] for k in ('alt', 'width', 'height')}
        img['src'] = item['local']
        img['loading'] = 'lazy'
        img['decoding'] = 'async'
    for a in soup.find_all('a', href=True):
        old = a['href']
        parsed = urlparse(old)
        if parsed.hostname == 'blogger.googleusercontent.com' and not a.get_text(strip=True) and not a.find(['img', 'svg']):
            a.decompose()
            continue
        new = old
        if parsed.hostname and parsed.hostname.startswith('davidchivers.blogspot.'):
            new = post_map.get(parsed.path, '/blog/' if parsed.path in ('', '/') else old)
            if new == old:
                issues.append(dict(post=number, url=old, reason='Unmatched original-blog link'))
            elif parsed.fragment:
                new += '#' + parsed.fragment
        elif old in media_map:
            new = media_map[old]['local']
        elif old in replacements:
            new = replacements[old]
        elif old == DEAD:
            note = soup.new_tag('span', attrs={'class': 'unavailable-link'})
            note.string = ' (original site unavailable)'
            a.insert_after(note)
            a.unwrap()
            issues.append(dict(post=number, url=old, reason='404: defunct site; no verified replacement. Text retained and labelled.'))
            continue
        if new != old:
            link_fixes.append(dict(post=number, before=old, after=new))
            a['href'] = new
        if urlparse(new).scheme not in ('', 'http', 'https', 'mailto'):
            issues.append(dict(post=number, url=new, reason='Unsupported link scheme removed'))
            a.unwrap()
    post['body'] = str(soup)
    post['path'] = '/blog/' + post['slug'] + '/'
    post['description'] = plain(soup.get_text(' '))[:180].rsplit(' ', 1)[0] + '…'
    date = datetime.fromisoformat(post['published'])
    display_date = f'{date.day} {date.strftime("%B %Y")}'
    structured = json.dumps({'@context': 'https://schema.org', '@type': 'BlogPosting',
                             'headline': post['title'], 'datePublished': post['published'],
                             'author': {'@type': 'Person', 'name': 'David Chivers'},
                             'url': BASE + post['path']}, ensure_ascii=False).replace('<', '\\u003c')
    main = f'''<main id="main" class="article-main">
<a class="back-link" href="/blog/">← All articles</a>
<article>
<header class="article-header"><h1>{escape(post['title'])}</h1>
<p class="article-meta">David Chivers · Published <time datetime="{date.date()}">{display_date}</time></p></header>
<div class="article-body">{post['body']}</div>
</article>
<nav class="article-end" aria-label="Article navigation"><a href="/blog/">← All articles</a></nav>
</main>'''
    target = ROOT / post['path'].lstrip('/') / 'index.html'
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(page(post['title'], post['path'], post['description'], main,
                           '<meta property="og:type" content="article">\n<script type="application/ld+json">' + structured + '</script>'), encoding='utf-8')
    preservation.append(dict(post=number, title=post['title'], url=post['path'],
                             text_preserved_after_reviewed_edits=True, images=len(soup.find_all('img')),
                             tables=len(soup.find_all('table'))))

ordered = sorted(posts, key=lambda p: p['published'], reverse=True)
excerpt_starts = {
    'no-qe-did-not-lead-to-inflation': 'When QE (Quantitative Easing) was proposed in 2009',
    'the-ref-perfect-example-of-issues-with': 'I really dislike rankings.',
    'infinite-growth-on-finite-planet': 'Do you think we can get infinite growth on a finite planet?',
    'who-is-nick-j-cox-and-why-is-he-most': 'Science is a process of discovery.',
    'how-ideas-spread-why-econ101ism-is': 'If a significant proportion of people know these misquotes exist',
    'whats-in-name-importance-of-names-in': 'The reason why names are important',
    'journalism-which-misrepresents-academic': 'Although the study reports positive effects of attending nursery',
}
cards_by_year = {}
for p in ordered:
    body = BeautifulSoup(p['body'], 'html.parser')
    # Keep the author's own opening words, without introducing new claims.
    for deleted in body.find_all(['s', 'del']):
        deleted.decompose()
    opening = plain(body.get_text(' ', strip=True))
    opening = re.sub(r'\s+([,.;:!?])', r'\1', opening)
    excerpt_source = opening
    if p['slug'] in excerpt_starts:
        start = excerpt_starts[p['slug']]
        assert start in opening, ('Excerpt no longer matches article', p['slug'])
        excerpt_source = opening[opening.index(start):]
    sentences = re.split(r'(?<=[.!?])\s+', excerpt_source)
    excerpt = ' '.join(sentences[:2])
    if len(excerpt) < 90:
        excerpt = ' '.join(sentences[:3])
    if len(excerpt) > 280:
        excerpt = excerpt[:260].rsplit(' ', 1)[0].rstrip(' ,;:') + '…'
    p['excerpt'] = excerpt
    date = datetime.fromisoformat(p['published'])
    minutes = max(1, (len(opening.split()) + 224) // 225)
    first_image = body.find('img')
    thumbnail = (f'<img class="post-thumbnail" src="{first_image["src"]}" alt="" loading="lazy" decoding="async" width="144" height="112">' if first_image else '')
    cards_by_year.setdefault(date.year, []).append(f'''<li class="post-card" data-title="{escape(p['title'], quote=True)}" data-date="{date.isoformat()}" data-year="{date.year}">
<article><div class="post-meta"><time datetime="{date.date()}">{date.day} {date.strftime('%B %Y')}</time><span class="reading-time">{minutes} min read</span></div>
<div class="post-preview"><div><h3><a href="{p['path']}">{escape(p['title'])}</a></h3><p class="post-excerpt">{escape(excerpt)}</p></div>{thumbnail}</div></article></li>''')
years = sorted(Counter(datetime.fromisoformat(p['published']).year for p in posts).items(), reverse=True)
year_sections = ''.join(f'<section class="year-group" id="year-{year}" data-year="{year}" aria-labelledby="heading-{year}"><h2 class="year-heading" id="heading-{year}">{year}</h2><ul class="post-list">{"".join(cards_by_year[year])}</ul></section>' for year, _ in years)
year_links = ''.join(f'<li><a href="#year-{year}" data-year="{year}">{year}</a></li>' for year, _ in years)
selected_slugs = ['infinite-growth-on-finite-planet', 'the-problem-with-being-anti-waste', 'misleading-words']
selected = ''.join(f'<li><a href="{p["path"]}">{escape(p["title"])}</a></li>' for slug in selected_slugs for p in posts if p['slug'] == slug)
main = f'''<main id="main" class="index-main">
<header class="blog-heading"><h1>Economy Class</h1></header>
<div class="blog-layout">
<section class="article-feed" id="articles" aria-label="Articles">
<div class="tools" hidden><div class="search-wrap"><label class="visually-hidden" for="search">Search articles</label><input id="search" type="search" placeholder="Search the blog…" autocomplete="off"></div>
<div class="sort-wrap"><label for="sort">Sort by</label><select id="sort"><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="az">Title A–Z</option></select></div></div>
<p class="post-count visually-hidden" role="status" aria-live="polite">{len(posts)} articles, grouped by year</p>
<button class="clear-filters" type="button" hidden>Show all articles</button>
<div class="year-groups">{year_sections}</div>
<section class="alphabetical-results" hidden><h2 class="year-heading">A–Z</h2><ul class="post-list" id="alphabetical-list"></ul></section>
<div class="empty-state" hidden><h3>No articles found</h3><p>Try a different search or year.</p></div>
</section>
<aside class="blog-sidebar" aria-label="Explore the blog">
<details class="browse-panel" open><summary>Years</summary><nav class="browse-content" aria-label="Years"><ul class="year-links"><li><a href="#articles" data-year="" aria-current="true">All years</a></li>{year_links}</ul></nav></details>
<section class="selected-posts"><h2>A few to start with</h2><ul>{selected}</ul></section>
<section class="rss-note"><h2>Follow along</h2><p>New writing, delivered to your feed reader.</p><a href="/blog/feed.xml">Subscribe via RSS <span aria-hidden="true">↗</span></a></section>
</aside></div></main>'''
(ROOT / 'blog/index.html').write_text(page('Economy Class', '/blog/', 'Economy Class, the blog by David Chivers. Browse the archive by year.', main, '<meta property="og:type" content="website">'), encoding='utf-8')
rss_items = []
for p in posts:
    date = datetime.fromisoformat(p['published']).strftime('%a, %d %b %Y %H:%M:%S %z')
    rss_items.append(f'<item><title>{escape(p["title"])}</title><link>{BASE}{p["path"]}</link><guid>{BASE}{p["path"]}</guid><pubDate>{date}</pubDate><description>{escape(p["description"])}</description></item>')
(ROOT / 'blog/feed.xml').write_text('<?xml version="1.0" encoding="utf-8"?>\n<rss version="2.0"><channel><title>Economy Class · David Chivers</title><link>' + BASE + '/blog/</link><description>Economy Class, the blog by David Chivers.</description><language>en-GB</language>' + ''.join(rss_items) + '</channel></rss>\n', encoding='utf-8')
(ROOT / 'blog/sitemap.xml').write_text('<?xml version="1.0" encoding="utf-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + ''.join(f'<url><loc>{BASE}{path}</loc></url>' for path in ['/blog/'] + [p['path'] for p in posts]) + '</urlset>\n', encoding='utf-8')
for name, data in [('corrections', fixes), ('link-fixes', link_fixes), ('unresolved', issues), ('preservation', preservation)]:
    (HERE / 'reports' / (name + '.json')).write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
lines = ['# Blog migration: fixes and checks', '', 'Source: https://davidchivers.blogspot.com/', '',
         'Migrated 48 of 48 published posts to `/blog/`. Economy Class shows dated article previews grouped by year, newest first, with search, optional title sorting and a year archive. Light/dark mode follows the device initially and remembers a manual choice.', '',
         f'## Text corrections ({sum(x["occurrences"] for x in fixes)} occurrences)', '',
         'Edits correct clear errors while retaining the arguments, jokes, original dates, quotations and historical context. This is a migration and copy-edit, not a substantive fact-check or an update of old policy, health or financial claims. Original source is preserved in `source/blogger-feed.json`.', '',
         'Numerical corrections: in the exponential-growth post, 1,063/100 is 10.63 (not 5) and 222,345/100 is 2,223.45 (not 222); in the debt post, £1.7 trillion is 1,700,000,000,000. The worked tables themselves are preserved. The inflation post was missing the percent sign after “minus 50”.', '']
for number, post in enumerate(posts, 1):
    selected = [x for x in fixes if x['post'] == number]
    if selected:
        lines.extend(['### ' + post['title'], ''])
        for x in selected:
            lines.append(f'- {x["kind"].capitalize()}: “{x["before"]}” → “{x["after"]}”' + (f' ({x["occurrences"]} occurrences)' if x['occurrences'] > 1 else '') + '.')
        lines.append('')
lines.extend(['## Links and images', '', '- Updated the homepage and research-page Blog navigation links to `/blog/`, correcting malformed markup on the latter.', f'- Downloaded and verified all 14 images. Every image now uses a local file, descriptive alternative text and responsive sizing. Larger original image links open the local image.',
              f'- Rewrote {sum(x["after"].startswith("/blog/") and "/assets/" not in x["after"] for x in link_fixes)} cross-links to the migrated posts, including Blogger mobile and `.co.uk` variants.',
              '- Replaced the queuing-theory journal link, which redirected to a journal homepage, with a verified full-text copy of the same McManus et al. (2004) article. Bibliographic match: https://ihoptimize.org/knowledge-center/publications/ .',
              '- The Neil Armstrong YouTube clip returned 404 from YouTube’s oEmbed endpoint. Replaced it with NASA’s working audio recording of the same quotation, linked from https://www.nasa.gov/historical-sounds/ . The six other YouTube links returned valid video metadata.',
              '- Updated verified redirects to their current destinations. Exact changes follow.', ''])
for x in link_fixes:
    if x['after'].startswith('http'):
        lines.append(f'- Post {x["post"]}: {x["before"]} → {x["after"]}')
lines.extend(['', '## Blog layout', '',
              '- Replaced the sparse title index with newest-first dated previews, estimated reading times and existing article thumbnails. Preview text is taken from the articles; selected excerpts avoid introductory quotations that need additional context.',
              '- Restored the Economy Class name in the title, footer and RSS. Removed the introductory tagline, essay-count/date-range badge, all topic labels and the publication-year dropdown.',
              '- Grouped previews under year headings with a simple Years archive. All articles remain available without JavaScript; year links jump to their sections. With JavaScript, year links select that year. Search, oldest-first and A–Z sorting are retained; A–Z shows one alphabetical list.',
              '- Kept the compact layout, three selected starting points, RSS and dark mode. The year list folds away on phones. Original article text is unchanged.', '',
              '- Replaced the queuing-theory article in “A few to start with” with “The problem with being anti-waste”, at the author’s request.', '',
              '## Unresolved or access-limited references', '',
              '- “Kill or Cure” returns 404. No replacement was verified. Its link text is preserved with “original site unavailable”; the original URL remains in the source and audit.',
              '- A successful HTTP response is not a guarantee that a video or social post is available without sign-in. Paywalls and bot blocks are recorded below, not labelled as dead links.', ''])
for x in links:
    if x['status'] != 200 and x['url'] not in (DEAD, PAPER_OLD):
        detail = x.get('title') or x.get('error') or 'Access requires a subscription or manual verification.'
        lines.append(f'- HTTP {x["status"]}: {x["url"]} — {detail}')
lines.extend(['', '## Author review, left unchanged', '',
              '- “The curse of knowledge”: the sentence “What we are accusing them of, is thinking it is highly likely we will know” appears to reverse the intended meaning. Confirm before changing “likely” to “unlikely”.',
              '- The exponential-growth post uses R as a daily multiplier. The epidemiological definition and interpretation would need a separate substantive review; only the clear arithmetic typos were corrected.',
              '- Original statements about legislation, inflation, Bitcoin, smoking/vaping and pandemic restrictions remain dated views. They have not been refreshed to 2026.', '',
              '## Preservation checks', '',
              '- All 48 source posts mapped to unique pages.',
              '- After applying only the logged text edits, the non-whitespace article text matches the cleaned HTML for every post. Added table captions and the unavailable-link label are recorded presentation changes.',
              '- All 14 illustrations and all 3 numeric tables retained; bold, italics, block quotations, lists and strikethrough retained.',
              '- Removed legacy Blogger/Word font colours and fixed widths so article text is legible in both colour modes and on small screens.',
              '- Browser checks passed for all 48 articles at phone width without page overflow, title search (including no results), and the light/dark control with persistence after reload. Desktop index and article layouts were visually inspected.',
              '- Original Blogger comments, profile widgets and share gadgets are not part of this post migration.',
              '- Removed all 48 “Original on Blogger” footer links and one empty legacy image anchor. Article dates now say “Published”. The public blog has no links or assets pointing to David’s old Blogger site; the source export remains preserved for offline rebuilding.', ''])
(HERE / 'CHANGES.md').write_text('\n'.join(lines), encoding='utf-8')
print(json.dumps({'posts': len(posts), 'correction_occurrences': sum(x['occurrences'] for x in fixes), 'correction_rules': len(fixes),
                  'images': len(media), 'link_changes': len(link_fixes), 'unresolved': issues}, ensure_ascii=False, indent=2))
