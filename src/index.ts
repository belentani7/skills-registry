#!/usr/bin/env node
/** Offline-first Skills Registry CLI. No remote code execution or implicit downloads. */
import { copyFileSync, existsSync, lstatSync, mkdtempSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import process from 'node:process';

const VERSION = '1.0.0';
const DEFAULT_TARGET = join(homedir(), '.qwen', 'skills');
const ID_RE = /^[a-z0-9][a-z0-9_-]{0,63}$/;
const VERSION_RE = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;
const MAX_FILES = 1000;
const MAX_BYTES = 10 * 1024 * 1024;
const SENSITIVE = /^(?:\.git|node_modules|\.env(?:\..*)?|\.npmrc|\.pypirc|\.ssh|\.aws|\.kube|\.netrc|\.gitconfig|\.docker|\.terraform|id_rsa|id_ed25519|credentials\.json|secrets\.json|.*\.(?:sqlite3?|db))$/i;
const SENSITIVE_EXT = /\.(?:pem|key|p12|pfx)$/i;

type Manifest = { id: string; version: string; name?: string; description?: string };
type Options = { target: string; dryRun: boolean };

function usage(): void {
  console.log(`Skills Registry CLI v${VERSION}\n\nOffline commands:\n  add <local-skill-dir> [--target <directory>] [--dry-run]\n  list [--target <directory>]\n  search <text> [--target <directory>]\n  info <skill-id> [--target <directory>]\n  --version\n\nNetwork installs are disabled until a verified, published registry exists.\nNo skill scripts are executed by this installer.`);
}

function parseArgs(args: string[]): { command: string; positional: string[]; options: Options } {
  const command = args[0] || 'help';
  const positional: string[] = [];
  let target = DEFAULT_TARGET;
  let dryRun = false;
  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--dry-run') dryRun = true;
    else if (args[i] === '--target') {
      if (!args[i + 1] || args[i + 1].startsWith('--')) throw new Error('--target requires a directory');
      target = resolve(args[++i]);
    } else if (args[i].startsWith('--')) throw new Error(`Unknown option: ${args[i]}`);
    else positional.push(args[i]);
  }
  return { command, positional, options: { target, dryRun } };
}

// Unlike existsSync(), lstatSync detects dangling symlinks. A dry-run must
// reject them rather than reporting a destination as safe to install.
function pathEntryExists(path: string): boolean {
  try { lstatSync(path); return true; }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return false;
    throw error;
  }
}

function assertNoSymlinkComponents(path: string): void {
  const absolute = resolve(path);
  let current = isAbsolute(absolute) ? resolve(absolute, sep) : sep;
  for (const component of absolute.slice(current.length).split(sep).filter(Boolean)) {
    current = join(current, component);
    if (pathEntryExists(current) && lstatSync(current).isSymbolicLink()) {
      throw new Error(`Symbolic link not allowed in destination: ${current}`);
    }
  }
}

function validateManifest(text: string): Manifest {
  let raw: unknown;
  try { raw = JSON.parse(text); } catch { throw new Error('Invalid manifest.json JSON'); }
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('Manifest must be an object');
  const m = raw as Record<string, unknown>;
  if (typeof m.id !== 'string' || !ID_RE.test(m.id)) throw new Error('Invalid manifest id');
  if (typeof m.version !== 'string' || !VERSION_RE.test(m.version)) throw new Error('Invalid manifest version');
  if (m.name !== undefined && typeof m.name !== 'string') throw new Error('Invalid manifest name');
  if (m.description !== undefined && typeof m.description !== 'string') throw new Error('Invalid manifest description');
  return m as Manifest;
}

function manifestFrom(directory: string): Manifest {
  const path = join(directory, 'manifest.json');
  if (!existsSync(path) || !lstatSync(path).isFile()) throw new Error('manifest.json is required');
  if (lstatSync(path).size > 65536) throw new Error('manifest.json exceeds size limit');
  return validateManifest(readFileSync(path, 'utf8'));
}

function collectFiles(root: string): string[] {
  const files: string[] = [];
  let bytes = 0;
  function visit(directory: string, depth: number): void {
    if (depth > 12) throw new Error('Skill directory nesting exceeds limit');
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (SENSITIVE.test(entry.name) || SENSITIVE_EXT.test(entry.name)) throw new Error(`Sensitive file or directory rejected: ${entry.name}`);
      const path = join(directory, entry.name);
      const metadata = lstatSync(path);
      if (metadata.isSymbolicLink()) throw new Error(`Symbolic link rejected: ${entry.name}`);
      if (metadata.isDirectory()) visit(path, depth + 1);
      else if (metadata.isFile()) {
        files.push(path.slice(root.length + 1));
        bytes += metadata.size;
        if (files.length > MAX_FILES || bytes > MAX_BYTES) throw new Error('Skill exceeds file or byte limit');
      } else throw new Error('Unsupported special file in skill');
    }
  }
  visit(root, 0);
  if (!files.includes('SKILL.md')) throw new Error('SKILL.md is required');
  if (!files.includes('manifest.json')) throw new Error('manifest.json is required');
  return files;
}

