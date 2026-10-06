(() => {
  const root = document.documentElement;
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const button = document.querySelector('.theme-toggle');
  const isDark = () => root.dataset.theme ? root.dataset.theme === 'dark' : media.matches;
  const syncButton = () => {
    const dark = isDark();
    button.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    button.querySelector('.theme-label').textContent = dark ? 'Light mode' : 'Dark mode';
  };
  button.hidden = false;
  syncButton();
  button.addEventListener('click', () => {
    const next = isDark() ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('blog-theme', next); } catch (_) {}
    syncButton();
  });
  media.addEventListener('change', syncButton);
  window.addEventListener('storage', event => {
    if (event.key !== 'blog-theme') return;
    if (event.newValue === 'light' || event.newValue === 'dark') root.dataset.theme = event.newValue;
    else delete root.dataset.theme;
    syncButton();
  });
  const input = document.getElementById('search');
  if (!input) return;
  document.querySelector('.tools').hidden = false;
  const list = document.querySelector('.post-list');
  const posts = [...list.children];
  const count = document.querySelector('.post-count');
  const empty = document.querySelector('.empty-state');
  const sort = document.getElementById('sort');
  const year = document.getElementById('year');
  const topics = [...document.querySelectorAll('input[name="topic"]')];
  const clear = document.querySelector('.clear-filters');
  const more = document.querySelector('.show-more');
  const browse = document.querySelector('.browse-panel');
  const narrow = window.matchMedia('(max-width: 800px)');
  const syncBrowse = () => { browse.open = !narrow.matches; };
  browse.hidden = false;
  syncBrowse();
  narrow.addEventListener('change', syncBrowse);
  let limit = 12;
  const normalise = text => text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[‘’]/g, "'").toLocaleLowerCase('en-GB');
  const render = () => {
    const words = normalise(input.value).trim().split(/\s+/).filter(Boolean);
    const topic = topics.find(option => option.checked).value;
    const ordered = [...posts].sort((a, b) => {
      if (sort.value === 'az') return normalise(a.dataset.title).localeCompare(normalise(b.dataset.title), 'en-GB');
      const difference = a.dataset.date.localeCompare(b.dataset.date);
      return sort.value === 'oldest' ? difference : -difference;
    });
    const matching = ordered.filter(post =>
      (!topic || post.dataset.topic === topic) &&
      (!year.value || post.dataset.year === year.value) &&
      words.every(word => normalise(post.textContent).includes(word))
    );
    const visible = new Set(matching.slice(0, limit));
    posts.forEach(post => {
      post.hidden = !visible.has(post);
    });
    ordered.forEach(post => list.append(post));
    count.textContent = visible.size < matching.length ? `Showing ${visible.size} of ${matching.length} articles` : `${matching.length} ${matching.length === 1 ? 'article' : 'articles'}`;
    document.getElementById('results-heading').textContent = topic || 'All articles';
    empty.hidden = matching.length !== 0;
    more.hidden = visible.size >= matching.length;
    clear.hidden = !words.length && !topic && !year.value;
  };
  const resetAndRender = () => { limit = 12; render(); };
  input.addEventListener('input', resetAndRender);
  sort.addEventListener('change', resetAndRender);
  year.addEventListener('change', resetAndRender);
  topics.forEach(option => option.addEventListener('change', resetAndRender));
  clear.addEventListener('click', () => {
    input.value = '';
    year.value = '';
    topics[0].checked = true;
    resetAndRender();
    input.focus();
  });
  more.addEventListener('click', () => {
    const previous = new Set(posts.filter(post => !post.hidden));
    limit += 12;
    render();
    // Move focus into the newly revealed results instead of leaving it below them.
    [...list.children].find(post => !post.hidden && !previous.has(post))?.querySelector('a').focus();
  });
  render();
})();
