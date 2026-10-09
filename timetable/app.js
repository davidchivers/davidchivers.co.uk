'use strict';

const promptBox = document.getElementById('prompt');
const copyButton = document.getElementById('copy');
const status = document.getElementById('status');

fetch('prompt.txt')
  .then(response => {
    if (!response.ok) throw new Error('Prompt unavailable');
    return response.text();
  })
  .then(text => {
    promptBox.value = text;
    copyButton.disabled = false;
  })
  .catch(() => {
    document.getElementById('prompt-details').open = true;
    status.textContent = 'Use “Download prompt as text” below to open and copy it.';
  });

copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(promptBox.value);
    copyButton.textContent = 'Copied';
    status.textContent = 'Paste into Copilot, then add your timetable underneath.';
  } catch {
    document.getElementById('prompt-details').open = true;
    promptBox.focus();
    promptBox.select();
    status.textContent = 'Prompt selected. Press Ctrl+C (or Command+C) to copy.';
  }
});
