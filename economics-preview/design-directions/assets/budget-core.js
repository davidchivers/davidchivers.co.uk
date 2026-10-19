// Shared helpers for the three budget-set lessons. Requires model.js (budgetModel).
// Goods are treated as continuously divisible; the half-unit steps are only a UI convenience.
(function (global) {
  'use strict';
  const LUNCH = 6;
  const START = Object.freeze({ m: 24, p: 3, x: 4, y: 2 });
  const INCOMES = [12, 18, 24, 30, 36];
  const PRICES = [3, 4, 5, 6];
  const X_MAX = 12;
  const Y_MAX = 6;

  const round2 = n => Math.round(n * 100) / 100;
  const isWhole = n => Math.abs(n - Math.round(n)) < 1e-9;

  // "4", "4.5", "3.6"; "≈0.67" when rounding hides digits.
  function num(n, approxMark = true) {
    const r = round2(n);
    const text = r.toLocaleString('en-GB', { maximumFractionDigits: 2 });
    return approxMark && Math.abs(r - n) > 1e-9 ? '≈' + text : text;
  }
  // "£24", "£13.50"
  function money(n) {
    const v = Math.abs(n) < 1e-9 ? 0 : n;
    return v.toLocaleString('en-GB', {
      style: 'currency', currency: 'GBP',
      minimumFractionDigits: isWhole(v) ? 0 : 2, maximumFractionDigits: 2
    });
  }
  const plural = (n, one, many) => (Math.abs(n - 1) < 1e-9 ? one : many);
  const coffees = n => `${num(n)} ${plural(n, 'coffee', 'coffees')}`;
  const lunches = n => `${num(n)} ${plural(n, 'lunch', 'lunches')}`;

  // Opportunity cost of one coffee, in lunches: p / 6, as a friendly fraction.
  const FRACTION = { 3: '½', 4: '⅔', 5: '⅚', 6: '1' };
  const FRACTION_WORDS = { 3: 'half a lunch', 4: 'two-thirds of a lunch', 5: 'five-sixths of a lunch', 6: 'one whole lunch' };
  function slopeText(p) {
    const t = num(p / LUNCH);
    return t.startsWith('≈') ? '≈ −' + t.slice(1) : '−' + t;
  }

  function snap(v, max) {
    const n = Number(v);
    if (!Number.isFinite(n)) return 0;
    return Math.round(Math.min(max, Math.max(0, n)) * 2) / 2;
  }

  // Everything a lesson needs to say about the current state, all derived from budgetModel.
  function facts(state) {
    const { m, p, x, y } = state;
    const r = budgetModel(m, p, x, y);
    const startCost = p * START.x + LUNCH * START.y;
    let change = 'start';
    if (p === START.p && m !== START.m) change = m > START.m ? 'income-up' : 'income-down';
    else if (m === START.m && p !== START.p) change = 'price-up';
    else if (m !== START.m && p !== START.p) change = 'both';
    return {
      ...r, m, p, x, y, change,
      fraction: FRACTION[p], fractionWords: FRACTION_WORDS[p],
      coffeesPerLunch: LUNCH / p,
      startCost, startLeft: m - startCost,
      isStartBasket: x === START.x && y === START.y
    };
  }

  // Plain-language reading of where the line is, compared with the starting £24 / £3 line.
  function lineStory(f) {
    switch (f.change) {
      case 'start': return 'This is the starting line: £24, coffee £3, lunch £6.';
      case 'income-up': return `More income, same prices: the line moves out in parallel. Both ends move; the slope stays ${slopeText(f.p)}.`;
      case 'income-down': return `Less income, same prices: the line moves in parallel towards the origin. The slope stays ${slopeText(f.p)}.`;
      case 'price-up': return `Dearer coffee, same income: the line pivots inwards around ${lunches(f.lunchIntercept)}, because the lunch price has not changed. It is steeper now.`;
      default: return `Income and the coffee price have both changed: both income and prices determine the intercepts; relative prices set the steepness (${slopeText(f.p)}).`;
    }
  }

  // What the leftover (or shortfall) means in goods, with only feasible suggestions.
  function slackStory(f) {
    if (f.position === 'on') return 'Every pound is spent: the basket sits exactly on the line.';
    if (f.position === 'under') {
      return `${money(f.remaining)} left: enough for ${coffees(f.remaining / f.p)} or ${lunches(f.remaining / LUNCH)} more.`;
    }
    const over = -f.remaining;
    const cuts = [];
    if (over / f.p <= f.x + 1e-9) cuts.push(coffees(over / f.p));
    if (over / LUNCH <= f.y + 1e-9) cuts.push(lunches(over / LUNCH));
    const fix = cuts.length ? `Dropping ${cuts.join(' or ')} would bring it back to the line.` : 'You would need to cut some of both to get back to the line.';
    return `${money(over)} over budget, so this basket is not affordable. ${fix}`;
  }

  // How the original basket (4 coffees, 2 lunches) fares at the current income and prices.
  function startBasketStory(f) {
    if (f.change === 'start') return '';
    const verb = f.p === START.p ? 'still costs' : 'now costs';
    if (f.isStartBasket) return `This is the starting basket (4 coffees, 2 lunches), which ${verb} ${money(f.startCost)}.`;
    const left = f.startLeft;
    const tail = Math.abs(left) < 1e-9 ? 'exactly the budget.' : left > 0 ? `${money(left)} to spare.` : `${money(-left)} over.`;
    return `The starting basket (4 coffees, 2 lunches) ${verb} ${money(f.startCost)}: ${tail}`;
  }

  // Maps plot values to SVG coordinates for a box {left, top, width, height}.
  function scale(box) {
    return {
      x: v => box.left + v * box.width / X_MAX,
      y: v => box.top + box.height - v * box.height / Y_MAX,
      // Inverse from SVG user units back to snapped quantities.
      fromPoint: (px, py) => ({
        x: snap((px - box.left) * X_MAX / box.width, X_MAX),
        y: snap((box.top + box.height - py) * Y_MAX / box.height, Y_MAX)
      })
    };
  }

  // Pointer input on an SVG chart; calls onMove({x, y}) with snapped quantities.
  // A tap or click anywhere places the basket. Dragging starts anywhere with a mouse or pen,
  // but only from the handle on touch screens, so a finger can still scroll the page past the chart.
  function attachPointer(svg, sc, onMove, handle) {
    let id = null;
    const move = e => {
      const pt = svg.createSVGPoint();
      pt.x = e.clientX; pt.y = e.clientY;
      const ctm = svg.getScreenCTM();
      if (!ctm) return;
      const local = pt.matrixTransform(ctm.inverse());
      onMove(sc.fromPoint(local.x, local.y));
    };
    svg.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      const onHandle = handle && handle.contains(e.target);
      if (e.pointerType === 'touch' && !onHandle) return;
      id = e.pointerId;
      try { svg.setPointerCapture(id); } catch (err) { /* capture is optional */ }
      if (onHandle && e.pointerType === 'touch') e.preventDefault();
      move(e);
    });
    svg.addEventListener('pointermove', e => { if (e.pointerId === id) move(e); });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(t => svg.addEventListener(t, () => { id = null; }));
    svg.addEventListener('click', e => { if (e.detail !== 0) move(e); });
    // Stop a drag that starts on the handle from scrolling the page instead.
    if (handle) handle.addEventListener('touchstart', e => e.preventDefault(), { passive: false });
  }

  // Arrow keys move by half a unit; Shift moves by 2; Home resets to the start basket.
  function keyStep(e, state) {
    const step = e.shiftKey ? 2 : 0.5;
    const map = { ArrowLeft: ['x', -step], ArrowRight: ['x', step], ArrowDown: ['y', -step], ArrowUp: ['y', step] };
    if (e.key === 'Home') return { x: START.x, y: START.y };
    if (!map[e.key]) return null;
    const [k, d] = map[e.key];
    const next = { x: state.x, y: state.y };
    next[k] = snap(state[k] + d, k === 'x' ? X_MAX : Y_MAX);
    return next;
  }

  const reducedMotion = () => global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;

  global.BudgetCore = {
    LUNCH, START, INCOMES, PRICES, X_MAX, Y_MAX,
    num, money, coffees, lunches, slopeText, snap, facts,
    lineStory, slackStory, startBasketStory, scale, attachPointer, keyStep, reducedMotion
  };
})(window);
