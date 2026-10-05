"""Copy explicitly selected, already-rendered teaching slides into this website.

Run after editing and rendering the canonical Quarto projects. Each published
page receives a noindex tag. This command does not render, commit or push,
and never copies whole project directories.
"""
from pathlib import Path
import argparse
import hashlib
import json
import re

DECKS = {
    "induction.html": "induction_quarto/output/induction.html",
    "ai-course.html": "ai_workshop/revealjs/output/ai_course.html",
    "macro-applications/index.html": "macro_applications_quarto/output/index.html",
    **{f"macro-applications/lecture_{i}.html": f"macro_applications_quarto/output/lecture_{i}.html" for i in range(1, 6)},
}


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def unlisted_html(content):
    """Set one robots noindex tag in the head, preserving all other bytes."""
    head = re.search(br"<head\b[^>]*>(.*?)</head\s*>", content, re.I | re.S)
    if head is None:
        raise ValueError("HTML document has no head section")
    inside = head.group(1)
    robots = br"<meta\b(?=[^>]*\bname\s*=\s*[\"']robots[\"'])[^>]*>"
    tag = b'<meta name="robots" content="noindex">'
    if re.search(robots, inside, re.I):
        inside = re.sub(robots, tag, inside, count=1, flags=re.I)
        # Reject ambiguous duplicate instructions instead of silently publishing.
        if len(re.findall(robots, inside, re.I)) != 1:
            raise ValueError("HTML head has multiple robots tags")
    else:
        newline = b"\r\n" if b"\r\n" in inside else b"\n"
        inside = newline + tag + inside
    return content[:head.start(1)] + inside + content[head.end(1):]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("workspace", type=Path, help="Canonical AI workspace containing teaching/")
    args = parser.parse_args()
    destination = Path(__file__).resolve().parent
    sources = {name: args.workspace.resolve() / "teaching" / source for name, source in DECKS.items()}
    prepared = {}
    for source in sources.values():
        if not source.is_file():
            raise SystemExit(f"Missing rendered presentation: {source}")
        content = source.read_bytes()
        if b"</html>" not in content.lower():
            raise SystemExit(f"Incomplete HTML: {source}")
        if b'id="durham-staff-editor-code"' in content:
            raise SystemExit(f"Browser editor is enabled in student slides: {source}. Rebuild without it before publishing.")
        prepared[source] = unlisted_html(content)
    records = []
    for name, source in sources.items():
        target = destination / name
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(prepared[source])
        if target.read_bytes() != prepared[source]:
            raise SystemExit(f"Publication verification failed: {name}")
        records.append({"path": name, "bytes": target.stat().st_size,
                        "source_sha256": digest(source), "sha256": digest(target)})
    index = destination / "index.html"
    index.write_bytes(unlisted_html(index.read_bytes()))
    (destination / "manifest.json").write_text(json.dumps({"files": records}, indent=2) + "\n", encoding="utf-8")
    print(f"Published and verified {len(records)} HTML files with noindex; collection index also unlisted.")


if __name__ == "__main__":
    main()
