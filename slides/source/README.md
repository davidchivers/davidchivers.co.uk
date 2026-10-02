# Example course: Quarto teaching slides

Give this whole folder to your AI assistant, ask it to use the Durham slide skill,
and describe the changes you want. It should edit the source, rebuild the slides
and show you the result. Codex, Claude Code and GitHub Copilot Agent mode in VS Code
can work with local project files; their skill instructions are linked on the website.

To edit directly, change `example.qmd`, then run `quarto render` in this folder.
The finished presentation is `output/example.html`. Building needs Quarto
(https://quarto.org/docs/get-started/) and Python 3 on PATH for the staff-editor
packaging step. No extra Python packages are needed to render the supplied source:
the code slide uses an included figure. Ask your assistant to check the setup.

The page at https://davidchivers.co.uk/slides/ explains the template and provides
the Durham skill ZIP. The public source ZIP includes all assets and styles used
by the example. It does not install an AI assistant or Quarto itself.

## Contents

- `example.qmd`: slide text, equations, code and example layouts.
- `durham.scss`, `showcase.css`: Durham design and Macro-style title slide.
- `assets/solow.html`, `solow.js.html`: interactive continuous-time Solow model.
- `assets/framework_diagram.html`, `framework_animation.html`: three-country,
  three-good trade-flow animation, reused from Macro Applications.
- `showcase_motion.html`: college and champions effects from induction, with
  user-initiated playback, pause/resume and a static reduced-motion fallback.
- `accessibility.html`: accessible logo name and browser-zoom helper.
- `staff-editor.html`, `scripts/staff_edits.py`, `staff-edits/example.json`:
  the text editor, packaging/import helper and this deck's persistent edit record.

## Quick text corrections in the browser

Click **Edit slides** in the top-right corner. Alt+Shift+E also works, or open
the presentation with `?edit=1` before its slide hash. The button disappears in
presentation fullscreen (F) and print; exit fullscreen to edit again.
Edit outlined text, use Undo if needed, and choose Save updated slides. Keep the
downloaded `*-edited.html`: typing alone does not save to disk or change the website.
The whole presentation is saved, including its figures and interactive examples.
Anyone with the HTML can edit their own copy; this gives no access to update
the website or master project. Maths, images, layout and functional controls stay protected; use your assistant
for those changes. Preview / present hides the editing controls again.

To preserve a browser correction in your master project, give the edited HTML to
your assistant along with this source folder and ask it to import the staff edits.
It should run:

```text
python scripts/staff_edits.py import path/to/example-edited.html
quarto render
```

Keep `staff-edits/example.json` with the project; it records imported changes.
The importer rejects another deck's identity or conflicting stale copies. Resolve
any reported source conflicts before rebuilding. For a new, unrelated course,
start from the skill's starter rather than copying this example's deck identity.

The illustrative Solow model uses output per worker y = k^(1/3), saving rate s,
depreciation 0.05 and workforce growth 0.01, with no technological progress.
For positive capital, k* = (s / 0.06)^(3/2). Higher saving raises steady-state
output per worker, not its permanent growth rate. Slider range: 5–50%.

The rendered HTML embeds its local resources. Links to Quarto's website need an
internet connection. Open the HTML in a modern browser. Use arrow keys to move
between slides; interactive controls can be reached using Tab. Animation plays
only on request and stops when leaving its slide. With reduced motion enabled,
college and celebration effects retain their static layout; trade flows can be
stepped manually. Use the full presentation view for the controls on a small screen.

## Sources and adaptation

Code and layout patterns follow the official Quarto documentation:

- https://quarto.org/docs/presentations/revealjs/
- https://quarto.org/docs/interactive/ojs/
- https://quarto.org/docs/presentations/revealjs/presenting.html

The Python plot and self-contained JavaScript Solow widget are original examples
for this deck. They do not require an external interactive service. The title and
last three slides adapt David Chivers' existing Macro Applications and induction
materials. The supplied Durham marks retain their original ownership.

For conversion work, check the resulting content and equations against the source;
the skill cannot guarantee a lossless conversion of every PowerPoint feature.
