// Slope lesson: the budget-set instrument and the three visual checks.
(() => {
  'use strict';
  const C = window.BudgetCore;
  if (!C || typeof budgetModel !== 'function') return;
  const NS = 'http://www.w3.org/2000/svg';
  const $ = id => document.getElementById(id);
  const svgEl = (tag, attrs, text) => {
    const n = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, String(v));
    if (text !== undefined) n.textContent = text;
    return n;
  };

  const box = { left: 60, top: 30, width: 580, height: 290 };
  const sc = C.scale(box);
  const chart = $('chart');
  const point = $('point');
  let state = { ...C.START };

  /* Grid and axis ticks */
  const grid = $('grid'), ticks = $('ticks');
  for (let x = 1; x <= C.X_MAX; x++) {
    grid.append(svgEl('line', { x1: sc.x(x), y1: box.top, x2: sc.x(x), y2: sc.y(0), class: 'grid-line' + (x % 2 ? '' : ' major') }));
    if (x % 2 === 0) ticks.append(svgEl('text', { x: sc.x(x), y: sc.y(0) + 24, class: 'tick', 'text-anchor': 'middle' }, x));
  }
  for (let y = 1; y <= C.Y_MAX; y++) {
    grid.append(svgEl('line', { x1: box.left, y1: sc.y(y), x2: sc.x(C.X_MAX), y2: sc.y(y), class: 'grid-line major' }));
    ticks.append(svgEl('text', { x: box.left - 14, y: sc.y(y) + 5, class: 'tick', 'text-anchor': 'end' }, y));
  }
  ticks.append(svgEl('text', { x: box.left - 14, y: sc.y(0) + 5, class: 'tick', 'text-anchor': 'end' }, 0));

  /* Radio decks for income and price */
  function deck(id, name, values, start) {
    const row = $(id);
    values.forEach(v => {
      const label = document.createElement('label');
      if (v === start) label.className = 'was';
      label.innerHTML = `<input type="radio" name="${name}" value="${v}"><span>£${v}${v === start ? '<span class="visually-hidden"> (starting value)</span>' : ''}</span>`;
      row.append(label);
    });
    row.addEventListener('change', e => { state[name] = Number(e.target.value); render(); });
  }
  deck('deck-m', 'm', C.INCOMES, C.START.m);
  deck('deck-p', 'p', C.PRICES, C.START.p);

  /* Line animation between income/price states */
  let shown = { xi: 8, yi: 4 }, frame = null;
  function drawLine(xi, yi) {
    const O = `${sc.x(0)},${sc.y(0)}`;
    const pts = `${O} ${sc.x(0)},${sc.y(yi)} ${sc.x(xi)},${sc.y(0)}`;
    $('set').setAttribute('points', pts);
    $('set-hatch').setAttribute('points', pts);
    const line = $('line');
    line.setAttribute('x1', sc.x(0)); line.setAttribute('y1', sc.y(yi));
    line.setAttribute('x2', sc.x(xi)); line.setAttribute('y2', sc.y(0));
    $('ya').setAttribute('cy', sc.y(yi));
    $('xa').setAttribute('cx', sc.x(xi));
    const ya = $('ya-label');
    ya.setAttribute('x', sc.x(0) + 18); ya.setAttribute('y', sc.y(yi) + 2);
    const xa = $('xa-label'), X = sc.x(xi);
    if (X > 540) { xa.setAttribute('text-anchor', 'end'); xa.setAttribute('x', X - 10); xa.setAttribute('y', sc.y(0) - 14); }
    else { xa.setAttribute('text-anchor', 'start'); xa.setAttribute('x', X + 12); xa.setAttribute('y', sc.y(0) - 12); }
  }
  function animateLine(xi, yi) {
    if (frame) cancelAnimationFrame(frame);
    if (C.reducedMotion() || (Math.abs(shown.xi - xi) < 1e-9 && Math.abs(shown.yi - yi) < 1e-9)) {
      shown = { xi, yi }; drawLine(xi, yi); return;
    }
    const from = { ...shown }, t0 = performance.now(), dur = 380;
    const step = now => {
      const t = Math.min(1, (now - t0) / dur), k = 1 - Math.pow(1 - t, 3);
      shown = { xi: from.xi + (xi - from.xi) * k, yi: from.yi + (yi - from.yi) * k };
      drawLine(shown.xi, shown.yi);
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
  }

  /* Debounced screen-reader summary, so dragging does not flood announcements */
  let srTimer = null, ready = false;
  function announce(text) {
    if (!ready) return; // nothing to announce on first paint
    clearTimeout(srTimer);
    srTimer = setTimeout(() => { $('sr-status').textContent = text; }, 450);
  }

  const STATUS = {
    on: ['●', 'On the line: every pound spent'],
    under: ['○', 'Inside the set: affordable, with money left'],
    over: ['✕', 'Outside the set: not affordable']
  };

  function render() {
    const f = C.facts(state);
    const { x, y } = state;

    $('ya-label').textContent = C.lunches(f.lunchIntercept);
    $('xa-label').textContent = C.coffees(f.coffeeIntercept);
    animateLine(f.coffeeIntercept, f.lunchIntercept);
    $('ghost').setAttribute('visibility', f.change === 'start' ? 'hidden' : 'visible');

    const cx = sc.x(x), cy = sc.y(y);
    point.setAttribute('transform', `translate(${cx} ${cy})`);
    point.classList.toggle('over', f.position === 'over');
    point.setAttribute('aria-label', `Basket: ${C.coffees(x)} and ${C.lunches(y)}, costing ${C.money(f.spent)}. ${STATUS[f.position][1]}.`);
    $('guides').setAttribute('d', `M${cx} ${sc.y(0)} V${cy} H${sc.x(0)}`);
    const pl = $('point-label');
    pl.textContent = `(${C.num(x)}, ${C.num(y)})`;
    pl.setAttribute('text-anchor', x > 9 ? 'end' : 'start');
    pl.setAttribute('x', cx + (x > 9 ? -20 : 20));
    pl.setAttribute('y', y > 5 ? cy + 32 : cy - 18);

    const st = $('status');
    st.className = 'status ' + f.position;
    st.querySelector('.status-mark').textContent = STATUS[f.position][0];
    $('status-text').textContent = STATUS[f.position][1];
    $('r-spent').textContent = C.money(f.spent);
    const over = f.position === 'over';
    $('r-left-label').textContent = over ? 'Over by' : 'Left';
    $('r-left').textContent = C.money(Math.abs(f.remaining));
    $('r-left').classList.toggle('neg', over);
    $('r-xmax').textContent = C.num(f.coffeeIntercept);
    $('r-ymax').textContent = C.num(f.lunchIntercept);
    $('r-slope').textContent = C.slopeText(f.p);
    $('r-oc').textContent = `1 coffee costs ${f.fraction} lunch · 1 lunch costs ${C.coffees(f.coffeesPerLunch)}`;
    $('sum').textContent = `£${f.p} × ${C.num(x)} + £6 × ${C.num(y)} = ${C.money(f.spent)} ${over ? '>' : '≤'} ${C.money(f.m)}`;

    const story = [C.lineStory(f), C.startBasketStory(f), C.slackStory(f)].filter(Boolean).join(' ');
    $('insight').textContent = story;
    $('chart-desc').textContent = `Budget ${C.money(f.m)}, coffee ${C.money(f.p)}, lunch £6. The line joins ${C.lunches(f.lunchIntercept)} to ${C.coffees(f.coffeeIntercept)}; the triangle beneath it is affordable. The basket is ${C.coffees(x)} and ${C.lunches(y)}, costing ${C.money(f.spent)}.`;
    announce(`${C.coffees(x)}, ${C.lunches(y)}: ${C.money(f.spent)} spent. ${C.slackStory(f)}`);

    document.querySelectorAll('#deck-m input').forEach(i => { i.checked = Number(i.value) === f.m; });
    document.querySelectorAll('#deck-p input').forEach(i => { i.checked = Number(i.value) === f.p; });
    if (document.activeElement !== $('in-x')) $('in-x').value = x;
    if (document.activeElement !== $('in-y')) $('in-y').value = y;
  }

  /* Inputs */
  point.setAttribute('tabindex', '0');
  point.setAttribute('role', 'button');
  point.addEventListener('keydown', e => {
    const next = C.keyStep(e, state);
    if (!next) return;
    e.preventDefault();
    state = { ...state, ...next };
    render();
  });
  C.attachPointer(chart, sc, q => {
    if (q.x === state.x && q.y === state.y) return;
    state = { ...state, ...q };
    render();
  }, point);

  document.querySelectorAll('[data-step]').forEach(b => b.addEventListener('click', () => {
    const k = b.dataset.step;
    state[k] = C.snap(state[k] + Number(b.dataset.d), k === 'x' ? C.X_MAX : C.Y_MAX);
    render();
  }));
  ['x', 'y'].forEach(k => {
    const input = $('in-' + k);
    input.addEventListener('change', () => {
      state[k] = C.snap(input.value, k === 'x' ? C.X_MAX : C.Y_MAX);
      input.value = state[k];
      render();
    });
  });

  const SCENES = { start: { ...C.START }, income: { m: 36, p: 3, x: 4, y: 2 }, price: { m: 24, p: 6, x: 4, y: 2 } };
  document.querySelectorAll('[data-scene]').forEach(b => b.addEventListener('click', () => {
    state = { ...SCENES[b.dataset.scene] };
    render();
  }));

  render();
  ready = true;

  /* ---- Checks: always about the starting set-up ---- */
  const CHECKS = {
    1: {
      answer: 1,
      right: 'Yes: 3 lunches. Two coffees cost £6, which leaves £18, and £18 buys exactly three £6 lunches. The basket (2, 3) sits on the line.',
      wrong: {
        0: 'Two lunches is affordable, but it leaves £6 unspent: enough for one more lunch. Try again.',
        2: 'Two coffees and four lunches would cost £6 + £24 = £30, which is £6 over the £24 budget. Try again.'
      }
    },
    2: {
      answer: 1,
      right: 'Yes. With prices unchanged, both ends move out: 12 coffees (£36 ÷ £3) and 6 lunches (£36 ÷ £6). The slope stays −0.5, so the line shifts out in parallel.',
      wrong: {
        0: 'The lunch end depends on income too: £36 ÷ £6 = 6 lunches, not 4. Try another picture.',
        2: 'The coffee end moves too: £36 ÷ £3 = 12 coffees. If only one end moved, the slope would change, but neither price has. Try another picture.'
      }
    },
    3: {
      answer: 2,
      right: 'Yes. Lunch still costs £6, so the most lunch is still 4. The most coffee falls from 8 to 4 (£24 ÷ £6). The line pivots in around the lunch end, and the slope steepens from −0.5 to −1.',
      wrong: {
        0: 'That parallel shift is what halving income would do. The lunch price hasn’t changed, so 4 lunches are still affordable. Try another picture.',
        1: 'That is what a dearer lunch would look like. Here only coffee costs more, so the lunch end stays at 4 and the coffee end moves in. Try another picture.'
      }
    }
  };

  // Mini plots inside the picture options.
  const mb = { left: 24, top: 10, width: 164, height: 82 };
  const mx = v => mb.left + v * mb.width / 12, my = v => mb.top + mb.height - v * mb.height / 6;
  document.querySelectorAll('.choices.plots button').forEach(btn => {
    const [x1, y1, x2, y2] = btn.dataset.line.split(',').map(Number);
    const s = svgEl('svg', { viewBox: '0 0 200 112', 'aria-hidden': 'true', focusable: 'false' });
    s.append(svgEl('polygon', { points: `${mx(0)},${my(0)} ${mx(x1)},${my(y1)} ${mx(x2)},${my(y2)}`, fill: '#68246d' }));
    s.append(svgEl('line', { x1: mx(0), y1: my(4), x2: mx(8), y2: my(0), class: 'mini-start' }));
    s.append(svgEl('line', { x1: mx(x1), y1: my(y1), x2: mx(x2), y2: my(y2), class: 'mini-line' }));
    s.append(svgEl('path', { d: `M${mx(0)} ${mb.top - 4} V${my(0)} H${mx(12) + 4}`, class: 'mini-axis' }));
    [4, 8, 12].forEach(v => s.append(svgEl('text', { x: mx(v), y: my(0) + 15, class: 'mini-tick', 'text-anchor': 'middle' }, v)));
    [2, 4, 6].forEach(v => s.append(svgEl('text', { x: mb.left - 7, y: my(v) + 4, class: 'mini-tick', 'text-anchor': 'end' }, v)));
    btn.prepend(s);
  });

  document.querySelectorAll('.check').forEach(card => {
    const fb = card.querySelector('.feedback[role="status"]');
    card.querySelectorAll('.choices button').forEach(btn => btn.addEventListener('click', () => {
      if (btn.getAttribute('aria-disabled') === 'true') return;
      const q = CHECKS[btn.dataset.q], a = Number(btn.dataset.a);
      if (a === q.answer) {
        btn.classList.add('is-right');
        card.querySelectorAll('.choices button').forEach(b => b.setAttribute('aria-disabled', 'true'));
        fb.className = 'feedback good';
        fb.textContent = q.right;
      } else {
        btn.classList.add('is-wrong');
        fb.className = 'feedback try';
        fb.textContent = q.wrong[a];
      }
    }));
  });

  $('restart').addEventListener('click', () => {
    document.querySelectorAll('.check').forEach(card => {
      card.querySelectorAll('.choices button').forEach(b => { b.classList.remove('is-right', 'is-wrong'); b.removeAttribute('aria-disabled'); });
      const fb = card.querySelector('.feedback[role="status"]');
      fb.className = 'feedback'; fb.textContent = '';
    });
    const first = document.querySelector('#q1 .choices button');
    first.scrollIntoView({ block: 'center', behavior: C.reducedMotion() ? 'auto' : 'smooth' });
    first.focus({ preventScroll: true });
  });
})();
