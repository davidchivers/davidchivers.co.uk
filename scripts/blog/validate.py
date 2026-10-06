"""Check completeness, assets, internal destinations and preserved article data."""
import json
from pathlib import Path
from urllib.parse import unquote, urlparse
from xml.etree import ElementTree
from bs4 import BeautifulSoup
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
records = json.loads((HERE / 'reports/preservation.json').read_text(encoding='utf-8'))
assert len(records) == 48
errors = []
images = 0
tables = 0
for filename in sorted((ROOT / 'blog').rglob('*.html')):
    soup = BeautifulSoup(filename.read_text(encoding='utf-8'), 'html.parser')
    assert len(soup.find_all('h1')) == 1, filename
    assert soup.html.get('lang') == 'en-GB'
    assert soup.select_one('link[rel=canonical]')
    assert not soup.select('.article-body [style]'), filename
    for node in soup.find_all(['a', 'img', 'script', 'link']):
        link = node.get('href', node.get('src', ''))
        parsed = urlparse(link)
        if parsed.scheme or parsed.netloc:
            continue
        path = ROOT / unquote(parsed.path).lstrip('/') if parsed.path.startswith('/') else filename.parent / unquote(parsed.path)
        if not parsed.path:
            path = filename
        if path.is_dir():
            path /= 'index.html'
        if not path.exists():
            errors.append((str(filename), 'Missing local target', link))
        if parsed.fragment and path.exists() and path.suffix == '.html':
            target = BeautifulSoup(path.read_text(encoding='utf-8'), 'html.parser')
            if not target.find(id=unquote(parsed.fragment)) and not target.find(attrs={'name': unquote(parsed.fragment)}):
                errors.append((str(filename), 'Missing anchor', link))
    for img in soup.select('.article-body img'):
        assert img['alt'].strip()
        Image.open(ROOT / img['src'].lstrip('/')).verify()
        images += 1
    tables += len(soup.select('.article-body table'))
    article = soup.select_one('.article-body')
    if article:
        assert article.get_text(strip=True)
        assert not article.find(['script', 'iframe', 'object'])
index = BeautifulSoup((ROOT / 'blog/index.html').read_text(encoding='utf-8'), 'html.parser')
urls = [a['href'] for a in index.select('.post-list a')]
assert len(urls) == len(set(urls)) == 48
assert set(urls) == {r['url'] for r in records}
assert images == 14 and tables == 3, (images, tables)
assert len(ElementTree.parse(ROOT / 'blog/feed.xml').findall('./channel/item')) == 48
assert len(ElementTree.parse(ROOT / 'blog/sitemap.xml').getroot()) == 49
assert not errors, errors
print('PASS: 48 posts, 14 valid local images, 3 tables, all internal links/anchors, RSS, sitemap, semantic headings and no legacy inline styling.')
