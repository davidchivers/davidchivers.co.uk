"""Preserve Lecture 4's hover explanations when publishing rendered Quarto HTML.

Only the interactive HTML changes; the existing static artwork/downloads are
unchanged. The source Quarto project can also include these CSS/JS assets.
"""
from pathlib import Path
import base64
import hashlib
import re

ROOT = Path(__file__).resolve().parent
ASSETS = ["enhancements/migration-welfare.css", "enhancements/migration-welfare.js"]


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
    content = re.sub(br'\n?<!-- migration-welfare:start -->.*?<!-- migration-welfare:end -->\n?', b'\n', content, flags=re.S)
    css, js = [(ROOT / path).read_bytes() for path in ASSETS]
    block = (b'<!-- migration-welfare:start -->\n<style>\n' + css + b'\n</style>\n<script>\n'
             + js + b'\n</script>\n<!-- migration-welfare:end -->\n')
    closing = re.search(br'</body>\s*</html>\s*$', content)
    if not closing:
        raise ValueError("Expected a complete HTML document")
    return content[:closing.start()] + block + content[closing.start():]
