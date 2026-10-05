"""Copy explicitly selected, already-rendered teaching slides into this website.

Run after editing and rendering the canonical Quarto projects. This command
does not render, commit or push, and never copies whole project directories.
"""
from pathlib import Path
import argparse
import hashlib
import json
import shutil

DECKS = {
    "induction.html": "induction_quarto/output/induction.html",
    "ai-course.html": "ai_workshop/revealjs/output/ai_course.html",
    "macro-applications/index.html": "macro_applications_quarto/output/index.html",
    **{f"macro-applications/lecture_{i}.html": f"macro_applications_quarto/output/lecture_{i}.html" for i in range(1, 6)},
}


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("workspace", type=Path, help="Canonical AI workspace containing teaching/")
    args = parser.parse_args()
    destination = Path(__file__).resolve().parent
    sources = {name: args.workspace.resolve() / "teaching" / source for name, source in DECKS.items()}
    # Preserve the version already published with the template guide.
    sources["example.html"] = destination.parent / "slides" / "example.html"
    for source in sources.values():
        if not source.is_file():
            raise SystemExit(f"Missing rendered presentation: {source}")
        content = source.read_text(encoding="utf-8")
        if "</html>" not in content.lower():
            raise SystemExit(f"Incomplete HTML: {source}")
    records = []
    for name, source in sources.items():
        target = destination / name
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source, target)
        if digest(source) != digest(target):
            raise SystemExit(f"Copy verification failed: {name}")
        records.append({"path": name, "bytes": target.stat().st_size, "sha256": digest(target)})
    (destination / "manifest.json").write_text(json.dumps({"files": records}, indent=2) + "\n", encoding="utf-8")
    print(f"Copied and SHA-256 verified {len(records)} HTML files.")


if __name__ == "__main__":
    main()
