// Erstellt reproduzierbare Prüfnachweise. Benötigt lokale HTTP-Sockets.
const { spawnSync, spawn } = require('node:child_process');
const { writeFileSync, readFileSync, readdirSync } = require('node:fs');
const { join, resolve, relative } = require('node:path');
const { createHash } = require('node:crypto');
const { once } = require('node:events');
const root = resolve(__dirname, '..');
const evidence = join(root, 'evidence');
const checks = [];

function check(name, args) {
  const result = spawnSync(process.execPath, args, { cwd: root, encoding: 'utf8', timeout: 60_000 });
  writeFileSync(join(evidence, `${name}.txt`), (result.stdout || '') + (result.stderr || ''));
  if (result.error || result.status !== 0) throw new Error(`${name} failed: ${result.error?.message || result.status}`);
  checks.push({ name, command: ['node', ...args], exitCode: result.status });
  console.log(`OK ${name}`);
}

async function smoke(target) {
  const child = spawn(process.execPath, [`${target}/src/server.js`], {
    cwd: root, env: { ...process.env, PORT: '0' }, stdio: ['ignore', 'pipe', 'pipe'],
  });
  const transcript = [];
  let stderr = '';
  child.stderr.on('data', data => { stderr += data; });
  try {
    const ready = await Promise.race([
      once(child.stdout, 'data').then(([data]) => String(data)),
      once(child, 'exit').then(([code]) => { throw new Error(`Server ended ${code}: ${stderr}`); }),
      new Promise((_, reject) => {
        const timer = setTimeout(() => reject(new Error('Server readiness timeout')), 10_000);
        timer.unref();
      }),
    ]);
    const url = ready.match(/http:\/\/127\.0\.0\.1:\d+/)?.[0];
    if (!url) throw new Error(`No server URL: ${ready}`);
    async function call(path, method = 'GET', body, expected = 200) {
      const response = await fetch(url + path, {
        method, headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: AbortSignal.timeout(5_000),
      });
      const data = await response.json();
      transcript.push({ method, path, status: response.status, body: data });
      if (response.status !== expected) throw new Error(`${method} ${path}: expected ${expected}, got ${response.status}`);
      return data;
    }
    const task = await call('/tasks', 'POST', { title: 'Smoke test' }, 201);
    await call(`/tasks/${task.id}/complete`, 'POST');
    const before = await call('/report/summary');
    if (before.completedCount !== 1) throw new Error('Expected completedCount 1');
    if (target === 'reference') {
      const first = await call(`/tasks/${task.id}/archive`, 'POST');
      const second = await call(`/tasks/${task.id}/archive`, 'POST');
      if (JSON.stringify(first) !== JSON.stringify(second)) throw new Error('Idempotence failed');
      const after = await call('/report/summary');
      if (after.completedCount !== 0) throw new Error('Expected completedCount 0 after archive');
      await call(`/tasks/${task.id}/complete`, 'POST', undefined, 409);
      await call('/tasks/archive-completed', 'POST', { olderThanDays: 7 });
    } else {
      await call(`/tasks/${task.id}/archive`, 'POST', undefined, 404);
    }
    writeFileSync(join(evidence, `http-${target}.json`), JSON.stringify(transcript, null, 2) + '\n');
    checks.push({ name: `http-${target}`, requests: transcript.length, exitCode: 0 });
    console.log(`OK http-${target}`);
  } finally {
    if (child.exitCode === null && child.signalCode === null) {
      const exited = once(child, 'exit');
      child.kill();
      await exited;
    }
  }
}

async function main() {
  check('tests', ['--test', '--test-reporter=tap',
    'starter/test/baseline.test.js', 'reference/test/baseline.test.js', 'reference/test/archive.test.js']);
  check('tool-starter', ['tools/run-tests.js', 'starter']);
  check('tool-reference', ['tools/run-tests.js', 'reference']);
  check('regression-demo', ['tools/demo-regression.js']);
  await smoke('starter');
  await smoke('reference');
  const hashes = {};
  function collect(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (['node_modules', 'evidence', '.git'].includes(entry.name)) continue;
      const path = join(directory, entry.name);
      if (entry.isDirectory()) collect(path);
      else hashes[relative(root, path)] = createHash('sha256').update(readFileSync(path)).digest('hex');
    }
  }
  collect(root);
  writeFileSync(join(evidence, 'manifest.json'), JSON.stringify({
    verifiedAt: new Date().toISOString(), node: process.version,
    platform: process.platform, architecture: process.arch, checks, sha256: hashes,
    note: 'Tatsächliche lokale Prüfläufe. Keine separate Agentenprüfung und keine vergangenen Sitzungen nachgewiesen.',
  }, null, 2) + '\n');
}

main().catch(error => { console.error(error); process.exitCode = 1; });
