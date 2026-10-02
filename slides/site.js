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
