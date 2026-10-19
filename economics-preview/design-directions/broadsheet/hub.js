// Broadsheet hub: the "edition" sentence re-leads the front page for each reader.
// An edition can also be linked directly, e.g. index.html?for=join (nothing is stored).
(() => {
  'use strict';
  const select = document.getElementById('edition');
  const stories = document.getElementById('stories');
  const note = document.getElementById('edition-note');
  if (!select || !stories) return;
  const KEYS = ['apply', 'join', 'here'];
  const NOTES = {
    all: 'All three stories, side by side.',
    apply: 'Leading with courses and applying. The other two stories follow.',
    join: 'Leading with your first weeks. The other two stories follow.',
    here: 'Leading with the everyday essentials. The other two stories follow.'
  };

  function setEdition(value, animate) {
    if (!(value in NOTES)) value = 'all';
    stories.dataset.edition = value;
    let n = 0;
    KEYS.forEach(k => {
      const el = document.getElementById('story-' + k);
      el.classList.remove('is-lead', 'is-other', 'first', 'second');
      if (value === 'all') return;
      if (k === value) el.classList.add('is-lead');
      else el.classList.add('is-other', n++ ? 'second' : 'first');
    });
    select.value = value;
    note.textContent = NOTES[value];
    if (animate) {
      stories.classList.remove('fade');
      void stories.offsetWidth; // restart the short entrance animation
      stories.classList.add('fade');
    }
  }

  select.addEventListener('change', () => setEdition(select.value, true));
  const wanted = new URLSearchParams(location.search).get('for');
  setEdition(wanted || 'all', false);
})();
