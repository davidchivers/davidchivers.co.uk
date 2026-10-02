"""Package portable staff editing; import an edited HTML without executing it.

Quarto post-render: python scripts/staff_edits.py
Bring back staff changes: python scripts/staff_edits.py import downloaded.html
"""
from __future__ import annotations

import base64
import gzip
import hashlib
from html.parser import HTMLParser
import json
import os
from pathlib import Path
import re
import sys
import uuid

STATE_ID = "durham-staff-edits"
TEMPLATE_ID = "durham-staff-template"


def revision(fields):
    return hashlib.sha256(json.dumps(fields, sort_keys=True, ensure_ascii=False).encode()).hexdigest()


def safe_json(value):
    return json.dumps(value, ensure_ascii=False, separators=(",", ":")).replace("<", "\\u003c").replace("\u2028", "\\u2028").replace("\u2029", "\\u2029")


def replace_script(document, identifier, content):
    pattern = re.compile(r'(<script\b[^>]*\bid="' + re.escape(identifier) + r'"[^>]*>).*?(</script>)', re.S)
    document, count = pattern.subn(lambda m: m[1] + content + m[2], document)
    if count != 1:
        raise ValueError(f"Expected one {identifier} element; found {count}")
    return document


class StateParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.inside = False
        self.found = 0
        self.parts = []

    def handle_starttag(self, tag, attrs):
        if tag == "script" and dict(attrs).get("id") == STATE_ID:
            self.inside = True
            self.found += 1

    def handle_endtag(self, tag):
        if tag == "script":
            self.inside = False

    def handle_data(self, data):
        if self.inside:
            self.parts.append(data)


def validate(state):
    if not isinstance(state, dict) or state.get("schema") != 1:
        raise ValueError("Unsupported staff-edit format")
    if not isinstance(state.get("deck_id"), str) or not isinstance(state.get("fields"), dict):
        raise ValueError("Missing deck identity or edits")
    if len(state["fields"]) > 10000:
        raise ValueError("Unexpected number of editable fields")
    for key, value in state["fields"].items():
        if not isinstance(key, str) or not isinstance(value, dict):
            raise ValueError("Invalid editable field")
        if set(value) != {"before", "after"} or not all(isinstance(v, str) for v in value.values()):
            raise ValueError("Each edit must contain original and edited text")
    return state


def pack(path, project):
    document = path.read_text(encoding="utf-8")
    if 'id="durham-staff-editor-code"' not in document:
        return
    store = project / "staff-edits" / (path.stem + ".json")
    store.parent.mkdir(parents=True, exist_ok=True)
    state = validate(json.loads(store.read_text(encoding="utf-8"))) if store.exists() else {
        "schema": 1, "deck_id": str(uuid.uuid4()), "deck": path.stem, "fields": {}
    }
    state["source_revision"] = revision(state["fields"])
    store.write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    # A pristine build is carried inside the file. Saving never serializes Reveal's
    # running DOM, temporary editor markup, hidden fragments or countdown state.
    document = replace_script(document, TEMPLATE_ID, "")
    document = replace_script(document, STATE_ID, safe_json(state))
    template = base64.b64encode(gzip.compress(document.encode(), mtime=0)).decode()
    document = replace_script(document, TEMPLATE_ID, template)
    path.write_text(document, encoding="utf-8")
    print(f"Staff editor packaged: {path.name} ({len(state['fields'])} saved edits)")


def import_edits(path, project):
    parser = StateParser()
    parser.feed(path.read_text(encoding="utf-8"))
    if parser.found != 1:
        raise ValueError("This file does not contain one staff-edit record")
    incoming = validate(json.loads("".join(parser.parts)))
    matches = []
    for candidate in (project / "staff-edits").glob("*.json"):
        state = validate(json.loads(candidate.read_text(encoding="utf-8")))
        if state["deck_id"] == incoming["deck_id"]:
            matches.append((candidate, state))
    if len(matches) != 1:
        raise ValueError("This edited file does not match exactly one deck in this project")
    target, current = matches[0]
    if incoming["fields"] == current["fields"]:
        print("These edits are already in the master project.")
        return
    if incoming.get("source_revision") != revision(current["fields"]):
        raise ValueError("The master has newer staff edits. Review and merge the changes before importing this older copy.")
    current["fields"] = incoming["fields"]
    current["source_revision"] = revision(current["fields"])
    target.write_text(json.dumps(current, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Imported {len(current['fields'])} edits into {target}. Render and check the deck.")


def main():
    project = Path(__file__).resolve().parent.parent
    if len(sys.argv) == 3 and sys.argv[1] == "import":
        import_edits(Path(sys.argv[2]).resolve(), project)
        return
    if len(sys.argv) > 1:
        paths = [Path(p).resolve() for p in sys.argv[1:]]
    else:
        output = os.environ.get("QUARTO_PROJECT_OUTPUT_FILES", "")
        paths = [project / p for p in output.splitlines() if p.strip()] if output else list((project / "output").glob("*.html"))
    for path in paths:
        path = path.resolve()
        if not path.is_relative_to(project):
            raise ValueError("Rendered output must stay inside the project")
        if path.suffix.lower() == ".html" and path.is_file():
            pack(path, project)


if __name__ == "__main__":
    try:
        main()
    except (ValueError, OSError, json.JSONDecodeError) as error:
        raise SystemExit(str(error))
