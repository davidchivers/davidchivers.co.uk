// Apply the saved preference before paint; the CSS also works without JavaScript.
try {
  const theme = localStorage.getItem('blog-theme');
  if (theme === 'light' || theme === 'dark') document.documentElement.dataset.theme = theme;
} catch (_) { /* Private browsing may disable storage. */ }
