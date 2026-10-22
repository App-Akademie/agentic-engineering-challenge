const { randomUUID } = require('node:crypto');
const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_DAYS = Math.floor(Number.MAX_SAFE_INTEGER / DAY_MS);
const validThreshold = value => Number.isSafeInteger(value) && value > 0 && value <= MAX_DAYS;

function createTaskStore({ clock = () => new Date() } = {}) {
  const tasks = new Map();
  const copy = task => task ? structuredClone(task) : null;

  return {
    createTask(title) {
      const task = {
        id: randomUUID(), title, status: 'open',
        createdAt: clock().toISOString(), completedAt: null, archivedAt: null,
      };
      tasks.set(task.id, task);
      return copy(task);
    },
    getTask(id) { return copy(tasks.get(id)); },
    listTasks({ status } = {}) {
      return [...tasks.values()]
        .filter(task => status ? task.status === status : task.status !== 'archived').map(copy);
    },
    completeTask(id) {
      const task = tasks.get(id);
      if (!task) return { error: 'not_found' };
      if (task.status === 'archived') return { error: 'invalid_transition' };
      if (task.status === 'completed') return { task: copy(task) };
      task.status = 'completed';
      task.completedAt = clock().toISOString();
      return { task: copy(task) };
    },
    archiveTask(id) {
      const task = tasks.get(id);
      if (!task) return { error: 'not_found' };
      if (task.status === 'archived') return { task: copy(task) };
      if (task.status !== 'completed') return { error: 'not_completed' };
      task.status = 'archived';
      task.archivedAt = clock().toISOString();
      return { task: copy(task) };
    },
    bulkArchiveCompleted(olderThanDays) {
      if (!validThreshold(olderThanDays)) return { error: 'invalid_threshold' };
      const now = clock();
      const cutoff = now.getTime() - olderThanDays * DAY_MS;
      let archivedCount = 0;
      for (const task of tasks.values()) {
        if (task.status === 'completed' && Date.parse(task.completedAt) <= cutoff) {
          task.status = 'archived';
          task.archivedAt = now.toISOString();
          archivedCount += 1;
        }
      }
      return { archivedCount };
    },
    countCompletedForReport() {
      // REPORT_PREDICATE: Die Demo ersetzt nur diese Bedingung in einer temporären Kopie.
      return [...tasks.values()].filter(task => task.status === 'completed').length;
    },
  };
}

module.exports = { createTaskStore, validThreshold, MAX_DAYS };
