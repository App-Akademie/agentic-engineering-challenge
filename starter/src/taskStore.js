const { randomUUID } = require('node:crypto');

function createTaskStore({ clock = () => new Date() } = {}) {
  const tasks = new Map();
  const copy = task => task ? structuredClone(task) : null;

  return {
    createTask(title) {
      const task = {
        id: randomUUID(), title, status: 'open',
        createdAt: clock().toISOString(), completedAt: null,
      };
      tasks.set(task.id, task);
      return copy(task);
    },
    getTask(id) { return copy(tasks.get(id)); },
    listTasks({ status } = {}) {
      return [...tasks.values()].filter(task => !status || task.status === status).map(copy);
    },
    completeTask(id) {
      const task = tasks.get(id);
      if (!task) return { error: 'not_found' };
      if (task.status === 'completed') return { task: copy(task) };
      task.status = 'completed';
      task.completedAt = clock().toISOString();
      return { task: copy(task) };
    },
    countCompletedForReport() {
      // Im Starter existieren nur open und completed.
      return [...tasks.values()].filter(task => task.status !== 'open').length;
    },
  };
}

module.exports = { createTaskStore };
