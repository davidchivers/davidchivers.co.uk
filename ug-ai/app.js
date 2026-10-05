document.querySelectorAll('[data-copy]').forEach(button => {
  button.addEventListener('click', async () => {
    const text = document.getElementById(button.dataset.copy).textContent.trim();
    const status = document.getElementById(button.dataset.status);
    try {
      await navigator.clipboard.writeText(text);
      status.textContent = 'Prompt copied.';
    } catch {
      status.textContent = 'Select the prompt above and copy it manually.';
    }
  });
});
