'use strict';

const timetableBox = document.getElementById('timetable');
const promptBox = document.getElementById('prompt');
const copyButton = document.getElementById('copy');
const selectButton = document.getElementById('select-message');
const details = document.getElementById('prompt-details');
const help = document.getElementById('help');
const downloadMessage = document.getElementById('download-message');
const status = document.getElementById('status');
const placeholder = '[PASTE YOUR COMPLETE LIST REPORT HERE]';
let instructions = '';
let loadFailed = false;
let downloadUrl;

function updateMessage() {
  const timetable = timetableBox.value.trim();
  const ready = Boolean(instructions && timetable);
  promptBox.value = instructions ? instructions + (timetable || placeholder) : '';
  copyButton.disabled = selectButton.disabled = !ready;
  copyButton.textContent = 'Copy for Copilot';
  downloadMessage.hidden = !ready;
  if (downloadUrl) URL.revokeObjectURL(downloadUrl);
  downloadUrl = undefined;
  downloadMessage.removeAttribute('href');
  if (ready) {
    downloadUrl = URL.createObjectURL(new Blob([promptBox.value], { type: 'text/plain;charset=utf-8' }));
    downloadMessage.href = downloadUrl;
    status.textContent = 'Ready to copy.';
  } else if (loadFailed) {
    status.textContent = 'Instructions could not load. Refresh this page, or download the instructions below and add your timetable at the end.';
  } else {
    status.textContent = timetable ? 'Loading the instructions…' : '';
  }
}

function selectMessage() {
  help.open = true;
  details.open = true;
  promptBox.focus();
  promptBox.select();
  promptBox.setSelectionRange(0, promptBox.value.length);
  status.textContent = 'Full message selected. Press Ctrl+C (or ⌘+C), then paste into Copilot.';
}

fetch(document.getElementById('download-prompt').getAttribute('href'), { cache: 'no-cache' })
  .then(response => {
    if (!response.ok) throw new Error('Prompt unavailable');
    return response.text();
  })
  .then(text => {
    const template = text.trimEnd();
    if (!template.endsWith(placeholder)) throw new Error('Prompt format unavailable');
    instructions = template.slice(0, -placeholder.length);
    updateMessage();
  })
  .catch(() => {
    loadFailed = true;
    help.open = true;
    details.open = true;
    updateMessage();
  });

timetableBox.addEventListener('input', updateMessage);
selectButton.addEventListener('click', selectMessage);
copyButton.addEventListener('click', async () => {
  const message = promptBox.value;
  try {
    await navigator.clipboard.writeText(message);
    // An edit during the clipboard operation invalidates this success message.
    if (message !== promptBox.value) return;
    copyButton.textContent = 'Copied';
    status.textContent = 'Copied. Paste into Copilot and send.';
  } catch {
    if (message === promptBox.value) selectMessage();
  }
});
