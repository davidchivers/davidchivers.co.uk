// Wayfinder lesson: four steps (idea, play, check, next), a live receipt and one question at a time.
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
  const reduce = () => C.reducedMotion();

  /* ---------- Steps ---------- */
  const STEPS = ['idea', 'play', 'check', 'next'];
  const NEXT_LABEL = { idea: 'Next: Play', play: 'Next: Check yourself', check: 'Next: Where next' };
  const navButtons = [...document.querySelectorAll('[data-goto]')];
  let stepIndex = 0;

  function showStep(i, moveFocus) {
    stepIndex = Math.max(0, Math.min(STEPS.length - 1, i));
    const id = STEPS[stepIndex];
    STEPS.forEach((s, k) => {
      const panel = $(s);
      panel.hidden = k !== stepIndex;
      panel.classList.toggle('entering', k === stepIndex && moveFocus);
    });
    navButtons.forEach((b, k) => {
      if (k === stepIndex) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
      b.classList.toggle('done', k < stepIndex);
    });
    $('prev').hidden = stepIndex === 0;
    const fwd = $('fwd');
    fwd.hidden = stepIndex === STEPS.length - 1;
    if (NEXT_LABEL[id]) fwd.firstChild.textContent = NEXT_LABEL[id];
    if (history.replaceState) history.replaceState(null, '', '#' + id);
    if (moveFocus) {
      const nav = document.querySelector('.steps-nav');
      if (nav.getBoundingClientRect().top < 0) nav.scrollIntoView({ block: 'start', behavior: reduce() ? 'auto' : 'smooth' });
      $(id).querySelector('h1, h2').focus({ preventScroll: true });
    }
  }
  navButtons.forEach((b, k) => b.addEventListener('click', () => showStep(k, true)));
  $('prev').addEventListener('click', () => showStep(stepIndex - 1, true));
  $('fwd').addEventListener('click', () => showStep(stepIndex + 1, true));
  const start = STEPS.indexOf(location.hash.slice(1));
  showStep(start >= 0 ? start : 0, false);

  /* ---------- Play ---------- */
  const box = { left: 52, top: 22, width: 528, height: 264 };
  const sc = C.scale(box);
  const svg = $('chart'), point = $('pt');
  let state = { ...C.START };

  const grid = $('grid'), ticks = $('ticks');
  grid.setAttribute('class', 'g-grid');
  for (let x = 1; x <= C.X_MAX; x++) grid.append(svgEl('line', { x1: sc.x(x), y1: box.top, x2: sc.x(x), y2: sc.y(0) }));
  for (let y = 1; y <= C.Y_MAX; y++) grid.append(svgEl('line', { x1: box.left, y1: sc.y(y), x2: sc.x(C.X_MAX), y2: sc.y(y) }));
  for (let x = 0; x <= C.X_MAX; x += 2) ticks.append(svgEl('text', { x: sc.x(x), y: sc.y(0) + 22, class: 'g-tick', 'text-anchor': 'middle' }, x));
  for (let y = 1; y <= C.Y_MAX; y++) ticks.append(svgEl('text', { x: box.left - 12, y: sc.y(y) + 5, class: 'g-tick', 'text-anchor': 'end' }, y));
  ticks.append(svgEl('text', { x: sc.x(C.X_MAX), y: 334, class: 'g-title', 'text-anchor': 'end' }, 'Coffees →'));
  ticks.append(svgEl('text', { x: 14, y: sc.y(3), class: 'g-title', 'text-anchor': 'middle', transform: `rotate(-90 14 ${sc.y(3)})` }, 'Lunches →'));

  function segments(id, name, values) {
    const row = $(id);
    values.forEach(v => {
      const label = document.createElement('label');
      label.innerHTML = `<input type="radio" name="${name}" value="${v}"><span>£${v}</span>`;
      row.append(label);
    });
    row.addEventListener('change', e => { state[name] = Number(e.target.value); render(); });
  }
  segments('seg-m', 'm', C.INCOMES);
  segments('seg-p', 'p', C.PRICES);

  let shown = { xi: 8, yi: 4 }, frame = null;
  function drawLine(xi, yi) {
    const pts = `${sc.x(0)},${sc.y(0)} ${sc.x(0)},${sc.y(yi)} ${sc.x(xi)},${sc.y(0)}`;
    $('set').setAttribute('points', pts);
    const l = $('line');
    l.setAttribute('y1', sc.y(yi)); l.setAttribute('x2', sc.x(xi));
    $('ylab').setAttribute('y', sc.y(yi) - 9);
    const xl = $('xlab'), X = sc.x(xi);
    if (X > 470) { xl.setAttribute('text-anchor', 'end'); xl.setAttribute('x', X - 10); }
    else { xl.setAttribute('text-anchor', 'start'); xl.setAttribute('x', X + 10); }
    xl.setAttribute('y', sc.y(0) - 11);
  }
  function animateLine(xi, yi) {
    if (frame) cancelAnimationFrame(frame);
    if (reduce()) { shown = { xi, yi }; drawLine(xi, yi); return; }
    const from = { ...shown }, t0 = performance.now(), dur = 320;
    const step = now => {
      const t = Math.min(1, (now - t0) / dur), k = 1 - Math.pow(1 - t, 3);
      shown = { xi: from.xi + (xi - from.xi) * k, yi: from.yi + (yi - from.yi) * k };
      drawLine(shown.xi, shown.yi);
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
  }

  const pounds = n => '£' + Math.abs(n).toFixed(2);
  const STAMP = {
    on: () => '✓ Exactly on budget',
    under: f => `✓ Affordable · ${pounds(f.remaining)} left`,
    over: f => `✕ Over budget by ${pounds(f.remaining)}`
  };
  let liveTimer = null, ready = false;

  function render() {
    const f = C.facts(state);
    const { x, y } = state;
    animateLine(f.coffeeIntercept, f.lunchIntercept);
    $('ylab').textContent = C.lunches(f.lunchIntercept);
    $('xlab').textContent = C.coffees(f.coffeeIntercept);
    $('ghost').setAttribute('visibility', f.change === 'start' ? 'hidden' : 'visible');

    const cx = sc.x(x), cy = sc.y(y);
    point.setAttribute('transform', `translate(${cx} ${cy})`);
    point.classList.toggle('over', f.position === 'over');
    point.setAttribute('aria-label', `Basket: ${C.coffees(x)} and ${C.lunches(y)}. ${STAMP[f.position](f).slice(2)}.`);
    $('guides').setAttribute('d', `M${cx} ${sc.y(0)} V${cy} H${sc.x(0)}`);

    $('rc-xq').textContent = `${C.num(x)} × £${f.p}`;
    $('rc-xc').textContent = pounds(f.p * x);
    $('rc-yq').textContent = `${C.num(y)} × £6`;
    $('rc-yc').textContent = pounds(6 * y);
    $('rc-total').textContent = pounds(f.spent);
    $('rc-budget').textContent = pounds(f.m);
    const over = f.position === 'over';
    $('rc-left-label').textContent = over ? 'Short by' : 'Left';
    $('rc-left').textContent = pounds(f.remaining);
    document.querySelector('.left-row').classList.toggle('neg', over);
    const stamp = $('stamp');
    stamp.className = 'stamp ' + f.position;
    stamp.textContent = STAMP[f.position](f);

    $('lf-x').textContent = C.num(f.coffeeIntercept);
    $('lf-y').textContent = C.num(f.lunchIntercept);
    $('lf-oc').textContent = `${f.fraction} lunch`;
    $('lf-s').textContent = C.slopeText(f.p);

    const tip = $('tip');
    tip.textContent = '';
    const b = document.createElement('b'); b.textContent = 'What’s happening: ';
    tip.append(b, [C.lineStory(f), C.startBasketStory(f), C.slackStory(f)].filter(Boolean).join(' '));
    $('chart-desc').textContent = `Budget ${C.money(f.m)}, coffee ${C.money(f.p)}, lunch £6. The line runs from ${C.lunches(f.lunchIntercept)} to ${C.coffees(f.coffeeIntercept)}. Your basket, ${C.coffees(x)} and ${C.lunches(y)}, costs ${C.money(f.spent)}.`;

    document.querySelectorAll('#seg-m input').forEach(i => { i.checked = Number(i.value) === f.m; });
    document.querySelectorAll('#seg-p input').forEach(i => { i.checked = Number(i.value) === f.p; });
    if (document.activeElement !== $('in-x')) $('in-x').value = x;
    if (document.activeElement !== $('in-y')) $('in-y').value = y;

    if (!ready) return; // no announcement on first paint
    clearTimeout(liveTimer);
    liveTimer = setTimeout(() => { $('sr-live').textContent = `${C.coffees(x)}, ${C.lunches(y)}. Total ${C.money(f.spent)}. ${STAMP[f.position](f).slice(2)}.`; }, 450);
  }

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
  C.attachPointer(svg, sc, q => {
    if (q.x === state.x && q.y === state.y) return;
    state = { ...state, ...q };
    render();
  }, point);
  document.querySelectorAll('[data-step]').forEach(btn => btn.addEventListener('click', () => {
    const k = btn.dataset.step;
    state[k] = C.snap(state[k] + Number(btn.dataset.d), k === 'x' ? C.X_MAX : C.Y_MAX);
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
  const PRESETS = { start: { ...C.START }, income: { m: 36, p: 3, x: 4, y: 2 }, price: { m: 24, p: 6, x: 4, y: 2 } };
  document.querySelectorAll('[data-scene]').forEach(btn => btn.addEventListener('click', () => { state = { ...PRESETS[btn.dataset.scene] }; render(); }));
  render();
  ready = true;

  /* ---------- Check: one question at a time, starting numbers only ---------- */
  const QS = [
    {
      q: 'You buy 2 coffees. What’s the most lunch you can afford?',
      options: ['2 lunches', '3 lunches', '4 lunches'], answer: 1,
      right: '2 coffees cost £6. That leaves £18, which buys exactly 3 lunches at £6.',
      wrong: ['2 lunches is affordable, but it leaves £6 unspent: enough for another lunch.', null, '2 coffees plus 4 lunches costs £6 + £24 = £30. That’s £6 more than you have.']
    },
    {
      q: 'Your budget rises to £36. Prices stay the same. What happens to the line?',
      options: ['It moves out in parallel: 12 coffees, 6 lunches, same slope (−0.5)', 'Only the coffee end moves out', 'It gets steeper'], answer: 0,
      right: 'Both ends move: £36 ÷ £3 = 12 coffees and £36 ÷ £6 = 6 lunches. Prices didn’t change, so the slope stays −0.5.',
      wrong: [null, 'The lunch end moves too: £36 ÷ £6 = 6 lunches.', 'Steepness comes from the price ratio, £3 ÷ £6, and neither price changed.']
    },
    {
      q: 'Back to £24. Coffee goes up to £6. What stays the same?',
      options: ['The most coffee you can buy', 'The most lunch you can buy', 'The slope of the line'], answer: 1,
      right: 'Lunch still costs £6, so you can still buy 4 lunches. The most coffee falls from 8 to 4 (£24 ÷ £6), and the slope steepens from −0.5 to −1.',
      wrong: ['Coffee costs more now, so the most coffee falls from 8 to 4 (£24 ÷ £6).', null, 'The slope changes from −0.5 to −1, because a coffee now costs as much as a lunch.']
    }
  ];
  let qi = 0;
  const solved = [false, false, false];
  let touched = false;
  const dots = [...document.querySelectorAll('.q-dots button')];

  function feedback(kind, title, text) {
    const fb = $('q-feedback');
    fb.className = 'q-feedback' + (kind ? ' ' + kind : '');
    fb.textContent = '';
    if (!title) return;
    const p = document.createElement('p');
    const b = document.createElement('b'); b.textContent = title;
    p.append(b, text);
    fb.append(p);
  }

  function showQuestion(i, focus) {
    qi = i;
    const q = QS[i];
    $('q-count').textContent = `Question ${i + 1} of ${QS.length}`;
    $('q-text').textContent = q.q;
    dots.forEach((d, k) => {
      if (k === i) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
      d.classList.toggle('done', solved[k]);
      d.setAttribute('aria-label', `Question ${k + 1}${solved[k] ? ', answered' : ''}`);
    });
    const answers = $('answers');
    answers.textContent = '';
    q.options.forEach((text, k) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      const label = document.createElement('span'); label.textContent = text;
      const mark = document.createElement('span'); mark.className = 'mark';
      btn.append(label, mark);
      if (solved[i]) {
        btn.setAttribute('aria-disabled', 'true');
        if (k === q.answer) { btn.classList.add('is-right'); mark.textContent = '✓ Correct'; }
      }
      btn.addEventListener('click', () => answer(btn, k));
      answers.append(btn);
    });
    if (solved[i]) feedback('good', 'Correct. ', q.right); else feedback('', '', '');
    updateActions();
    if (focus) $('q-text').focus();
  }

  function answer(btn, k) {
    if (btn.getAttribute('aria-disabled') === 'true') return;
    const q = QS[qi];
    touched = true;
    if (k === q.answer) {
      solved[qi] = true;
      [...$('answers').children].forEach(b => b.setAttribute('aria-disabled', 'true'));
      btn.classList.add('is-right');
      btn.querySelector('.mark').textContent = '✓ Correct';
      feedback('good', 'Correct. ', q.right);
      dots[qi].classList.add('done');
      dots[qi].setAttribute('aria-label', `Question ${qi + 1}, answered`);
    } else {
      btn.classList.add('is-wrong');
      btn.querySelector('.mark').textContent = '✕ Not this one';
      feedback('try', 'Not quite. ', q.wrong[k] + ' Try another answer.');
    }
    updateActions();
  }

  function updateActions() {
    const next = $('q-next');
    next.hidden = !(solved[qi] && qi < QS.length - 1);
    $('q-restart').hidden = !touched;
  }

  dots.forEach((d, k) => d.addEventListener('click', () => showQuestion(k, true)));
  $('q-next').addEventListener('click', () => showQuestion(qi + 1, true));
  $('q-restart').addEventListener('click', () => {
    solved.fill(false);
    touched = false;
    showQuestion(0, true);
  });
  showQuestion(0, false);
})();
