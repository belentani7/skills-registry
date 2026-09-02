# Skills Registry Schema — V1 Specification

Estándar universal para organizar, distribuir e instanciar skills en agentes CLI (Qwen Code, Claude Code, Cline, OpenCode, Codex CLI, Gemini CLI, etc.).

---

## 1. GOVERNANCE MODEL

El registry opera bajo estos principios:

| Principio | Implementación |
|-----------|---------------|
| **Open Source** | Código abierto MIT, cualquiera puede contribuir |
| **Versionado semántico** | v1.0.0 → v1.0.1 (patch), v1.1.0 (minor), v2.0.0 (major) |
| **Dependencias declarativas** | Skills pueden depender de otras skills |
| **Calidad validada** | CI valida SKILL.md antes de merge |
| **Discoverable** | Búsqueda por tags, categorías, descripción |
| **Cacheable** | CLI cached localmente, updates on-demand |
| **Zero-lock-in** | Skills funcionan offline después de descarga |

---

## 2. REPOSITORY STRUCTURE

```bash
skills-registry/                    # Raíz del registry global
├── package.json                    # Scripts globales (build, lint, validate)
├── turbo.json                      # Pipeline parallelizado
├── .github/workflows/ci.yml        # Validación automática de cada PR
│
├── registry.json                   # ← Índice MAESTRO de todas las skills
├── index.html                      # Web UI para browsar/search skills
└── cli/                            # CLI resolver (Node.js binary)
    ├── src/index.ts                # Resolver principal
    ├── src/cache.ts                # Local cache management
    ├── src/validator.ts            # Schema validation
    └── README.md
│
├── skills/                         # TODOs los skills viven aquí
│   ├── cursor-ai-cli-unified/      # Cada skill = un directorio
│   │   ├── SKILL.md                # Archivo maestro obligatorio
│   │   ├── manifest.json           # Metadatos + dependencias
│   │   ├── patterns/               # Subarchivos opcionales (SKILL.md puede referenciarlos)
│   │   │   ├── plan-vs-act.md
│   │   │   └── multi-agent-coordination.md
│   │   ├── references/             # Recursos externos si aplica
│   │   │   └── templates/
│   │   ├── tests/                  # Pruebas de calidad de la skill
│   │   │   ├── trigger.test.ts     # Verifica que se activa correctamente
│   │   │   └── output.test.ts      # Verifica contenido esperado
│   │   ├── CHANGELOG.md            # Historial de cambios
│   │   ├── LICENSE                 # Licencia por skill
│   │   └── README.md               # Explicación extendida
│   │
│   ├── open-school/
│   │   ├── SKILL.md
│   │   ├── manifest.json
│   │   └── ...
│   │
│   ├── brainstorming/
│   │   ├── SKILL.md
│   │   └── ...
│   │
│   ├── caveman/
│   │   ├── SKILL.md
│   │   └── ...
│   │
│   └── ... 100+ skills aquí ...
│
└── docs/
    ├── CONTRIBUTING.md             # Cómo contribuir skills
    ├── SCHEMA.md                   # Este archivo
    ├── API.md                      # API CLI reference
    └── MIGRATION.md                # Migrar de otros sistemas (Qwen, Claude, Cursor)
```

---

## 3. FILE FORMATS

