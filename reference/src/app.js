const express = require('express');
const { createTaskStore, validThreshold } = require('./taskStore');

function createApp({ store = createTaskStore() } = {}) {
  const app = express();
  app.use(express.json());
  const fail = (res, status, code, message) => res.status(status).json({ error: { code, message } });

  app.post('/tasks', (req, res) => {
    const title = req.body?.title;
    if (typeof title !== 'string' || title.trim() === '') {
      return fail(res, 400, 'invalid_title', 'title must be a non-empty string');
    }
    return res.status(201).json(store.createTask(title.trim()));
  });
  app.get('/tasks', (req, res) => {
    const { status } = req.query;
    if (status !== undefined && !['open', 'completed', 'archived'].includes(status)) {
      return fail(res, 400, 'invalid_status', 'unsupported task status');
    }
    return res.json(store.listTasks({ status }));
  });
  app.get('/tasks/:id', (req, res) => {
    const task = store.getTask(req.params.id);
    return task ? res.json(task) : fail(res, 404, 'not_found', 'task not found');
  });
  app.post('/tasks/:id/complete', (req, res) => {
    const result = store.completeTask(req.params.id);
    if (result.error === 'not_found') return fail(res, 404, 'not_found', 'task not found');
    if (result.error) return fail(res, 409, 'invalid_transition', 'archived tasks cannot be completed');
    return res.json(result.task);
  });
  app.post('/tasks/:id/archive', (req, res) => {
    const result = store.archiveTask(req.params.id);
    if (result.error === 'not_found') return fail(res, 404, 'not_found', 'task not found');
    if (result.error) return fail(res, 409, 'not_completed', 'only completed tasks can be archived');
    return res.json(result.task);
  });
  app.post('/tasks/archive-completed', (req, res) => {
    const olderThanDays = req.body?.olderThanDays;
    if (!validThreshold(olderThanDays)) {
      return fail(res, 400, 'invalid_threshold', 'olderThanDays must be a positive integer within the supported range');
    }
    return res.json(store.bulkArchiveCompleted(olderThanDays));
  });
  app.get('/report/summary', (req, res) => res.json({ completedCount: store.countCompletedForReport() }));
  app.use((req, res) => fail(res, 404, 'not_found', 'route not found'));
  app.use((error, req, res, next) => {
    if (error.type === 'entity.parse.failed') return fail(res, 400, 'invalid_json', 'body must be valid JSON');
    return fail(res, 500, 'internal_error', 'unexpected server error');
  });
  return app;
}

module.exports = { createApp };
