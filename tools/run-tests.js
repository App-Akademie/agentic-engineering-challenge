const { spawnSync } = require('node:child_process');
const { resolve, join } = require('node:path');
const { readdirSync } = require('node:fs');
const root = resolve(__dirname, '..');

function runProjectTests({ target }) {
  if (!['starter', 'reference'].includes(target)) throw new Error('target must be starter or reference');
  const directory = join(root, target, 'test');
  const files = readdirSync(directory).filter(name => name.endsWith('.test.js')).sort().map(name => join(directory, name));
  const result = spawnSync(process.execPath, ['--test', '--test-reporter=tap', ...files], {
    cwd: root, encoding: 'utf8', timeout: 60_000, maxBuffer: 2 * 1024 * 1024,
  });
  return {
    target, ok: result.status === 0 && !result.error,
    exitCode: result.status, error: result.error?.message || null,
    stdout: result.stdout || '', stderr: result.stderr || '',
  };
}

if (require.main === module) {
  try {
    const result = runProjectTests({ target: process.argv[2] || 'reference' });
    process.stdout.write(JSON.stringify(result, null, 2) + '\n');
    process.exitCode = result.ok ? 0 : 1;
  } catch (error) {
    process.stdout.write(JSON.stringify({ ok: false, error: error.message }) + '\n');
    process.exitCode = 2;
  }
}

module.exports = { runProjectTests };
