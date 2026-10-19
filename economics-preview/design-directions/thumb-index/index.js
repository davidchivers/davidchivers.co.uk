/* Thumb Index: progressive enhancement only. Without this file the whole index,
   the thumb tabs and the CSS lens all still work. */
(() => {
  const find = document.querySelector('[data-find]');
  const input = document.getElementById('find');
  const status = document.getElementById('index-status');
  const empty = document.querySelector('[data-empty]');
  const index = document.getElementById('index');
  if (!find || !input || !status || !empty || !index) return;

  const entries = [...document.querySelectorAll('.entry')];
  const letters = [...document.querySelectorAll('.letter')];
  const thumbs = [...document.querySelectorAll('.thumbs a')];
  const clears = [...document.querySelectorAll('[data-clear]')];
  const fieldClear = find.querySelector('[data-clear]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[’']/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  const terms = new Map(entries.map((e) => [e, norm(`${e.textContent} ${e.dataset.terms || ''}`)]));
  const headword = (e) => e.querySelector('.hw').textContent.trim();

  find.hidden = false;

  let settleTimer;
  function run() {
    const raw = input.value.trim();
    const words = norm(raw).split(' ').filter(Boolean);
    let shown = 0;

    entries.forEach((e) => {
      const hit = words.every((w) => terms.get(e).includes(w));
      e.hidden = !hit;
      if (hit) shown += 1;
    });
    letters.forEach((l) => {
      const any = l.querySelector('.entry:not([hidden])');
      l.hidden = !any;
      const tab = thumbs.find((t) => t.hash === `#${l.id}`);
      if (tab) tab.classList.toggle('is-out', !any);
    });

    fieldClear.hidden = !raw;
    empty.hidden = !(words.length && shown === 0);
    empty.querySelector('q').textContent = raw;

    if (!words.length) status.textContent = '';
    else if (!shown) status.textContent = `No entries for “${raw}”.`;
    else status.textContent = `${shown} ${shown === 1 ? 'entry' : 'entries'} for “${raw}”.`;

    if (!reduceMotion.matches) {
      index.classList.add('is-filtering');
      clearTimeout(settleTimer);
      settleTimer = setTimeout(() => index.classList.remove('is-filtering'), 400);
    }
  }

  function reset(focusField) {
    input.value = '';
    run();
    if (focusField) input.focus();
  }

  input.addEventListener('input', run);
  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && input.value) { ev.preventDefault(); reset(true); }
    if (ev.key === 'ArrowDown') {
      const first = index.querySelector('.entry:not([hidden]) a');
      if (first) { ev.preventDefault(); first.focus(); }
    }
    if (ev.key === 'Enter') ev.preventDefault();
  });
  clears.forEach((b) => b.addEventListener('click', () => reset(true)));
  document.querySelectorAll('[data-try]').forEach((b) => b.addEventListener('click', () => {
    input.value = b.dataset.try;
    run();
    input.focus();
  }));

  // A thumb tab always lands somewhere: if a filter has hidden its letter, clear first.
  thumbs.forEach((t) => t.addEventListener('click', () => { if (input.value) reset(false); }));
  index.addEventListener('click', (ev) => {
    const ref = ev.target.closest('.xref a');
    if (ref && input.value) reset(false);
  });

  // The lens is pure CSS; this only tells screen-reader users what it highlighted.
  const lensNames = { apply: 'applying', arrive: 'arriving', study: 'studying here' };
  document.querySelectorAll('.lens input').forEach((r) => r.addEventListener('change', () => {
    if (r.value === 'all') { status.textContent = 'Highlight removed.'; return; }
    const picked = entries.filter((e) => (e.dataset.for || '').split(' ').includes(r.value) && e.querySelector(':scope > a'));
    status.textContent = `Highlighted for ${lensNames[r.value]}: ${picked.map(headword).join(', ')}.`;
  }));
})();
