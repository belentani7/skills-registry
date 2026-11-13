import { test, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const cli = fileURLToPath(new URL('../cli/dist/index.js', import.meta.url));

test('built package entry point reports its version without network access', () => {
  const result = spawnSync(process.execPath, [cli, '--version'], { encoding: 'utf8' });
  expect(result.status).toBe(0);
  expect(result.stderr).toBe('');
  expect(result.stdout).toContain('1.0.0');
});

test('built CLI exposes documented commands', () => {
  const result = spawnSync(process.execPath, [cli, '--help'], { encoding: 'utf8' });
  expect(result.status).toBe(0);
  for (const command of ['add', 'list', 'search', 'info']) {
    expect(result.stdout).toContain(command);
  }
});