### 3.1 registry.json (Índice Maestro)

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/belentani7/skills-registry/main/cli/schema.json",
  "version": "1.0.0",
  "updated_at": "2026-09-02T10:00:00Z",
  "total_skills": 42,
  "categories": {
    "coding-agents": {
      "label": "Coding Agents & CLI Tools",
      "description": "Multi-file editing, agent orchestration, token optimization",
      "skills": ["cursor-ai-cli-unified", "caveman", "cavecrew"]
    },
    "education": {
      "label": "Education Platforms",
      "description": "LMS, courses, certifications, accessibility",
      "skills": ["open-school"]
    },
    "brainstorming": {
      "label": "Brainstorming & Planning",
      "description": "Creative thinking, spec review, visual companion prompts",
      "skills": ["brainstorming"]
    },
    // ... más categorías
  },
  "skills": [
    {
      "id": "cursor-ai-cli-unified",
      "name": "Cursor AI CLI Unified",
      "version": "1.0.0",
      "category": "coding-agents",
      "description": "Unified CLI coding agent workflow based on Cursor IDE patterns",
      "author": "Belentani",
      "license": "MIT",
      "trigger_contains": ["Cursor IDE", "multi-file editing", "agent orchestration", "CLI coder"],
      "related_skills": ["aider-cli-mastery", "opencode", "dispatching-parallel-agents"],
      "dependencies": [],          // Otras skills que necesita (ej: ["lean-build"])
      "files": ["SKILL.md", "patterns/plan-vs-act.md"],
      "size_bytes": 45230,         // Para optimizar descargas
      "quality_score": 9.2,        // Basado en pruebas automáticas + reviews
      "downloads_total": 1247,
      "installed_on": ["qwen-code", "claude-code", "cline", "opencode"]
    }
  ]
}
```

### 3.2 manifest.json (Por Skill Individual)

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/belentani7/skills-registry/main/cli/schema.json",
  "version": "1.0.0",
  "id": "open-school",
  "name": "Open School Platform",
  "description": "Universal digital education platform — modular courses, verifiable QR certs, WCAG accessibility",
  "author": "Belentani",
  "license": "MIT",
  "main": "SKILL.md",
  "files": ["SKILL.md", "README.md", "AGENTS.md"],
  "subfiles": {
    "patterns/plan-vs-act.md": "Detailed guide on when to explore vs execute",
    "patterns/multi-agent-coordination.md": "How to coordinate parallel sub-agents"
  },
  "dependencies": [],
  "peer_dependencies": ["@registry/coding-agents"],  // Optional: needs certain category present
  "scripts": {
    "validate": "tsx scripts/validate-skills.ts",
    "test": "vitest run --config vitest.config.ts"
  },
  "tags": ["education", "lms", "courses", "certification", "accessibility", "offline", "ollama", "multilanguage"],
  "platforms": ["linux", "macos", "windows"],
  "install_command": "npx skills add belentani7/skills-registry open-school",
  "min_cli_version": ">=0.10.0"
}
```

### 3.3 SKILL.md (Archivo Maestro)

```yaml
---
name: open-school
description: "Plataforma educativa digital universal — ..."
version: 2.0.0
author: Belentani
license: MIT
platforms: [linux, macos, windows]
metadata:
  registry_id: "open-school"           # ← REQUIRED: links to registry entry
  related_skills: [cursor-ai-cli-unified, nextjs-ssr-architecture]
  depends_on: []                       # ← REQUIRED: list of IDs
  peer_deps: []                        # ← OPTIONAL: categories needed
  subfile_refs:
    patterns/plan-vs-act.md: "When to explore vs execute"
    patterns/multi-agent-coordination.md: "Parallel sub-agent coordination"
  triggers: ["crear plataforma educativa", "LMS", "cursos modulares", "certificaciones QR"]
---

# OPEN SCHOOL — Platforma Educativa Digital Universal
<!-- SKILL.md content follows... -->
```

---

## 4. CLI RESOLVER ARCHITECTURE

### Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `skills add <owner>/<repo> <skill-id>` | Install skill from registry |
| `skills list` | List all installed skills |
| `skills search <query>` | Search registry by keyword/tag |
| `skills info <skill-id>` | Show details, deps, version |
| `skills update <skill-id>` | Update to latest version |
| `skills remove <skill-id>` | Uninstall skill |
| `skills export <skill-id>` | Export full skill to local directory |
| `skills graph` | Visual dependency graph of all skills |
| `skills validate` | Validate all installed skills |

### Flow de Instalación

```
User: npx skills add belentani7/skills-registry open-school
    ↓
1. Fetch registry.json (cached or remote)
    ↓
2. Resolve skill ID in registry.json
    ↓
3. Check dependencies (recursively)
    ↓
4. Download SKILL.md + all referenced files
    ↓
5. Validate schema (must match registry entries)
    ↓
6. Store in ~/.qwen/skills/<skill-id>/
    ↓
7. Add symlink/alias so Qwen Code auto-discovers it
    ↓
Done! Skill ready for use.
```

### Caché Local

```
~/.cache/skills-registry/
├── registry.json              # Last fetched index
├── open-school/
│   ├── v2.0.0/
│   │   ├── SKILL.md           # Cached version
│   │   └── patterns/
│   │       └── plan-vs-act.md
│   └── v2.0.0.sha256          # Checksum for integrity
├── cursor-ai-cli-unified/
│   ├── v1.0.0/
│   └── ...
└── index.db                   # SQLite for fast lookups
```

### Dependency Resolution (Recursive)

```bash
# open-school depends on nothing → direct install
# caveman-compress depends on caveman → resolve both
# brainstroming depends on lean-build AND investigation-first → resolve all three

skills add belentani7/skills-registry caveman-compress

# Internal flow:
# 1. Manifest says: depends_on: ["caveman"]
# 2. Resolve "caveman" in registry.json → get SHA256 of current version
# 3. Check if caveman is already installed locally
# 4. If yes → skip, use local
# 5. If no → download caveman first, then caveman-compress
# 6. Verify both checksums match registry.json
# 7. Symlink both to ~/.qwen/skills/
```

