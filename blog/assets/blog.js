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
  const posts = [...document.querySelectorAll('.post-card')];
  const groups = [...document.querySelectorAll('.year-group')];
  const groupContainer = document.querySelector('.year-groups');
  const alphabetical = document.querySelector('.alphabetical-results');
  const alphabeticalList = document.getElementById('alphabetical-list');
  const count = document.querySelector('.post-count');
  const empty = document.querySelector('.empty-state');
  const sort = document.getElementById('sort');
  const yearLinks = [...document.querySelectorAll('.year-links a')];
  const clear = document.querySelector('.clear-filters');
  const browse = document.querySelector('.browse-panel');
  const narrow = window.matchMedia('(max-width: 800px)');
  const syncBrowse = () => { browse.open = !narrow.matches; };
  syncBrowse();
  narrow.addEventListener('change', syncBrowse);
  let selectedYear = location.hash.match(/^#year-(\d{4})$/)?.[1] || '';
  if (!groups.some(group => group.dataset.year === selectedYear)) selectedYear = '';
  const normalise = text => text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[‘’]/g, "'").toLocaleLowerCase('en-GB');
  const render = () => {
    const words = normalise(input.value).trim().split(/\s+/).filter(Boolean);
    const ordered = [...posts].sort((a, b) => {
      if (sort.value === 'az') return normalise(a.dataset.title).localeCompare(normalise(b.dataset.title), 'en-GB');
      const difference = a.dataset.date.localeCompare(b.dataset.date);
      return sort.value === 'oldest' ? difference : -difference;
    });
    const matching = ordered.filter(post =>
      (!selectedYear || post.dataset.year === selectedYear) &&
      words.every(word => normalise(post.textContent).includes(word))
    );
    const visible = new Set(matching);
    posts.forEach(post => {
      post.hidden = !visible.has(post);
    });
    const isAlphabetical = sort.value === 'az';
    ordered.forEach(post => {
      const target = isAlphabetical ? alphabeticalList : groups.find(group => group.dataset.year === post.dataset.year).querySelector('.post-list');
      target.append(post);
    });
    [...groups].sort((a, b) => sort.value === 'oldest' ? Number(a.dataset.year) - Number(b.dataset.year) : Number(b.dataset.year) - Number(a.dataset.year)).forEach(group => {
      group.hidden = !matching.some(post => post.dataset.year === group.dataset.year);
      groupContainer.append(group);
    });
    groupContainer.hidden = isAlphabetical;
    alphabetical.hidden = !isAlphabetical || matching.length === 0;
    count.textContent = `${matching.length} ${matching.length === 1 ? 'article' : 'articles'}${selectedYear ? ` from ${selectedYear}` : ''}`;
    yearLinks.forEach(link => {
      if (link.dataset.year === selectedYear) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
    empty.hidden = matching.length !== 0;
    clear.hidden = !words.length && !selectedYear;
  };
  input.addEventListener('input', render);
  sort.addEventListener('change', render);
  yearLinks.forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    selectedYear = link.dataset.year;
    history.replaceState(null, '', link.getAttribute('href'));
    render();
    if (narrow.matches) {
      browse.open = false;
      input.focus();
    }
  }));
  clear.addEventListener('click', () => {
    input.value = '';
    selectedYear = '';
    history.replaceState(null, '', '#articles');
    render();
    input.focus();
  });
  render();
})();
