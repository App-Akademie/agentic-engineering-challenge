'use strict';

const form = document.querySelector('#create-form');
const titleInput = document.querySelector('#task-title');
const list = document.querySelector('#task-list');
const content = document.querySelector('#task-content');
const emptyState = document.querySelector('#empty-state');
const notice = document.querySelector('#notice');
const errorMessage = document.querySelector('#error');
const filters = [...document.querySelectorAll('[data-filter]')];
let tasks = [];
let selectedFilter = 'active';
let busy = false;
let loaded = false;

async function api(path, options = {}) {
  const response = await fetch(path, options);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || 'The request failed. Please try again.');
  return data;
}

function setBusy(value) {
  busy = value;
  content.setAttribute('aria-busy', String(value));
  document.querySelectorAll('#create-form button, #create-form input, .filters button, #refresh, #task-list button')
    .forEach(control => { control.disabled = value; });
}

function clearMessages() {
  notice.textContent = '';
  errorMessage.hidden = true;
  errorMessage.textContent = '';
}

function showError(error) {
  const message = error instanceof TypeError ? 'Could not reach the server. Check that it is running.' : error.message;
  errorMessage.textContent = `${message}${message.endsWith('.') ? '' : '.'} Use Refresh to try loading tasks again.`;
  errorMessage.hidden = false;
}

function node(tag, className, text) {
  const element = document.createElement(tag);
  element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function taskRow(task) {
  const row = node('li', 'task-row');
  row.dataset.status = task.status;
  const details = node('div', 'task-details');
  const heading = node('h3', 'task-title', task.title);
  const meta = node('div', 'task-meta');
  const statusLabel = task.status[0].toUpperCase() + task.status.slice(1);
  const badge = node('span', `status ${task.status}`, statusLabel);
  const timestamp = task.archivedAt || task.completedAt || task.createdAt;
  const date = node('time', '', new Date(timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }));
  date.dateTime = timestamp;
  date.title = new Date(timestamp).toLocaleString();
  meta.append(badge, date);
  details.append(heading, meta);
  row.append(details);
  if (task.status !== 'archived') {
    const action = task.status === 'open' ? 'complete' : 'archive';
    const button = node('button', 'task-action', action === 'complete' ? 'Complete' : 'Archive');
    button.type = 'button';
    button.dataset.taskId = task.id;
    button.setAttribute('aria-label', `${action === 'complete' ? 'Complete' : 'Archive'} task: ${task.title}`);
    button.addEventListener('click', () => changeTask(task.id, action));
    row.append(button);
  }
  return row;
}

function render() {
  const counts = Object.fromEntries(['open', 'completed', 'archived'].map(status => [status, tasks.filter(task => task.status === status).length]));
  counts.active = counts.open + counts.completed;
  document.querySelectorAll('[data-count]').forEach(element => { element.textContent = counts[element.dataset.count]; });
  filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === selectedFilter)));
  document.querySelector('#task-summary').textContent = `${counts.open} open · ${counts.completed} completed · ${counts.archived} archived`;
  const visible = tasks.filter(task => selectedFilter === 'active' ? task.status !== 'archived' : task.status === selectedFilter);
  list.replaceChildren(...visible.map(taskRow));
  list.hidden = visible.length === 0;
  emptyState.hidden = visible.length > 0;
  const emptyCopy = {
    active: ['No active tasks.', 'Add a task above.'],
    open: ['No open tasks.', 'Add a task above.'],
    completed: ['No completed tasks.', 'Complete an open task to see it here.'],
    archived: ['No archived tasks.', 'Archive a completed task to see it here.'],
  };
  document.querySelector('#empty-title').textContent = emptyCopy[selectedFilter][0];
  document.querySelector('#empty-description').textContent = emptyCopy[selectedFilter][1];
}

async function loadTasks() {
  if (busy) return;
  clearMessages();
  setBusy(true);
  try {
    const groups = await Promise.all(['open', 'completed', 'archived'].map(status => api(`/tasks?status=${status}`)));
    tasks = groups.flat();
    loaded = true;
    render();
  } catch (error) {
    showError(error);
    if (!loaded) {
      document.querySelector('#task-summary').textContent = 'Tasks could not be loaded.';
      document.querySelector('#empty-title').textContent = 'Couldn’t connect to your tasks.';
      document.querySelector('#empty-description').textContent = 'Check that the reference server is running, then choose Refresh.';
    }
  } finally {
    setBusy(false);
  }
}

async function saveTask(path, options, successMessage, creating = false) {
  if (busy) return;
  clearMessages();
  setBusy(true);
  try {
    const updated = await api(path, options);
    tasks = tasks.filter(task => task.id !== updated.id);
    tasks.push(updated);
    if (creating) {
      titleInput.value = '';
      selectedFilter = 'active';
    }
    render();
    notice.textContent = successMessage;
    return true;
  } catch (error) {
    showError(error);
    return false;
  } finally {
    setBusy(false);
  }
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  const title = titleInput.value.trim();
  if (!title) {
    titleInput.setCustomValidity('Please enter a task title.');
    titleInput.reportValidity();
    return;
  }
  const saved = await saveTask('/tasks', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title }),
  }, 'Task added.', true);
  if (saved) titleInput.focus();
});
titleInput.addEventListener('input', () => titleInput.setCustomValidity(''));

async function changeTask(id, action) {
  const saved = await saveTask(`/tasks/${encodeURIComponent(id)}/${action}`, { method: 'POST' },
    action === 'complete' ? 'Task completed.' : 'Task archived.');
  if (saved) {
    const nextAction = [...list.querySelectorAll('button')].find(button => button.dataset.taskId === id);
    (nextAction || filters.find(button => button.dataset.filter === selectedFilter)).focus();
  }
}

filters.forEach(button => button.addEventListener('click', () => {
  selectedFilter = button.dataset.filter;
  render();
}));
document.querySelector('#refresh').addEventListener('click', loadTasks);
loadTasks();