---

## 5. QUALITY GATE SYSTEM

Cada skill pasa por este pipeline antes de ser publishable:

```
[Developer writes SKILL.md]
        ↓
[Git PR opened]
        ↓
CI runs:
  ├─┬ YAML frontmatter validation
  ├─┬ File existence check (all referenced subfiles must exist)
  ├─┬ Syntax check (no broken markdown)
  ├─┬ Schema conformity (matches registry.json)
  ├─┬ Trigger detection (auto-generates trigger_contains array)
  ├─┬ Size limit check (SKILL.md max 50KB base; larger allowed with subfiles)
  ├─┬ Security scan (no hardcoded secrets, eval(), dangerous imports)
  └─┬ Related skills verification (IDs listed actually exist in registry)
        ↓
[Automated test runs]
  ├─┬ Trigger test: Does the skill activate on known keywords?
  ├─┬ Output test: Does the content follow the documented structure?
  └─┬ Integration test: Can another skill import/depend on it?
        ↓
[Merge approved]
        ↓
[registry.json auto-updated with new entry]
        ↓
[Publish!]
```

---

## 6. DISCOVERY WEB UI

`index.html` — Página estática generada automáticamente desde registry.json:

```html
<!-- Screenshot mental -->
┌─────────────────────────────────────────────────────────────┐
│ 🔧 SKILLS REGISTRY — v1.0.0                               │
│ 🔍 [Search skills...] [Filter: All ▼] [Sort: Most Popular▼]|
├─────────────────────────────────────────────────────────────┤
│ 📦 Coding Agents (12)                                      │
│ ┌──────────────────────────────────────────────────────────┐│
│ │ 🔥 cursor-ai-cli-unified        ⭐ 9.2  📥 1,247        ││
│ │    Unified CLI coding agent workflow based on Cursor...   ││
│ │    [Install] [View] [Depends On: none]                    ││
│ └──────────────────────────────────────────────────────────┘│
│ ┌──────────────────────────────────────────────────────────┐│
│ │ ⚡ caveman                     ⭐ 9.5  📥 3,891          ││
│ │    Ultra-compressed mode. Cuts tokens 65%...              ││
│ │    [Install] [View] [Depends On: none]                    ││
│ └──────────────────────────────────────────────────────────┘│
│                                                              │
│ 🎓 Education (3)                                             │
│ ┌──────────────────────────────────────────────────────────┐│
│ │ 🏫 open-school                ⭐ 8.8  📥 412             ││
│ │    Universal digital education platform...                ││
│ │    [Install] [View] [Depends On: none]                    ││
│ └──────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

Generada con GitHub Pages (static site from registry.json).

---

## 7. CONTRIBUTE FLOW

```markdown
# Cómo Contribuir Una Skill

1. Fork el registry
2. Crear carpeta: `skills/mi-nueva-skill/`
3. Escribir `SKILL.md` siguiendo el template
4. Añadir `manifest.json` con metadatos correctos
5. (Opcional) Crear `tests/` para validación
6. Commit: `feat(skill): add mi-nueva-skill v1.0.0`
7. Push → abrir Pull Request
8. CI valida automáticamente
9. Merge → auto-publish
```

### Template para nueva skill

```bash
npx skills create my-new-skill \
  --name "Mi Skill Name" \
  --desc "Breve descripción" \
  --author "Your Name" \
  --license MIT
```

Genera:
```
skills/my-new-skill/
├── SKILL.md           # Con frontmatter ya poblado
├── manifest.json      # Con metadatos mínimos
├── README.md          # Template vacío
└── CHANGELOG.md       # Template vacío
```

---

## 8. VERSIONADO Y ROLLBACK

| Evento | Acción |
|--------|--------|
| `v1.0.0` → `v1.0.1` | Auto-update disponible via `skills update` |
| Breaking change `v1.x` → `v2.0.0` | Requiere manual migration, CLI muestra warning |
| Bug crítico `v1.0.2` | Hotfix publish, users obtienen automáticamente |
| Rollback | Si una skill falla validaciones, se revierte al último version válido |

---

## 9. EXTENSION POINTS

Este sistema permite:

1. **Plugins** — Scripts ejecutados durante instalación (`postinstall`, `preactivate`)
2. **Themes** — Kits visuales instalables que modifican la presentación de outputs
3. **Workspaces** — Skills específicas por proyecto guardadas en `.registry/skills/`
4. **Teams** — Private registry forked con skills internas de empresa
5. **Marketplace** — Skills monetizadas o sponsored (opcional futuro)
6. **Analytics** — Stats de uso, popularidad, tiempo activación

---

*Schema V1 — Diseñado para ser extensible sin romper compatibilidad.*