function installed(target: string): Array<{ manifest: Manifest; directory: string }> {
  assertNoSymlinkComponents(target);
  if (!existsSync(target)) return [];
  if (!statSync(target).isDirectory()) throw new Error('Target is not a directory');
  const result: Array<{ manifest: Manifest; directory: string }> = [];
  for (const entry of readdirSync(target, { withFileTypes: true })) {
    if (!entry.isDirectory() || !ID_RE.test(entry.name)) continue;
    const directory = join(target, entry.name);
    try {
      const manifest = manifestFrom(directory);
      if (manifest.id === entry.name) result.push({ manifest, directory });
    } catch { /* Invalid entries are never represented as installed skills. */ }
  }
  return result.sort((a, b) => a.manifest.id.localeCompare(b.manifest.id));
}

function isInsideDirectory(parent: string, candidate: string): boolean {
  const path = relative(resolve(parent), resolve(candidate));
  return path === '' || (path !== '..' && !path.startsWith('..' + sep) && !isAbsolute(path));
}

function add(source: string, options: Options): void {
  if (!source || (/^(?:https?:\/\/|[\w.-]+\/[\w.-]+$)/i.test(source) && !existsSync(source))) {
    throw new Error('Remote install unavailable: provide an explicit local skill directory');
  }
  const root = resolve(source);
  if (!existsSync(root) || !lstatSync(root).isDirectory()) throw new Error('Source must be a local directory, not a symlink');
  assertNoSymlinkComponents(root);
  const target = resolve(options.target);
  // Staging inside the source can capture previous installs or private files.
  // Reject overlap before even reading the manifest or creating directories.
  if (isInsideDirectory(root, target)) {
    throw new Error('Installation target must not be the source or inside the source directory');
  }
  const manifest = manifestFrom(root);
  const files = collectFiles(root);
  const destination = join(target, manifest.id);
  assertNoSymlinkComponents(destination);
  if (pathEntryExists(destination)) throw new Error(`Skill already installed; refusing overwrite: ${manifest.id}`);
  if (options.dryRun) {
    console.log(`DRY RUN: ${manifest.id}@${manifest.version} (${files.length} files) -> ${destination}`);
    return;
  }
  mkdirSync(target, { recursive: true });
  assertNoSymlinkComponents(target);
  const staging = mkdtempSync(join(target, '.skills-stage-'));
  try {
    for (const relative of files) {
      const src = join(root, relative);
      const dest = join(staging, relative);
      mkdirSync(dirname(dest), { recursive: true });
      // Recheck to reject a source file replaced by a symlink during installation.
      if (!lstatSync(src).isFile()) throw new Error(`Source changed during install: ${relative}`);
      copyFileSync(src, dest);
    }
    if (pathEntryExists(destination)) throw new Error('Destination appeared during installation');
    renameSync(staging, destination);
    console.log(`Installed ${manifest.id}@${manifest.version} (${files.length} files)`);
  } catch (e) {
    rmSync(staging, { recursive: true, force: true });
    throw e;
  }
}

function main(args: string[]): void {
  const { command, positional, options } = parseArgs(args);
  switch (command) {
    case 'add':
      if (positional.length !== 1) throw new Error('Usage: skills add <local-skill-dir>');
      add(positional[0], options);
      return;
    case 'list':
      if (positional.length) throw new Error('Usage: skills list');
      for (const item of installed(options.target)) console.log(`${item.manifest.id}@${item.manifest.version}`);
      return;
    case 'search': {
      if (positional.length !== 1) throw new Error('Usage: skills search <text>');
      const query = positional[0].toLowerCase();
      for (const item of installed(options.target).filter(({ manifest }) =>
        [manifest.id, manifest.name || '', manifest.description || ''].some(value => value.toLowerCase().includes(query)))) {
        console.log(`${item.manifest.id}@${item.manifest.version} ${item.manifest.description || ''}`);
      }
      return;
    }
    case 'info': {
      if (positional.length !== 1 || !ID_RE.test(positional[0])) throw new Error('Usage: skills info <skill-id>');
      const item = installed(options.target).find(({ manifest }) => manifest.id === positional[0]);
      if (!item) throw new Error('Skill not installed');
      console.log(JSON.stringify(item.manifest, null, 2));
      return;
    }
    case '-V': case '--version': console.log(VERSION); return;
    case 'help': case '--help': usage(); return;
    default: throw new Error(`Unknown command: ${command}`);
  }
}

try { main(process.argv.slice(2)); }
catch (e) { console.error(`skills: ${(e as Error).message}`); process.exitCode = 1; }
