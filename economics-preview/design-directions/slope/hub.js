// Slope hub: the hero budget line and the stage selector.
(() => {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const $ = id => document.getElementById(id);
  const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Hero plane ---- */
  const box = { left: 48, top: 20, width: 560, height: 280 };
  const px = v => box.left + v * box.width / 12;
  const py = v => box.top + box.height - v * box.height / 6;

  const dots = $('plane-dots');
  if (dots) {
    for (let x = 1; x <= 12; x++) for (let y = 1; y <= 6; y++) {
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', px(x)); c.setAttribute('cy', py(y)); c.setAttribute('r', 1.7);
      c.setAttribute('class', 'dot-grid');
      dots.append(c);
    }
  }

  const SCENES = {
    start: { m: 24, p: 3, rate: '½', caption: '£24 to spend, coffee £3, lunch £6: up to 8 coffees or 4 lunches, or any mix on the line.' },
    income: { m: 36, p: 3, rate: '½', caption: 'Income rises to £36. Same prices, so the whole line moves out in parallel: up to 12 coffees or 6 lunches.' },
    price: { m: 24, p: 6, rate: '1', caption: 'Coffee rises to £6. The line pivots in: still 4 lunches at most, but now only 4 coffees.' }
  };
  let shown = { xi: 8, yi: 4 };
  let frame = null;

  function draw(xi, yi, rate) {
    const O = `${px(0)},${py(0)}`, Y = `${px(0)},${py(yi)}`, X = `${px(xi)},${py(0)}`;
    const pts = `${O} ${Y} ${X}`;
    $('plane-set').setAttribute('points', pts);
    $('plane-hatch').setAttribute('points', pts);
    const line = $('plane-line');
    line.setAttribute('x1', px(0)); line.setAttribute('y1', py(yi));
    line.setAttribute('x2', px(xi)); line.setAttribute('y2', py(0));
    $('plane-ya').setAttribute('cy', py(yi));
    $('plane-xa').setAttribute('cx', px(xi));
    $('plane-yl').setAttribute('y', py(yi) + 6);
    $('plane-yl').textContent = Math.round(yi * 10) / 10;
    $('plane-xl').setAttribute('x', px(xi));
    $('plane-xl').textContent = Math.round(xi * 10) / 10;
    // Rise-over-run marker: a quarter of the way along the line, one quarter-length step.
    const a = xi / 4, run = xi / 4, L = v => yi - v * yi / xi;
    $('plane-rise-path').setAttribute('d', `M${px(a)} ${py(L(a))} H${px(a + run)} V${py(L(a + run))}`);
    const label = $('plane-rise-label');
    label.setAttribute('x', px(a + run) + 10);
    label.setAttribute('y', (py(L(a)) + py(L(a + run))) / 2 + 5);
    if (rate) label.textContent = `1 coffee = ${rate} lunch`;
    const changed = Math.abs(xi - 8) > 1e-6 || Math.abs(yi - 4) > 1e-6;
    $('plane-ghost').setAttribute('visibility', changed ? 'visible' : 'hidden');
  }

  function goTo(name) {
    const s = SCENES[name];
    const target = { xi: s.m / s.p, yi: s.m / 6 };
    document.querySelectorAll('[data-scene]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.scene === name)));
    $('plane-caption').textContent = s.caption;
    $('plane-desc').textContent = `Budget £${s.m}, coffee £${s.p}, lunch £6. The line runs from ${target.yi} lunches to ${target.xi} coffees; the triangle beneath it is everything affordable.`;
    if (frame) cancelAnimationFrame(frame);
    if (reduce()) { shown = target; draw(target.xi, target.yi, s.rate); return; }
    const from = { ...shown }, t0 = performance.now(), dur = 700;
    const ease = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const step = now => {
      const t = Math.min(1, (now - t0) / dur), k = ease(t);
      shown = { xi: from.xi + (target.xi - from.xi) * k, yi: from.yi + (target.yi - from.yi) * k };
      draw(shown.xi, shown.yi, t === 1 ? s.rate : null);
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
  }
  document.querySelectorAll('[data-scene]').forEach(b => b.addEventListener('click', () => goTo(b.dataset.scene)));

  /* ---- Stage tabs ---- */
  const tabs = [...document.querySelectorAll('.stage-axis [role="tab"]')];
  const panels = tabs.map(t => $(t.getAttribute('aria-controls')));
  function select(i, focus) {
    tabs.forEach((t, k) => {
      const on = k === i;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      panels[k].hidden = !on;
    });
    if (focus) tabs[i].focus();
  }
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(i, false));
    t.addEventListener('keydown', e => {
      const n = tabs.length;
      const map = { ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 };
      if (e.key in map) { e.preventDefault(); select(map[e.key], true); }
    });
  });
  if (tabs.length) {
    const fromHash = panels.findIndex(p => '#' + p.id === location.hash);
    select(fromHash >= 0 ? fromHash : 0, false);
  }
  window.addEventListener('hashchange', () => {
    const i = panels.findIndex(p => '#' + p.id === location.hash);
    if (i >= 0) select(i, false);
  });
})();
