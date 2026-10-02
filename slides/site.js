document.querySelectorAll('[data-slide]').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    document.getElementById('deck-preview').src = link.getAttribute('href');
    document.getElementById('example').scrollIntoView({block:'start'});
  });
});
document.getElementById('copy-prompt').addEventListener('click', async () => {
  const status = document.getElementById('copy-status');
  try {
    await navigator.clipboard.writeText(document.getElementById('prompt-text').textContent);
    status.textContent = 'Prompt copied.';
  } catch {
    status.textContent = 'Select the prompt text and copy it manually.';
  }
});
