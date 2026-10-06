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
  document.querySelector('.search-wrap').hidden = false;
  const posts = [...document.querySelectorAll('.post-list li')];
  const count = document.querySelector('.post-count');
  const empty = document.querySelector('.empty-state');
  const normalise = text => text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[‘’]/g, "'").toLocaleLowerCase('en-GB');
  input.addEventListener('input', () => {
    const words = normalise(input.value).trim().split(/\s+/).filter(Boolean);
    let visible = 0;
    posts.forEach(post => {
      const match = words.every(word => normalise(post.dataset.title).includes(word));
      post.hidden = !match;
      if (match) visible++;
    });
    count.textContent = words.length ? `${visible} of ${posts.length} articles` : `${posts.length} articles · A–Z`;
    empty.hidden = visible !== 0;
  });
})();
