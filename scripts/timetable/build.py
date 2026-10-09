"""Build the explicit date grid and Copilot prompt from one dated reference.

Source: saved Durham staff List report, retrieved 5 October 2026.
Exact header: "Weeks: 13 (12 Oct 2026, 18 Oct 2026)".
The grid is calculated from this anchor, not independently copied from the
sign-in-protected week converter. Do not change the academic year without
checking a dated Durham report/converter for that year.
"""
from datetime import date, timedelta
from pathlib import Path
import hashlib
import re

ROOT = Path(__file__).resolve().parents[2]
PAGE = ROOT / "timetable"
ANCHOR_WEEK = 13
ANCHOR_MONDAY = date(2026, 10, 12)
DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

rows = [
    [str(week)] + [
        (ANCHOR_MONDAY + timedelta(weeks=week - ANCHOR_WEEK, days=day)).isoformat()
        for day in range(7)
    ]
    for week in range(1, 53)
]

text_table = " | ".join(["Durham week"] + DAYS) + "\n"
text_table += "\n".join(" | ".join(row) for row in rows)
template = (Path(__file__).parent / "prompt-template.txt").read_text(encoding="utf-8")
assert template.count("{{WEEK_DATE_TABLE}}") == 1
prompt = template.replace("{{WEEK_DATE_TABLE}}", text_table)
(PAGE / "prompt.txt").write_text(prompt, encoding="utf-8")

table = '<div class="date-grid" role="region" aria-label="Week dates for 2026–27" tabindex="0">\n'
table += '<table><caption>Durham timetable weeks 1–52 · dates in YYYY-MM-DD format</caption>\n<thead><tr>'
table += '<th scope="col">Week</th>' + ''.join(f'<th scope="col">{day}</th>' for day in DAYS)
table += '</tr></thead>\n<tbody>\n'
table += '\n'.join('<tr><th scope="row">' + row[0] + '</th>' + ''.join('<td>' + d + '</td>' for d in row[1:]) + '</tr>' for row in rows)
table += '\n</tbody></table></div>'
page = (PAGE / "index.html").read_text(encoding="utf-8")
page, replacements = re.subn(r'(?<=<!-- WEEK_DATES_START -->).*?(?=<!-- WEEK_DATES_END -->)', '\n' + table + '\n        ', page, flags=re.S)
assert replacements == 1
# Keep the copied prompt, fallback download and page styling in the same release.
# Existing visitors must not receive a cached prompt from a previous revision.
revision = hashlib.sha256((prompt + (PAGE / "app.js").read_text(encoding="utf-8") + (PAGE / "style.css").read_text(encoding="utf-8")).encode()).hexdigest()[:12]
for asset in ("style.css", "app.js", "prompt.txt"):
    page = re.sub(r'((?:href|src)=")' + re.escape(asset) + r'(?:\?v=[^"\s]+)?(")', lambda match: match[1] + asset + '?v=' + revision + match[2], page)
(PAGE / "index.html").write_text(page, encoding="utf-8")
print(f"Built {len(rows)} weeks / {len(rows) * 7} explicit dates; {rows[0][1]} to {rows[-1][-1]}; revision {revision}.")
