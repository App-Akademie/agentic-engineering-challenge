const { mkdtempSync, readFileSync, writeFileSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join, resolve } = require('node:path');
const { spawnSync } = require('node:child_process');
const root = resolve(__dirname, '..');
const directory = mkdtempSync(join(tmpdir(), 'agentic-report-demo-'));
try {
  const source = readFileSync(join(root, 'reference/src/taskStore.js'), 'utf8');
  const correct = "filter(task => task.status === 'completed').length";
  if (source.split(correct).length !== 2) throw new Error('Demo erwartet genau eine Report-Bedingung');
  const broken = join(directory, 'taskStore.js');
  writeFileSync(broken, source.replace(correct, "filter(task => task.status !== 'open').length"));
  console.log('Lehrdemo: Eine TEMPORÄRE Kopie verwendet den alten Report-Filter. Erwartung: 1 Test rot.');
  const result = spawnSync(process.execPath, ['--test', '--test-reporter=tap', join(root, 'demos/report-regression.test.js')], {
    cwd: root, env: { ...process.env, DEMO_STORE_PATH: broken }, encoding: 'utf8', timeout: 30_000,
  });
  process.stdout.write(result.stdout || '');
  process.stderr.write(result.stderr || '');
  const expected = !result.error && result.status === 1
    && result.stdout.includes('ERR_ASSERTION') && /# fail 1\b/.test(result.stdout);
  console.log(expected ? 'Erwarteter Fehler reproduziert. Die Referenz bleibt unverändert.' : 'Demo nicht wie erwartet verlaufen.');
  process.exitCode = expected ? 0 : 1;
} finally {
  rmSync(directory, { recursive: true, force: true });
}
