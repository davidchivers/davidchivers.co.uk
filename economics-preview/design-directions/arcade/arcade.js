/* Arcade: open one bay at a time. Every link is in the HTML and visible without JS;
   this script only turns the bay names into disclosure buttons and widens the chosen
   window. The width change itself is a CSS grid transition. */
(() => {
  const arcade = document.querySelector('[data-arcade]');
  if (!arcade) return;

  const bays = [...arcade.querySelectorAll('.bay')];
  const windows = [...arcade.querySelectorAll('.window')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const toggles = [];

  bays.forEach((bay, i) => {
    const heading = bay.querySelector('h2');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'bay-toggle';
    button.setAttribute('aria-controls', bay.id);
    while (heading.firstChild) button.appendChild(heading.firstChild);
    heading.appendChild(button);
    button.addEventListener('click', () => {
      const isOpen = button.getAttribute('aria-expanded') === 'true';
      open(isOpen ? -1 : i);
    });
    toggles.push(button);
  });

  function open(index) {
    arcade.dataset.open = String(index + 1);
    bays.forEach((bay, j) => {
      bay.classList.toggle('is-open', j === index);
      toggles[j].setAttribute('aria-expanded', String(j === index));
    });
    windows.forEach((w, j) => w.classList.toggle('is-open', j === index));
  }

  // The window is a large pointer target for the same choice. On stacked layouts,
  // bring the chosen bay's text into view if it is off screen.
  windows.forEach((w, i) => w.addEventListener('click', () => {
    open(i);
    const r = bays[i].getBoundingClientRect();
    if (r.top > window.innerHeight - 80 || r.bottom < 0) {
      bays[i].scrollIntoView({ block: 'start', behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    }
  }));

  // Left and right arrows step along the arcade, like walking past the bays.
  toggles.forEach((t, i) => t.addEventListener('keydown', (ev) => {
    if (ev.key !== 'ArrowLeft' && ev.key !== 'ArrowRight') return;
    ev.preventDefault();
    const next = (i + (ev.key === 'ArrowRight' ? 1 : toggles.length - 1)) % toggles.length;
    toggles[next].focus();
    open(next);
  }));

  const start = Math.max(0, bays.findIndex((b) => b.classList.contains('is-open')));
  open(start);
  arcade.classList.add('is-live');
  const hint = document.querySelector('.lede-js');
  if (hint) hint.hidden = false;
})();
