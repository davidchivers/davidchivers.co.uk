// Wayfinder hub: stage switch, seminar countdown, link filter and the tab bar's "you are here".
(() => {
  'use strict';
  const $ = id => document.getElementById(id);

  /* Stage switch: show the stops for one stage, or all of them */
  const line = $('line');
  const zones = [...document.querySelectorAll('.zone')];
  const buttons = [...document.querySelectorAll('.switch button')];
  const NAMES = { apply: 'applying', start: 'starting', study: 'studying' };
  function showZone(key, fromUser) {
    buttons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.zone === key)));
    zones.forEach(z => { z.hidden = key !== 'all' && z.dataset.zone !== key; });
    line.classList.toggle('filtered', key !== 'all');
    const count = zones.filter(z => !z.hidden).reduce((n, z) => n + z.querySelectorAll('.stops li').length, 0);
    $('switch-note').textContent = key === 'all' ? `Showing all ${count} stops.` : `Showing ${count} stops for ${NAMES[key]}. Choose “All stops” to see everything.`;
    if (fromUser && window.matchMedia('(max-width: 999px)').matches) {
      const target = zones.find(z => !z.hidden);
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (target && target.getBoundingClientRect().top > window.innerHeight * .8) target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }
  }
  buttons.forEach(b => b.addEventListener('click', () => showZone(b.dataset.zone, true)));
  const wanted = new URLSearchParams(location.search).get('stage');
  showZone(wanted in NAMES ? wanted : 'all', false);

  /* Seminar board: days until each published date, from this device's clock */
  const today = new Date();
  const t0 = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  document.querySelectorAll('.board-rows li[data-date]').forEach(li => {
    const [y, m, d] = li.dataset.date.split('-').map(Number);
    const days = Math.round((Date.UTC(y, m - 1, d) - t0) / 86400000);
    const label = days < 0 ? 'Past' : days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `In ${days} days`;
    li.querySelector('.when').textContent = label;
    li.classList.toggle('past', days < 0);
  });

  /* Pocket links filter: runs on this page only */
  const input = $('filter');
  const items = [...document.querySelectorAll('#pocket-list li')];
  function filter() {
    const words = input.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    let shown = 0;
    items.forEach(li => {
      const hay = (li.textContent + ' ' + li.dataset.tags).toLowerCase();
      const match = words.every(w => hay.includes(w));
      li.hidden = !match;
      if (match) shown++;
    });
    $('no-match').hidden = shown > 0;
    $('filter-count').textContent = shown === items.length ? `${shown} links` : shown === 0 ? 'No matches' : `${shown} of ${items.length} links`;
  }
  if (input) { input.addEventListener('input', filter); filter(); }

  /* Tab bar: mark the section currently in view */
  const tabs = [...document.querySelectorAll('.tabbar a')];
  if ('IntersectionObserver' in window && tabs.length) {
    // The whole route column counts as "Routes", not just its heading panel.
    const watched = [[document.querySelector('.col-main'), '#route'], [$('seminars'), '#seminars'], [$('prepare'), '#prepare'], [$('pocket'), '#pocket']];
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const href = watched.find(([el]) => el === e.target)[1];
        tabs.forEach(t => {
          if (t.getAttribute('href') === href) t.setAttribute('aria-current', 'true');
          else t.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    watched.forEach(([el]) => { if (el) io.observe(el); });
  }
})();
