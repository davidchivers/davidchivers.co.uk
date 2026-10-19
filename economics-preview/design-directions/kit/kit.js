/* Kit: re-lay the table for a chosen audience.
   Objects are moved in the DOM so reading and tab order always match what is seen,
   then slid from their old place to the new one (FLIP). Without JS the table is
   simply laid out for everyone. */
(() => {
  const table = document.querySelector('[data-table]');
  const control = document.querySelector('[data-arrange]');
  const status = document.getElementById('table-status');
  if (!table || !control) return;

  const buttons = [...control.querySelectorAll('[data-mode]')];
  const objects = Object.fromEntries([...table.querySelectorAll('[data-obj]')].map((el) => [el.dataset.obj, el]));
  const orders = {
    all: ['programme', 'keys', 'leaflet', 'tag', 'postcard'],
    apply: ['leaflet', 'postcard', 'programme', 'tag', 'keys'],
    arrive: ['tag', 'keys', 'postcard', 'leaflet', 'programme'],
    study: ['keys', 'programme', 'postcard', 'tag', 'leaflet'],
  };
  const audience = { all: 'everyone', apply: 'thinking of applying', arrive: 'starting soon', study: 'studying here' };
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  control.hidden = false;

  function arrange(mode) {
    const order = orders[mode];
    if (!order || table.dataset.mode === mode) return;
    const els = order.map((key) => objects[key]).filter(Boolean);
    const before = new Map(els.map((el) => [el, el.getBoundingClientRect()]));

    els.forEach((el) => table.appendChild(el));
    table.dataset.mode = mode;
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
    status.textContent = `Laid out for ${audience[mode]}: ${els.map((el) => el.dataset.name).join(', then ')}.`;

    if (reduceMotion.matches || typeof Element.prototype.animate !== 'function') return;
    els.forEach((el, i) => {
      const from = before.get(el);
      const to = el.getBoundingClientRect();
      const dx = from.left - to.left;
      const dy = from.top - to.top;
      el.getAnimations().forEach((a) => a.cancel());
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
      el.classList.add('is-moving');
      const anim = el.animate(
        [
          { transform: `translate(${dx}px, ${dy}px)`, opacity: 0.92 },
          { transform: 'translate(0, 0)', opacity: 1 },
        ],
        { duration: 640, delay: i * 50, easing: 'cubic-bezier(.2,.75,.15,1)', fill: 'backwards' }
      );
      const done = () => el.classList.remove('is-moving');
      anim.addEventListener('finish', done);
      anim.addEventListener('cancel', done);
    });
  }

  buttons.forEach((b) => b.addEventListener('click', () => arrange(b.dataset.mode)));

  // Arrow keys move between the four choices, as in a toolbar.
  control.addEventListener('keydown', (ev) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(ev.key)) return;
    const i = buttons.indexOf(document.activeElement);
    if (i < 0) return;
    ev.preventDefault();
    const next = buttons[(i + (ev.key === 'ArrowRight' ? 1 : buttons.length - 1)) % buttons.length];
    next.focus();
  });
})();
