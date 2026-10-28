(() => {
  'use strict';
  const slide = document.getElementById('l4-s16');
  const img = slide?.querySelector('img');
  if (!img || slide.querySelector('.migration-welfare-graph')) return;
  const source = img.getAttribute('data-src') || img.getAttribute('src');
  if (!source?.startsWith('data:image/svg+xml;base64,')) return;
  const markup = new TextDecoder().decode(Uint8Array.from(atob(source.split(',')[1]), c => c.charCodeAt(0)));
  const svg = new DOMParser().parseFromString(markup, 'image/svg+xml').documentElement;
  const letters = [...svg.querySelectorAll('text')].filter(el => /^[A-J]$/.test(el.textContent));
  const polygons = [...svg.querySelectorAll('polygon')].filter(el => el.points.numberOfItems > 3);
  if (letters.length !== 10 || polygons.length !== 10) return;

  const areas = {
    A: ['Destination: capital income before migration', 'Capital owners initially receive A. After migration they receive A + B + C, so their gain is B + C. A itself is retained income, not an additional welfare gain.'],
    B: ['Destination: workers lose B; capital owners gain it', 'Existing workers earn B + E before migration and E afterwards. The wage fall transfers B to local capital owners. This transfer cancels when adding up destination residents’ welfare.'],
    C: ['Destination: net welfare gain C', 'Local capital owners gain B + C while existing workers lose B. The net gain to existing destination residents is C, excluding migrants’ earnings.'],
    D: ['Origin: net welfare gain D, including emigrants', 'Migrants gain D + F, workers who stay gain I, and local capital owners lose F + I. These changes sum to D for the original origin-country population, including emigrants. Total world output rises by C + D.'],
    E: ['Destination: existing workers’ income after migration', 'Existing workers receive E at the new common wage. They previously received B + E, so their welfare loss is B. E is the income they retain.'],
    F: ['Origin: a transfer from capital owners to migrants', 'F is part of origin capital owners’ loss of F + I. Migrants’ earnings rise by D + F. F cancels in the total for the original origin-country population, leaving the net gain D.'],
    G: ['Migrants: earnings before moving', 'The workers who migrate originally earn G at the origin wage. After moving they earn G + F + D at the common wage. Their gain is F + D; G is their original income.'],
    H: ['Origin: remaining workers’ earnings before migration', 'Workers who stay originally receive H. After emigration raises their wage they receive H + I, so their gain is I. H is their original income.'],
    I: ['Origin: remaining workers gain I; capital owners lose it', 'The higher origin wage transfers I from local capital owners to workers who stay. Their earnings rise from H to H + I. This transfer cancels in the origin population’s total welfare change.'],
    J: ['Origin: capital income after migration', 'Local capital owners retain J. Before migration they received F + I + J, so they lose F + I. J itself is retained income, not a welfare gain.']
  };

  const wrapper = document.createElement('div');
  wrapper.className = 'migration-welfare-graph';
  svg.removeAttribute('width');
  svg.removeAttribute('height');
  svg.setAttribute('role', 'group');
  svg.setAttribute('aria-label', 'Migration welfare diagram. Explore areas A to J for income and welfare changes.');
  const tooltip = document.createElement('div');
  tooltip.id = 'migration-welfare-tooltip';
  tooltip.className = 'migration-welfare-tooltip';
  tooltip.setAttribute('role', 'tooltip');
  tooltip.hidden = true;
  const title = document.createElement('strong');
  const description = document.createElement('span');
  tooltip.append(title, description);
  wrapper.append(svg, tooltip);
  img.parentElement.replaceWith(wrapper);

  const hint = document.createElement('p');
  hint.className = 'migration-welfare-hint';
  hint.textContent = 'Hover over a letter or shaded area to see who gains or loses. You can also tap, or use Tab. Press Escape to close.';
  wrapper.after(hint);

  let active = null;
  let pinned = false;
  let hideTimer;
  function hide() {
    clearTimeout(hideTimer);
    active?.polygon.classList.remove('is-active');
    active = null;
    pinned = false;
    tooltip.hidden = true;
  }
  function show(area) {
    clearTimeout(hideTimer);
    if (active !== area) pinned = false;
    active?.polygon.classList.remove('is-active');
    active = area;
    area.polygon.classList.add('is-active');
    title.textContent = `${area.letter} — ${areas[area.letter][0]}`;
    description.textContent = areas[area.letter][1];
    tooltip.hidden = false;
  }
  function leave() {
    clearTimeout(hideTimer);
    if (!pinned && document.activeElement !== active?.polygon) hideTimer = setTimeout(hide, 180);
  }
  function toggle(area) {
    if (active === area && pinned) { hide(); return; }
    show(area);
    pinned = true;
  }
  const interactive = letters.map((label, index) => {
    const letter = label.textContent;
    const polygon = polygons[index];
    const area = {letter, label, polygon};
    polygon.classList.add('migration-welfare-area');
    polygon.dataset.welfareArea = letter;
    polygon.setAttribute('tabindex', '0');
    polygon.setAttribute('role', 'button');
    polygon.setAttribute('aria-label', `${letter}: ${areas[letter][0]}. ${areas[letter][1]}`);
    label.classList.add('migration-welfare-letter');
    label.setAttribute('aria-hidden', 'true');
    for (const target of [polygon, label]) {
      target.addEventListener('pointerenter', () => show(area));
      target.addEventListener('pointerleave', leave);
      target.addEventListener('click', event => { event.stopPropagation(); toggle(area); });
    }
    polygon.addEventListener('focus', () => show(area));
    polygon.addEventListener('blur', () => { if (!pinned) hide(); });
    polygon.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        event.stopPropagation();
        toggle(area);
      }
    });
    return area;
  });
  // Preserve the artwork but give keyboard users an alphabetical tab order.
  const group = polygons[0].parentElement;
  interactive.sort((a, b) => a.letter.localeCompare(b.letter)).reverse().forEach(area => group.prepend(area.polygon));
  tooltip.addEventListener('pointerenter', () => clearTimeout(hideTimer));
  tooltip.addEventListener('pointerleave', leave);
  document.addEventListener('pointerdown', event => { if (!wrapper.contains(event.target)) hide(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && active) { event.preventDefault(); event.stopPropagation(); hide(); }
  }, true);
  const connectReveal = () => {
    if (window.Reveal?.isReady()) window.Reveal.on('slidechanged', hide);
  };
  if (document.readyState === 'complete') connectReveal();
  else window.addEventListener('load', connectReveal, {once: true});
})();
