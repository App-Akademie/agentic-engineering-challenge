const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createApp } = require('../src/app');
const { createTaskStore, MAX_DAYS } = require('../src/taskStore');
const { fixture } = require('../../test-support/fixture');
const fresh = () => fixture(createApp, createTaskStore);
const NOW = '2026-10-22T12:00:00.000Z';

test('A1: completed → archived erhält Identität, Titel und Abschlusszeit', async () => {
  const f = fresh();
  const id = await f.completedAt('2026-10-01T12:00:00.000Z');
  const before = f.store.getTask(id);
  f.at(NOW);
  const { body } = await f.api.post(`/tasks/${id}/archive`).expect(200);
  assert.deepEqual(body, { ...before, status: 'archived', archivedAt: NOW });
  assert.deepEqual((await f.api.get(`/tasks/${id}`).expect(200)).body, body);
});

test('A2: erneutes Archivieren ist vollständig idempotent, auch archivedAt', async () => {
  const f = fresh();
  const id = await f.completedAt('2026-10-01T12:00:00.000Z');
  f.at(NOW);
  const first = await f.api.post(`/tasks/${id}/archive`).expect(200);
  f.at('2026-10-23T12:00:00.000Z');
  const second = await f.api.post(`/tasks/${id}/archive`).expect(200);
  assert.deepEqual(second.body, first.body);
});

test('A3: open → archive liefert 409 und verändert nichts', async () => {
  const f = fresh();
  const { body } = await f.api.post('/tasks').send({ title: 'offen' }).expect(201);
  const response = await f.api.post(`/tasks/${body.id}/archive`).expect(409);
  assert.equal(response.body.error.code, 'not_completed');
  assert.deepEqual(f.store.getTask(body.id), body);
});

test('A4: Archivieren einer unbekannten ID liefert 404', async () => {
  const { api } = fresh();
  const { body } = await api.post('/tasks/missing/archive').expect(404);
  assert.equal(body.error.code, 'not_found');
});

test('A5: bestehender Complete-Endpunkt kann archivierte Tasks nicht reaktivieren', async () => {
  const f = fresh();
  const id = await f.completedAt('2026-10-01T12:00:00.000Z');
  const archived = await f.api.post(`/tasks/${id}/archive`).expect(200);
  const response = await f.api.post(`/tasks/${id}/complete`).expect(409);
  assert.equal(response.body.error.code, 'invalid_transition');
  assert.deepEqual(f.store.getTask(id), archived.body);
});

test('A6: Standardliste blendet archivierte Tasks aus; expliziter Filter findet sie', async () => {
  const f = fresh();
  const id = await f.completedAt(NOW);
  await f.api.post(`/tasks/${id}/archive`).expect(200);
  const { body: open } = await f.api.post('/tasks').send({ title: 'bleibt' }).expect(201);
  assert.deepEqual((await f.api.get('/tasks').expect(200)).body.map(t => t.id), [open.id]);
  assert.deepEqual((await f.api.get('/tasks?status=archived').expect(200)).body.map(t => t.id), [id]);
});

test('A7: Report zählt completed, aber weder open noch archived', async () => {
  const f = fresh();
  const id = await f.completedAt(NOW);
  await f.completedAt(NOW, 'bleibt abgeschlossen');
  await f.api.post('/tasks').send({ title: 'offen' }).expect(201);
  assert.equal((await f.api.get('/report/summary').expect(200)).body.completedCount, 2);
  await f.api.post(`/tasks/${id}/archive`).expect(200);
  assert.equal((await f.api.get('/report/summary').expect(200)).body.completedCount, 1);
});

test('B1: Bulk beachtet die inklusive Grenze, neuere/open/archived bleiben unverändert', async () => {
  const f = fresh();
  const old = await f.completedAt('2026-10-01T12:00:00.000Z');
  const boundary = await f.completedAt('2026-10-15T12:00:00.000Z');
  const recent = await f.completedAt('2026-10-15T12:00:00.001Z');
  const archived = await f.completedAt('2026-10-01T12:00:00.000Z');
  await f.api.post(`/tasks/${archived}/archive`).expect(200);
  const { body: open } = await f.api.post('/tasks').send({ title: 'offen' }).expect(201);
  const unchanged = [recent, archived, open.id].map(id => f.store.getTask(id));
  f.at(NOW);
  const response = await f.api.post('/tasks/archive-completed').send({ olderThanDays: 7 }).expect(200);
  assert.deepEqual(response.body, { archivedCount: 2 });
  for (const id of [old, boundary]) {
    assert.equal(f.store.getTask(id).status, 'archived');
    assert.equal(f.store.getTask(id).archivedAt, NOW);
  }
  for (const task of unchanged) assert.deepEqual(f.store.getTask(task.id), task);
});

