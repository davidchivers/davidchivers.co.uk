(() => {
  'use strict';
  const storageKey = 'vscode-copilot-setup-20261008';
  const checks = Array.from(document.querySelectorAll('[data-step]'));
  const saveNote = document.getElementById('saveNote');
  let canSave = true;
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (Array.isArray(saved)) checks.forEach(check => { check.checked = saved.includes(check.dataset.step); });
  } catch (_) {
    canSave = false;
    saveNote.textContent = 'Tick steps as you finish. Progress is available for this visit; this browser could not load saved progress.';
  }
  function updateProgress(save = true) {
    const completed = checks.filter(check => check.checked).map(check => check.dataset.step);
    document.getElementById('progressText').textContent = `${completed.length} of ${checks.length} steps checked`;
    const progress = document.getElementById('setupProgress');
    progress.value = completed.length;
    progress.textContent = `${completed.length} of ${checks.length}`;
    checks.forEach(check => {
      const done = check.checked;
      document.getElementById(check.dataset.step).classList.toggle('is-done', done);
      const link = document.querySelector(`[data-step-link="${check.dataset.step}"]`);
      link.classList.toggle('is-done', done);
      link.setAttribute('aria-label', `${done ? 'Checked: ' : ''}${link.textContent.trim()}`);
    });
    document.getElementById('ready-title').textContent = completed.length === checks.length ? 'Setup complete.' : 'Your setup';
    document.getElementById('readyMessage').textContent = completed.length === checks.length
      ? 'Copilot is connected and you have checked its first file. Open a project folder whenever you want to start another task.'
      : 'Work through the six checks to connect Copilot and try your first task.';
    if (save && canSave) {
      try { localStorage.setItem(storageKey, JSON.stringify(completed)); }
      catch (_) {
        canSave = false;
        saveNote.textContent = 'Tick steps as you finish. Progress is available for this visit; this browser cannot save it.';
      }
    }
  }
  checks.forEach(check => check.addEventListener('change', () => updateProgress()));
  document.getElementById('resetChecklist').addEventListener('click', () => {
    checks.forEach(check => { check.checked = false; });
    updateProgress();
  });
  updateProgress(false);
  const copy = document.getElementById('copyPrompt');
  copy.hidden = false;
  copy.addEventListener('click', async () => {
    const prompt = document.getElementById('firstPrompt');
    let copied = false;
    try { await navigator.clipboard.writeText(prompt.textContent.trim()); copied = true; }
    catch (_) {
      const textarea = document.createElement('textarea');
      textarea.value = prompt.textContent.trim();
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.top = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      try { copied = document.execCommand('copy'); } catch (_) { /* Manual copy below. */ }
      textarea.remove();
      copy.focus();
    }
    copy.textContent = copied ? 'Copied!' : 'Select text to copy';
    copy.setAttribute('aria-label', copied ? 'Prompt copied to clipboard' : 'Copy unavailable; select the prompt text and copy it');
    if (!copied) {
      const range = document.createRange();
      range.selectNodeContents(prompt);
      const selection = window.getSelection();
      if (selection) { selection.removeAllRanges(); selection.addRange(range); }
    }
    window.setTimeout(() => { copy.textContent = 'Copy prompt'; copy.removeAttribute('aria-label'); }, 2500);
  });
})();
