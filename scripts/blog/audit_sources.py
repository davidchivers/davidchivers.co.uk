"""Download the public Blogger illustrations and audit outbound references."""
import concurrent.futures
import hashlib
import io
import json
from pathlib import Path
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'scripts/blog/source'
REPORTS = ROOT / 'scripts/blog/reports'
HEADERS = {'User-Agent': 'Mozilla/5.0 (compatible; blog-migration-link-check/1.0)'}

def fetch_image(item):
    original = item['src']
    candidates = [item.get('parent'), original]
    attempts = []
    for url in dict.fromkeys(candidates):
        if not url or 'googleusercontent.com' not in urlparse(url).netloc:
            continue
        try:
            r = requests.get(url, timeout=25, headers=HEADERS)
            r.raise_for_status()
            im = Image.open(io.BytesIO(r.content))
            im.verify()
            im = Image.open(io.BytesIO(r.content))
            ext = {'JPEG': 'jpg', 'PNG': 'png', 'GIF': 'gif', 'WEBP': 'webp'}[im.format]
            name = f"{item['post']:02d}-{hashlib.sha256(original.encode()).hexdigest()[:10]}.{ext}"
            path = ROOT / 'blog/assets/images' / name
            path.write_bytes(r.content)
            return dict(item, download_url=url, local='/blog/assets/images/' + name,
                        width=im.width, height=im.height, bytes=len(r.content), status='saved')
        except Exception as e:
            attempts.append(str(e))
    return dict(item, status='unresolved', errors=attempts)

def check_link(url):
    try:
        r = requests.get(url, timeout=(8, 18), headers=HEADERS, stream=True)
        chunks = []
        for chunk in r.iter_content(16384):
            chunks.append(chunk)
            if sum(map(len, chunks)) >= 131072:
                break
        soup = BeautifulSoup(b''.join(chunks), 'html.parser') if 'html' in r.headers.get('Content-Type', '') else None
        result = dict(url=url, status=r.status_code, final_url=r.url,
                      content_type=r.headers.get('Content-Type'),
                      title=soup.title.get_text(' ', strip=True) if soup and soup.title else '')
        r.close()
        return result
    except Exception as e:
        return dict(url=url, status='error', error=str(e))

if __name__ == '__main__':
    images = json.loads((SOURCE / 'media-inventory.json').read_text(encoding='utf-8'))
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        media = list(pool.map(fetch_image, images))
    (REPORTS / 'media.json').write_text(json.dumps(media, indent=2, ensure_ascii=False), encoding='utf-8')
    print('Images:', [(i['post'], i['status'], i.get('width'), i.get('height')) for i in media], flush=True)
    links = json.loads((SOURCE / 'links-inventory.json').read_text(encoding='utf-8'))
    urls = sorted({x['url'] for x in links if x['url'] and x['url'].startswith(('http:', 'https:'))
                   and 'googleusercontent' not in urlparse(x['url']).netloc
                   and not urlparse(x['url']).netloc.startswith('davidchivers.blogspot.')})
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as pool:
        results = list(pool.map(check_link, urls))
    (REPORTS / 'links.json').write_text(json.dumps(results, indent=2, ensure_ascii=False), encoding='utf-8')
    for x in results:
        print(x['status'], x['url'], '=>', x.get('final_url', ''))
