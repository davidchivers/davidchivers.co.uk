"""Preserve Lecture 4's welfare explanations and summary during publication.

The source Quarto project can also include these CSS/JS and summary assets.
Rebuild the matching student download whenever the summary content changes.
"""
from pathlib import Path
import base64
import hashlib
import re

ROOT = Path(__file__).resolve().parent
ASSETS = ["enhancements/migration-welfare.css", "enhancements/migration-welfare.js",
          "enhancements/migration-welfare-summary.html"]


def enhance_migration_welfare(content):
    slide = re.search(br'<section id="l4-s16".*?</section>', content, re.S)
    if not slide:
        raise ValueError("Migration welfare slide l4-s16 is missing; review the enhancement before publishing.")
    image = re.search(br'data:image/svg\+xml;base64,([^"\s]+)', slide.group())
    if not image:
        raise ValueError("Migration welfare artwork is missing; review the enhancement before publishing.")
    svg = base64.b64decode(image.group(1))
    expected = (ROOT / "enhancements/migration-welfare-artwork.sha256").read_text().strip()
    if hashlib.sha256(svg).hexdigest() != expected:
        raise ValueError("Migration welfare artwork changed; check the area-to-letter mapping before publishing.")
    summary = re.search(br'<section id="l4-s17".*?</section>', content, re.S)
    replacement = (ROOT / ASSETS[2]).read_bytes().replace(b'\r\n', b'\n').strip()
    if not summary:
        raise ValueError("Migration welfare summary slide l4-s17 is missing.")
    current = summary.group().replace(b'\r\n', b'\n')
    original = (ROOT / "enhancements/migration-welfare-summary-original.sha256").read_text().strip()
    if current != replacement and hashlib.sha256(current).hexdigest() != original:
        raise ValueError("Migration summary source changed; reconcile it before publishing.")
    content = content[:summary.start()] + replacement + content[summary.end():]
    content = re.sub(br'\n?<!-- migration-welfare:start -->.*?<!-- migration-welfare:end -->\n?', b'\n', content, flags=re.S)
    css, js = [(ROOT / path).read_bytes().replace(b'\r\n', b'\n') for path in ASSETS[:2]]
    block = (b'<!-- migration-welfare:start -->\n<style>\n' + css + b'\n</style>\n<script>\n'
             + js + b'\n</script>\n<!-- migration-welfare:end -->\n')
    closing = re.search(br'</body>\s*</html>\s*$', content)
    if not closing:
        raise ValueError("Expected a complete HTML document")
    return content[:closing.start()] + block + content[closing.start():]
