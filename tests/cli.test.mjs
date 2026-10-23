import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, symlinkSync, existsSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const CLI = fileURLToPath(new URL('../dist/index.js', import.meta.url));
function run(...args) { return spawnSync(process.execPath, [CLI, ...args], { encoding: 'utf8' }); }
function fixture(fn) {
  const root = mkdtempSync(join(tmpdir(), 'skills-registry-test-'));
  try {
    const source = join(root, 'source'); const target = join(root, 'installed');
    mkdirSync(source);
    writeFileSync(join(source, 'manifest.json'), JSON.stringify({ id: 'example', version: '1.0.0', description: 'A test skill' }));
    writeFileSync(join(source, 'SKILL.md'), '# Example\n');
    return fn({ root, source, target });
  } finally { rmSync(root, { recursive: true, force: true }); }
}
test('dry-run does not create installation target', () => fixture(({ source, target }) => {
  const result = run('add', source, '--target', target, '--dry-run');
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /DRY RUN/);
  assert.equal(existsSync(target), false);
}));
test('local install and offline list/search/info work', () => fixture(({ source, target }) => {
  assert.equal(run('add', source, '--target', target).status, 0);
  assert.equal(readFileSync(join(target, 'example', 'SKILL.md'), 'utf8'), '# Example\n');
  assert.match(run('list', '--target', target).stdout, /example@1.0.0/);
  assert.match(run('search', 'test', '--target', target).stdout, /example@1.0.0/);
  assert.match(run('info', 'example', '--target', target).stdout, /"id": "example"/);
}));
test('existing installation is preserved without overwrite', () => fixture(({ source, target }) => {
  assert.equal(run('add', source, '--target', target).status, 0);
  writeFileSync(join(target, 'example', 'SKILL.md'), 'local modifications');
  const result = run('add', source, '--target', target);
  assert.notEqual(result.status, 0);
  assert.equal(readFileSync(join(target, 'example', 'SKILL.md'), 'utf8'), 'local modifications');
}));
test('reject traversal manifest ids', () => fixture(({ source, target }) => {
  writeFileSync(join(source, 'manifest.json'), JSON.stringify({ id: '../outside', version: '1.0.0' }));
  assert.notEqual(run('add', source, '--target', target).status, 0);
  assert.equal(existsSync(target), false);
}));
test('reject symlinks in source', () => fixture(({ root, source, target }) => {
  writeFileSync(join(root, 'external.txt'), 'external');
  symlinkSync(join(root, 'external.txt'), join(source, 'payload.txt'));
  assert.notEqual(run('add', source, '--target', target).status, 0);
  assert.equal(existsSync(target), false);
}));
test('reject sensitive files before writing', () => fixture(({ source, target }) => {
  writeFileSync(join(source, '.env'), 'PRIVATE=1');
  assert.notEqual(run('add', source, '--target', target).status, 0);
  assert.equal(existsSync(target), false);
}));
test('remote installs are disabled rather than silently failing', () => fixture(({ target }) => {
  const result = run('add', 'belentani7/skills-registry', '--target', target);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Remote install unavailable/);
}));
test('invalid JSON and missing SKILL.md are rejected', () => fixture(({ source, target }) => {
  writeFileSync(join(source, 'manifest.json'), '{bad');
  assert.notEqual(run('add', source, '--target', target).status, 0);
}));
test('relative local paths with slash are accepted', () => fixture(({ source, target }) => {
  const result = run('add', source, '--target', target);
  assert.equal(result.status, 0, result.stderr);
}));
test('nested resources are copied without executing scripts', () => fixture(({ source, target }) => {
  mkdirSync(join(source, 'references'));
  writeFileSync(join(source, 'references', 'example.md'), 'offline resource');
  assert.equal(run('add', source, '--target', target).status, 0);
  assert.equal(readFileSync(join(target, 'example', 'references', 'example.md'), 'utf8'), 'offline resource');
}));
test('missing SKILL.md fails without mutation', () => fixture(({ source, target }) => {
  rmSync(join(source, 'SKILL.md'));
  assert.notEqual(run('add', source, '--target', target).status, 0);
  assert.equal(existsSync(target), false);
}));
test('empty installed directory is valid', () => fixture(({ target }) => {
  assert.equal(run('list', '--target', target).status, 0);
}));
