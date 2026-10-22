const { test } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

function baseline(createApp) {
  test('Bestand: Task anlegen, lesen, abschließen und berichten', async () => {
    const api = request(createApp());
    const created = await api.post('/tasks').send({ title: '  Dokumentation  ' }).expect(201);
    assert.equal(created.body.title, 'Dokumentation');
    assert.equal(created.body.status, 'open');
    assert.equal((await api.get('/tasks').expect(200)).body.length, 1);
    await api.get(`/tasks/${created.body.id}`).expect(200);
    await api.post(`/tasks/${created.body.id}/complete`).expect(200);
    assert.deepEqual((await api.get('/report/summary').expect(200)).body, { completedCount: 1 });
    assert.equal((await api.get('/tasks?status=completed').expect(200)).body.length, 1);
  });
  test('Bestand: leere und nicht-textuelle Titel werden abgelehnt', async () => {
    const api = request(createApp());
    for (const title of ['', '  ', null, 42, {}, []]) {
      const result = await api.post('/tasks').send({ title }).expect(400);
      assert.equal(result.body.error.code, 'invalid_title');
    }
    await api.post('/tasks').expect(400);
    assert.deepEqual((await api.get('/tasks').expect(200)).body, []);
  });
  test('Bestand: erneutes Abschließen ändert completedAt nicht', async () => {
    const api = request(createApp());
    const { body } = await api.post('/tasks').send({ title: 'x' }).expect(201);
    const first = await api.post(`/tasks/${body.id}/complete`).expect(200);
    const second = await api.post(`/tasks/${body.id}/complete`).expect(200);
    assert.deepEqual(first.body, second.body);
  });
  test('Bestand: unbekannte IDs, Routen und ungültige Statusfilter', async () => {
    const api = request(createApp());
    for (const response of [
      await api.get('/tasks/missing').expect(404),
      await api.post('/tasks/missing/complete').expect(404),
      await api.get('/missing').expect(404),
    ]) assert.equal(response.body.error.code, 'not_found');
    const invalid = await api.get('/tasks?status=wrong').expect(400);
    assert.equal(invalid.body.error.code, 'invalid_status');
  });
  test('Bestand: ungültiges JSON nutzt das vereinbarte Fehlerformat', async () => {
    const response = await request(createApp()).post('/tasks')
      .set('Content-Type', 'application/json').send('{').expect(400);
    assert.equal(response.body.error.code, 'invalid_json');
    assert.equal(typeof response.body.error.message, 'string');
  });
}

module.exports = { baseline };
