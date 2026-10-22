const { test } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { createApp } = require('../src/app');

test('Browser-Oberfläche und lokale Assets sind ohne Build erreichbar', async () => {
  const api = request(createApp());
  const page = await api.get('/').expect(200).expect('Content-Type', /html/);
  assert.match(page.text, /<form id="create-form"/);
  assert.match(page.text, /src="\/app.js"/);
  assert.match(page.text, /href="\/styles.css"/);
  await api.get('/app.js').expect(200).expect('Content-Type', /javascript/);
  await api.get('/styles.css').expect(200).expect('Content-Type', /css/);
  await api.get('/walkthrough.js').expect(200).expect('Content-Type', /javascript/);
  const missing = await api.get('/missing.css').expect(404);
  assert.deepEqual(missing.body, { error: { code: 'not_found', message: 'route not found' } });
});

test('Browser-Seite und Assets verändern vorhandene Task-Daten nicht', async () => {
  const api = request(createApp());
  const { body: task } = await api.post('/tasks').send({ title: '<b>Nur Text</b>' }).expect(201);
  await api.get('/').expect(200);
  await api.get('/app.js').expect(200);
  assert.deepEqual((await api.get('/tasks').expect(200)).body, [task]);
  await api.post(`/tasks/${task.id}/complete`).expect(200);
  await api.post(`/tasks/${task.id}/archive`).expect(200);
  assert.deepEqual((await api.get('/tasks').expect(200)).body, []);
  assert.equal((await api.get('/tasks?status=archived').expect(200)).body[0].title, task.title);
});
