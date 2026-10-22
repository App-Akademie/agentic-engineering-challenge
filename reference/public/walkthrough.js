'use strict';

(() => {
  const checklist = document.querySelector('#walkthrough');
  const steps = [...checklist.querySelectorAll('[data-step]')];
  const progress = document.querySelector('#walkthrough-progress');
  const storageNote = document.querySelector('#walkthrough-storage');
  const message = document.querySelector('#walkthrough-message');
  const storageKey = 'agentic-engineering-challenge.walkthrough.v1';

  function storageUnavailable() {
    storageNote.textContent = 'Browserspeicher nicht verfügbar. Die Häkchen gelten nur bis zum Neuladen; sichere deinen Fortschritt im eigenen Handover.';
  }

  function updateProgress() {
    progress.textContent = `${steps.filter(step => step.checked).length} von ${steps.length} Schritten erledigt`;
  }

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (Array.isArray(saved)) steps.forEach(step => { step.checked = saved.includes(step.dataset.step); });
  } catch {
    storageUnavailable();
  }
  updateProgress();

  steps.forEach(step => step.addEventListener('change', () => {
    updateProgress();
    try {
      localStorage.setItem(storageKey, JSON.stringify(steps.filter(item => item.checked).map(item => item.dataset.step)));
    } catch {
      storageUnavailable();
    }
  }));

  checklist.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', async () => {
    const prompt = document.getElementById(button.dataset.copy);
    try {
      await navigator.clipboard.writeText(prompt.textContent.trim());
      message.textContent = 'Prompt kopiert. Füge ihn in deinen Agenten-Chat ein.';
    } catch {
      prompt.focus();
      message.textContent = 'Kopieren nicht möglich. Markiere den sichtbaren Prompt und kopiere ihn manuell.';
    }
  }));
})();
