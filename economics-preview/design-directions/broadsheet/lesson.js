// Broadsheet explainer: a figure that follows the reading, a sandbox, and three exercises.
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

  function drawAxes(gridId, ticksId, box, sc, titles) {
    const grid = $(gridId), ticks = $(ticksId);
    grid.setAttribute('class', 'fig-grid');
    for (let x = 1; x <= C.X_MAX; x++) grid.append(svgEl('line', { x1: sc.x(x), y1: box.top, x2: sc.x(x), y2: sc.y(0) }));
    for (let y = 1; y <= C.Y_MAX; y++) grid.append(svgEl('line', { x1: box.left, y1: sc.y(y), x2: sc.x(C.X_MAX), y2: sc.y(y) }));
    for (let x = 0; x <= C.X_MAX; x += 2) ticks.append(svgEl('text', { x: sc.x(x), y: sc.y(0) + 18, class: 'fig-tick', 'text-anchor': 'middle' }, x));
    for (let y = 1; y <= C.Y_MAX; y++) ticks.append(svgEl('text', { x: box.left - 10, y: sc.y(y) + 4, class: 'fig-tick', 'text-anchor': 'end' }, y));
    if (titles) {
      ticks.append(svgEl('text', { x: box.left, y: box.top - 26, class: 'fig-tick' }, 'Lunches'));
      ticks.append(svgEl('text', { x: sc.x(C.X_MAX), y: sc.y(0) + 36, class: 'fig-tick', 'text-anchor': 'end' }, 'Coffees'));
    }
  }

  // Tweens a budget line between two (coffee max, lunch max) states.
  function lineAnimator(draw) {
    let shown = { xi: 8, yi: 4 }, frame = null;
    return (xi, yi) => {
      if (frame) cancelAnimationFrame(frame);
      if (C.reducedMotion()) { shown = { xi, yi }; draw(xi, yi); return; }
      const from = { ...shown }, t0 = performance.now(), dur = 450;
      const step = now => {
        const t = Math.min(1, (now - t0) / dur), k = 1 - Math.pow(1 - t, 3);
        shown = { xi: from.xi + (xi - from.xi) * k, yi: from.yi + (yi - from.yi) * k };
        draw(shown.xi, shown.yi);
        if (t < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    };
  }

  /* ---------- Figure 2: follows the reading ---------- */
  const sBox = { left: 56, top: 40, width: 480, height: 240 };
  const ss = C.scale(sBox);
  drawAxes('sf-grid', 'sf-ticks', sBox, ss, true);

  const storyLine = lineAnimator((xi, yi) => {
    $('sf-set').setAttribute('points', `${ss.x(0)},${ss.y(0)} ${ss.x(0)},${ss.y(yi)} ${ss.x(xi)},${ss.y(0)}`);
    const l = $('sf-line');
    l.setAttribute('y1', ss.y(yi)); l.setAttribute('x2', ss.x(xi));
    $('sf-ylab').setAttribute('y', ss.y(yi) - 8);
    const xl = $('sf-xlab');
    if (ss.x(xi) > 470) { xl.setAttribute('text-anchor', 'end'); xl.setAttribute('x', ss.x(xi) - 6); }
    else { xl.setAttribute('text-anchor', 'start'); xl.setAttribute('x', ss.x(xi) + 8); }
    xl.setAttribute('y', ss.y(0) - 10);
  });

  // Several equally affordable baskets on the starting line.
  const many = $('sf-many');
  [[0, 4], [2, 3], [4, 2], [6, 1], [8, 0]].forEach(([x, y]) => {
    many.append(svgEl('circle', { cx: ss.x(x), cy: ss.y(y), r: 6, class: 'fig-pt' }));
    many.append(svgEl('text', { x: ss.x(x) + 9, y: ss.y(y) - 10, class: 'fig-q' }, '?'));
  });

  const SCENES = [
    { m: 24, p: 3, cap: 'The budget line: £24, coffee £3, lunch £6. Shaded: every affordable basket.' },
    { m: 24, p: 3, pt: [4, 2], cap: '4 coffees and 2 lunches cost exactly £24: on the line.' },
    { m: 24, p: 3, pt: [2, 2], cap: '2 coffees and 2 lunches cost £18: inside, with £6 to spare.' },
    { m: 24, p: 3, pt: [6, 3], cap: '6 coffees and 3 lunches would cost £36: outside the set.' },
    { m: 24, p: 3, slope: true, cap: 'Two more coffees cost one lunch, so each coffee costs half a lunch: slope −0.5.' },
    { m: 36, p: 3, pt: [4, 2], ghost: true, cap: 'Income £36: a parallel shift out, to 12 coffees and 6 lunches. Dashed: the old line.' },
    { m: 24, p: 6, pt: [4, 2], ghost: true, cap: 'Coffee £6: the line pivots in to 4 coffees, still 4 lunches. Dashed: the old line.' },
    { m: 24, p: 3, many: true, cap: 'Each marked basket spends exactly £24. Which is best? The line alone can’t say.' }
  ];
  const steps = [...document.querySelectorAll('.step')];
  let current = -1;

  function showScene(i) {
    if (i === current) return;
    current = i;
    const s = SCENES[i];
    const f = C.facts({ m: s.m, p: s.p, x: s.pt ? s.pt[0] : 0, y: s.pt ? s.pt[1] : 0 });
    storyLine(f.coffeeIntercept, f.lunchIntercept);
    $('sf-ylab').textContent = C.lunches(f.lunchIntercept);
    $('sf-xlab').textContent = C.coffees(f.coffeeIntercept);
    $('sf-ghost').setAttribute('visibility', s.ghost ? 'visible' : 'hidden');
    $('sf-slope').setAttribute('visibility', s.slope ? 'visible' : 'hidden');
    $('sf-slope-text').textContent = '+2 coffees, −1 lunch';
    many.setAttribute('visibility', s.many ? 'visible' : 'hidden');

    const pt = $('sf-pt'), lab = $('sf-ptlab'), guide = $('sf-guide');
    if (s.pt) {
      const [x, y] = s.pt, cx = ss.x(x), cy = ss.y(y);
      pt.setAttribute('cx', cx); pt.setAttribute('cy', cy);
      pt.classList.toggle('over', f.position === 'over');
      lab.textContent = `(${x}, ${y}) · ${C.money(f.spent)}`;
      lab.setAttribute('x', cx + 12); lab.setAttribute('y', cy - 12);
      guide.setAttribute('d', `M${cx} ${ss.y(0)} V${cy} H${ss.x(0)}`);
      [pt, lab, guide].forEach(n => n.setAttribute('visibility', 'visible'));
    } else {
      [pt, lab, guide].forEach(n => n.setAttribute('visibility', 'hidden'));
    }
    $('sf-num').textContent = `Fig. 2 · ${i + 1}/8`;
    $('sf-cap').textContent = s.cap;
    $('sf-desc').textContent = s.cap;
    steps.forEach((st, k) => st.classList.toggle('is-active', k === i));
  }

  document.querySelectorAll('[data-show]').forEach(b => b.addEventListener('click', () => showScene(Number(b.dataset.show))));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) showScene(Number(e.target.dataset.scene)); });
    }, { rootMargin: '-50% 0px -40% 0px' });
    steps.forEach(s => io.observe(s));
  }
  showScene(0);

  /* ---------- Sandbox ---------- */
  const bBox = { left: 64, top: 40, width: 560, height: 280 };
  const bs = C.scale(bBox);
  drawAxes('sb-grid', 'sb-ticks', bBox, bs, false);
  const svg = $('sb-svg'), point = $('sb-pt');
  let state = { ...C.START };

  const sandLine = lineAnimator((xi, yi) => {
    $('sb-set').setAttribute('points', `${bs.x(0)},${bs.y(0)} ${bs.x(0)},${bs.y(yi)} ${bs.x(xi)},${bs.y(0)}`);
    const l = $('sb-line');
    l.setAttribute('y1', bs.y(yi)); l.setAttribute('x2', bs.x(xi));
    $('sb-ylab').setAttribute('y', bs.y(yi) - 8);
    const xl = $('sb-xlab');
    if (bs.x(xi) > 540) { xl.setAttribute('text-anchor', 'end'); xl.setAttribute('x', bs.x(xi) - 8); }
    else { xl.setAttribute('text-anchor', 'start'); xl.setAttribute('x', bs.x(xi) + 8); }
    xl.setAttribute('y', bs.y(0) - 10);
  });

  let liveTimer = null, ready = false;
  const POS = { on: 'on the line', under: 'inside the set', over: 'outside the set' };

  function render() {
    const f = C.facts(state);
    const { x, y } = state;
    sandLine(f.coffeeIntercept, f.lunchIntercept);
    $('sb-ylab').textContent = C.lunches(f.lunchIntercept);
    $('sb-xlab').textContent = C.coffees(f.coffeeIntercept);
    $('sb-ghost').setAttribute('visibility', f.change === 'start' ? 'hidden' : 'visible');

    const cx = bs.x(x), cy = bs.y(y);
    point.setAttribute('transform', `translate(${cx} ${cy})`);
    point.classList.toggle('over', f.position === 'over');
    point.setAttribute('aria-label', `Basket: ${C.coffees(x)} and ${C.lunches(y)}, ${POS[f.position]}.`);
    $('sb-guide').setAttribute('d', `M${cx} ${bs.y(0)} V${cy} H${bs.x(0)}`);

    $('sb-m').value = f.m; $('sb-p').value = f.p;
    $('sb-m-out').textContent = C.money(f.m);
    $('sb-p-out').textContent = C.money(f.p);
    if (document.activeElement !== $('sb-x')) $('sb-x').value = x;
    if (document.activeElement !== $('sb-y')) $('sb-y').value = y;

    const over = f.position === 'over';
    $('w-sub').textContent = `£${f.p} × ${C.num(x)} + £6 × ${C.num(y)} ${over ? '>' : '≤'} ${C.money(f.m)}`;
    const res = $('w-res');
    res.className = 'w-res' + (over ? ' over' : '');
    const verdict = f.position === 'on' ? 'on the line' : f.position === 'under' ? `inside, ${C.money(f.remaining)} left` : `over by ${C.money(-f.remaining)}`;
    res.innerHTML = '';
    res.append(`${C.money(f.p * x)} + ${C.money(6 * y)} = ${C.money(f.spent)}: `);
    const b = document.createElement('b'); b.textContent = verdict; res.append(b);

    $('f-spent').textContent = C.money(f.spent);
    $('f-left-label').textContent = over ? 'Over by' : 'Left';
    $('f-left').textContent = C.money(Math.abs(f.remaining));
    $('f-left').classList.toggle('neg', over);
    $('f-x').textContent = C.num(f.coffeeIntercept);
    $('f-y').textContent = C.num(f.lunchIntercept);
    $('f-slope').textContent = C.slopeText(f.p);
    $('f-oc').textContent = `${f.fraction} lunch`;

    $('sb-reading').textContent = [C.lineStory(f), C.startBasketStory(f), C.slackStory(f)].filter(Boolean).join(' ');
    $('sb-desc').textContent = `Budget ${C.money(f.m)}, coffee ${C.money(f.p)}, lunch £6. The line joins ${C.lunches(f.lunchIntercept)} and ${C.coffees(f.coffeeIntercept)}. The basket of ${C.coffees(x)} and ${C.lunches(y)} costs ${C.money(f.spent)}, ${POS[f.position]}.`;
    if (!ready) return; // no announcement on first paint
    clearTimeout(liveTimer);
    liveTimer = setTimeout(() => { $('sb-live').textContent = `${C.coffees(x)}, ${C.lunches(y)}: ${C.money(f.spent)}, ${POS[f.position]}.`; }, 450);
  }

  $('sb-m').addEventListener('input', e => { state.m = Number(e.target.value); render(); });
  $('sb-p').addEventListener('input', e => { state.p = Number(e.target.value); render(); });
  ['x', 'y'].forEach(k => {
    const input = $('sb-' + k);
    input.addEventListener('change', () => {
      state[k] = C.snap(input.value, k === 'x' ? C.X_MAX : C.Y_MAX);
      input.value = state[k];
      render();
    });
  });
  point.setAttribute('tabindex', '0');
  point.setAttribute('role', 'button');
  point.setAttribute('aria-roledescription', 'movable point');
  point.addEventListener('keydown', e => {
    const next = C.keyStep(e, state);
    if (!next) return;
    e.preventDefault();
    state = { ...state, ...next };
    render();
  });
  C.attachPointer(svg, bs, q => {
    if (q.x === state.x && q.y === state.y) return;
    state = { ...state, ...q };
    render();
  }, point);
  const PRESETS = { start: { ...C.START }, income: { m: 36, p: 3, x: 4, y: 2 }, price: { m: 24, p: 6, x: 4, y: 2 } };
  document.querySelectorAll('[data-scene]').forEach(b => b.addEventListener('click', () => { state = { ...PRESETS[b.dataset.scene] }; render(); }));
  render();
  ready = true;

  /* ---------- Exercises: always the opening example ---------- */
  const EX = {
    1: {
      answer: 1,
      right: 'Two coffees cost £6, which leaves £18: exactly three £6 lunches. The basket (2, 3) is on the line.',
      wrong: { 0: 'Two lunches is affordable, but it leaves £6 unspent: enough for another lunch.', 2: 'Two coffees and four lunches cost £6 + £24 = £30, which is £6 over the budget.' }
    },
    2: {
      answer: 1,
      right: 'Both intercepts depend on income: £36 ÷ £3 = 12 coffees and £36 ÷ £6 = 6 lunches. Neither price moved, so the slope stays −0.5 and the line shifts out in parallel.',
      wrong: { 0: 'The lunch intercept rises too: £36 ÷ £6 = 6 lunches.', 2: 'The slope depends on relative prices, £3 ÷ £6, and neither price has changed.' }
    },
    3: {
      answer: 0,
      right: 'Lunch still costs £6, so the most lunch is still 4. The most coffee falls from 8 to 4 (£24 ÷ £6). The line pivots inwards and its slope becomes −1.',
      wrong: { 1: 'Only coffee got dearer. With lunch still at £6, you can still afford 4 lunches if you buy no coffee.', 2: 'At £6 a coffee, 8 coffees would cost £48. The line gets steeper, not flatter: from −0.5 to −1.' }
    }
  };

  function say(el, kind, verdict, text) {
    el.className = 'ex-feedback' + (kind ? ' ' + kind : '');
    el.textContent = '';
    if (verdict) { const v = document.createElement('span'); v.className = 'verdict'; v.textContent = verdict; el.append(v); }
    el.append(text);
  }
  function clearMarks(fs) {
    fs.querySelectorAll('.options label').forEach(l => l.classList.remove('is-right', 'is-wrong'));
  }

  document.querySelectorAll('.exercise').forEach(fs => {
    const q = EX[fs.dataset.q];
    const fb = fs.querySelector('.ex-feedback'), retry = fs.querySelector('.retry-btn');
    fs.querySelectorAll('input[type="radio"]').forEach(r => r.addEventListener('change', () => {
      clearMarks(fs); say(fb, '', '', ''); fb.textContent = ''; retry.hidden = true;
    }));
    fs.querySelector('.check-btn').addEventListener('click', () => {
      const chosen = fs.querySelector('input[type="radio"]:checked');
      clearMarks(fs);
      if (!chosen) { say(fb, 'try', '', 'Choose an answer first.'); return; }
      const a = Number(chosen.value);
      if (a === q.answer) {
        chosen.closest('label').classList.add('is-right');
        say(fb, 'good', 'Correct', q.right);
        retry.hidden = true;
      } else {
        chosen.closest('label').classList.add('is-wrong');
        say(fb, 'try', 'Not quite', q.wrong[a] + ' Try another answer.');
        retry.hidden = false;
      }
    });
    retry.addEventListener('click', () => {
      fs.querySelectorAll('input[type="radio"]').forEach(r => { r.checked = false; });
      clearMarks(fs); fb.textContent = ''; fb.className = 'ex-feedback'; retry.hidden = true;
      fs.querySelector('input[type="radio"]').focus();
    });
  });

  $('reset-all').addEventListener('click', () => {
    document.querySelectorAll('.exercise').forEach(fs => {
      fs.querySelectorAll('input[type="radio"]').forEach(r => { r.checked = false; });
      clearMarks(fs);
      const fb = fs.querySelector('.ex-feedback'); fb.textContent = ''; fb.className = 'ex-feedback';
      fs.querySelector('.retry-btn').hidden = true;
    });
    const first = document.querySelector('.exercise input[type="radio"]');
    first.scrollIntoView({ block: 'center', behavior: C.reducedMotion() ? 'auto' : 'smooth' });
    first.focus({ preventScroll: true });
  });
})();