test('B2: erneuter Bulk-Lauf zählt keine bereits archivierten Tasks', async () => {
  const f = fresh();
  const id = await f.completedAt('2026-10-01T12:00:00.000Z');
  f.at(NOW);
  assert.deepEqual((await f.api.post('/tasks/archive-completed').send({ olderThanDays: 7 }).expect(200)).body, { archivedCount: 1 });
  const before = f.store.getTask(id);
  f.at('2026-10-23T12:00:00.000Z');
  assert.deepEqual((await f.api.post('/tasks/archive-completed').send({ olderThanDays: 7 }).expect(200)).body, { archivedCount: 0 });
  assert.deepEqual(f.store.getTask(id), before);
});

test('B3: leerer Store liefert archivedCount 0', async () => {
  const { api } = fresh();
  assert.deepEqual((await api.post('/tasks/archive-completed').send({ olderThanDays: 1 }).expect(200)).body, { archivedCount: 0 });
});

test('B4: ungültige Schwellen werden vor jeder Mutation abgelehnt', async () => {
  const f = fresh();
  const id = await f.completedAt('2026-01-01T12:00:00.000Z');
  const before = f.store.getTask(id);
  f.at(NOW);
  for (const olderThanDays of [0, -1, 1.5, '7', null, true, [], {}, MAX_DAYS + 1]) {
    const response = await f.api.post('/tasks/archive-completed').send({ olderThanDays }).expect(400);
    assert.equal(response.body.error.code, 'invalid_threshold');
    assert.deepEqual(f.store.getTask(id), before);
  }
  for (const body of [{}, [], null]) {
    const call = f.api.post('/tasks/archive-completed');
    const response = await (body === null ? call : call.send(body)).expect(400);
    assert.equal(response.body.error.code, 'invalid_threshold');
    assert.deepEqual(f.store.getTask(id), before);
  }
});

test('B5: größte unterstützte Schwelle ist gültig und archiviert keine aktuellen Tasks', async () => {
  const f = fresh();
  const id = await f.completedAt(NOW);
  assert.deepEqual((await f.api.post('/tasks/archive-completed').send({ olderThanDays: MAX_DAYS }).expect(200)).body, { archivedCount: 0 });
  assert.equal(f.store.getTask(id).status, 'completed');
});

test('B6: Tage sind exakt 24 Stunden, auch über eine Zeitumstellung', async () => {
  const f = fresh();
  // Europäische Sommerzeit endet am 25.10.2026; die Regel verwendet verstrichene Zeit.
  const boundary = await f.completedAt('2026-10-24T12:00:00.000Z');
  const recent = await f.completedAt('2026-10-24T12:00:00.001Z');
  f.at('2026-10-25T12:00:00.000Z');
  assert.deepEqual((await f.api.post('/tasks/archive-completed').send({ olderThanDays: 1 }).expect(200)).body, { archivedCount: 1 });
  assert.equal(f.store.getTask(boundary).status, 'archived');
  assert.equal(f.store.getTask(recent).status, 'completed');
});

test('C1: Rückgabewerte sind Kopien und erlauben keine Mutation am Repository vorbei', () => {
  const { store } = fresh();
  const task = store.createTask('Original');
  task.title = 'manipuliert';
  store.getTask(task.id).status = 'archived';
  store.listTasks()[0].title = 'auch manipuliert';
  const completed = store.completeTask(task.id);
  completed.task.title = 'manipuliert';
  const archived = store.archiveTask(task.id);
  archived.task.status = 'open';
  assert.equal(store.getTask(task.id).title, 'Original');
  assert.equal(store.getTask(task.id).status, 'archived');
});

test('C2: Repository validiert auch direkte Bulk-Aufrufe', () => {
  const { store } = fresh();
  for (const value of [NaN, Infinity, 0, '7', MAX_DAYS + 1]) {
    assert.deepEqual(store.bulkArchiveCompleted(value), { error: 'invalid_threshold' });
  }
});

test('C3: jede App besitzt einen eigenen Store', async () => {
  const first = fresh();
  const second = fresh();
  await first.api.post('/tasks').send({ title: 'nur in App 1' }).expect(201);
  assert.deepEqual((await second.api.get('/tasks').expect(200)).body, []);
});
