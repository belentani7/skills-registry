# Skills Registry — local-first agent skills CLI

**Status: public source prototype, not a published global registry.** This repository currently contains a Node.js/TypeScript command-line program, not a populated `registry.json`, a `skills/` catalog, or a public website. The old documentation advertised 23+ skills, six working integrations and an auto-publish workflow; none of those claims is verified by the current repository tree. Do not distribute it as a live catalog or install it from an untrusted third party.

## Verified scope of this branch

The CLI installs a **local skill directory** after validating `manifest.json` and `SKILL.md`. It supports `add`, `list`, `search`, and `info` for local installed skills. No network fetch, remote install, executable skill hook, dependency auto-install, update, or public publication is performed. A skill's content remains untrusted; review its instructions before using it in an AI agent. Installations never overwrite an existing skill. The default destination is `~/.qwen/skills` (customize with `--target`). Other agents' directory formats are not yet tested.

### Build and test

Requires Node.js 22 and npm. The npm lockfile is the currently selected install source; the old `pnpm-lock.yaml` is historical and not independently validated.

```bash
npm ci --ignore-scripts
npm run typecheck
npm test
```

`npm test` compiles TypeScript and runs isolated Node CLI integration tests. A real CI runner and a fresh-install test must pass before release; these commands are **instructions**, not claims of successful GitHub CI.

### Local use

Create a directory with `SKILL.md` and a `manifest.json` such as:

```json
{"id":"example-skill","version":"1.0.0","description":"Example only"}
```

```bash
npm run build
node dist/index.js add ./example-skill --target ./installed --dry-run
node dist/index.js add ./example-skill --target ./installed
node dist/index.js list --target ./installed
node dist/index.js search example --target ./installed
node dist/index.js info example-skill --target ./installed
```

The installer rejects invalid IDs, malformed manifests, symlinks (including dangling links), common credential directories and local database files, oversized packages, destination overwrites, and a destination that equals or is nested within the source. These are conservative filename safeguards, not a content-based secret scan. It copies files to a temporary directory before renaming. It does **not** guarantee protection against hostile concurrent filesystem changes; run only on a trusted device and review skill content. For safe backup/restore, preserve both the original skill and the target directory before changes.

## Known gaps

- The historical `npx skills add belentani7/skills-registry open-school` example **does not work** because `registry.json` and skill packages are absent; the offline CLI does not implement remote installs. Remote installation is explicitly disabled, not silently simulated.
- Existing `docs/prd/`, `docs/srs/`, `docs/design/`, `PINNED-POST-READY.txt`, and `workflows/` contain earlier plans or claims, **not evidence of deployed capabilities**. `workflows/` is not a GitHub Actions directory. The branch adds an actual `.github/workflows/ci.yml` for validation, but runner execution must be checked independently.
- Registry distribution, trusted package signatures, cross-agent compatibility, remote upgrades, UI/SEO, Git history scanning, complete backups and independent restore are **pending**.
- Do not publish source or assets or change repository visibility without the full privacy/license/history and release gates.

## License and ownership

The repository contains an MIT license. This does not establish rights to redistribute third-party skills. The Impeccable design guidance (`pbakaus/impeccable`) is Apache-2.0, reviewed read-only; it was not installed, and a CLI has no browser UI to audit for WCAG 2.2.
