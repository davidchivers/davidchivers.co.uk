# Example course: Quarto teaching slides

Edit `example.qmd`, then run `quarto render example.qmd` in this folder.
The finished presentation is `output/example.html`. Quarto is available from
https://quarto.org/docs/get-started/ . No Python packages are required to render
this example: the code slide uses a supplied figure.

The page at https://davidchivers.co.uk/slides/ explains the template and provides
the Durham skill ZIP. The public source ZIP includes all assets and styles used
by the example. It does not install an AI assistant or Quarto itself.

## Contents

- `example.qmd`: slide text, equations, code and example layouts.
- `durham.scss`, `showcase.css`, `title-slide.html`: Durham design and cover.
- `assets/solow.html`, `solow.js.html`: interactive continuous-time Solow model.
- `assets/framework_diagram.html`, `framework_animation.html`: three-country,
  three-good trade-flow animation, reused from Macro Applications.
- `showcase_motion.html`: college and champions effects from induction, with
  user-initiated playback, pause/resume and a static reduced-motion fallback.
- `accessibility.html`: accessible logo name and browser-zoom helper.

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
