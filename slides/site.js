document.querySelectorAll('[data-slide]').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    document.getElementById('deck-preview').src = link.getAttribute('href');
    document.getElementById('example').scrollIntoView({block:'start'});
  });
});
document.querySelectorAll('[data-copy-target]').forEach(button => {
  button.addEventListener('click', async () => {
    const status = document.getElementById(button.dataset.copyStatus);
    try {
      await navigator.clipboard.writeText(document.getElementById(button.dataset.copyTarget).textContent);
      status.textContent = 'Prompt copied.';
    } catch {
      status.textContent = 'Select the prompt text and copy it manually.';
    }
  });
});

// Keep shared links useful when their destination is inside closed help.
function revealHelpTarget(hash, scroll = false) {
  let id;
  try {
    id = decodeURIComponent(hash.slice(1));
  } catch {
    return;
  }
  const target = document.getElementById(id);
  if (!target) return;
  for (let element = target; element; element = element.parentElement) {
    if (element.tagName === 'DETAILS') element.open = true;
  }
  if (scroll) target.scrollIntoView({block: 'start'});
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', () => revealHelpTarget(link.getAttribute('href')));
});
window.addEventListener('hashchange', () => revealHelpTarget(location.hash, true));
if (location.hash) revealHelpTarget(location.hash, true);
