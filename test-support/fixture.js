const request = require('supertest');

function fixture(createApp, createTaskStore) {
  let now = new Date('2026-10-22T12:00:00.000Z');
  const store = createTaskStore({ clock: () => new Date(now) });
  const api = request(createApp({ store }));
  return {
    store, api,
    at(value) { now = new Date(value); },
    async completedAt(value, title = 'Task') {
      now = new Date(value);
      const created = await api.post('/tasks').send({ title }).expect(201);
      await api.post(`/tasks/${created.body.id}/complete`).expect(200);
      return created.body.id;
    },
  };
}

module.exports = { fixture };
