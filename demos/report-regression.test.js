// Absichtlich fehlschlagende Lehrdemo. Gehört NICHT zur regulären Testsuite.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createApp } = require('../reference/src/app');
const { fixture } = require('../test-support/fixture');
const { createTaskStore } = require(process.env.DEMO_STORE_PATH);

test('Report muss archivierte Tasks ausschließen', async () => {
  const f = fixture(createApp, createTaskStore);
  const id = await f.completedAt('2026-10-01T12:00:00.000Z');
  await f.api.post(`/tasks/${id}/archive`).expect(200);
  const { body } = await f.api.get('/report/summary').expect(200);
  assert.equal(body.completedCount, 0, 'Archivierte Tasks dürfen nicht mitgezählt werden');
});
