# Universal Skill Sizing Standard — Reglas Universales de Tamaño para SKILL.md

Este documento define las reglas universales de tamaño que funcionan en TODAS las plataformas CLI agents (Qwen Code, Claude Code, Cline, OpenCode, Codex CLI, Gemini CLI, etc.). No hay límite fijo de caracteres porque las skills se descargan desde el registry, pero SÍ hay límites prácticos de rendimiento y calidad.

---

## EL PROBLEMA CENTRAL

```
SKILL MUY CORTA (<100 líneas / 5K caracteres):
→ Contenido incompleto, no cumple lo que promete
→ Usuario insatisfecho → abandona la skill

SKILL MUY LARGA (>500 líneas / 30K caracteres):
→ Rompe ventanas de contexto + cache del agent
→ IA tarda más en procesar (token cost ↑↑)
→ Se pierde el foco (signal-to-noise ↓↓)
→ Cache hit rate cae dramáticamente

SKILL BALANCEADA (200-400 líneas / 10K-25K caracteres):
→ Cumple lo prometido sin sobre-explicar
→ Rápida de cargar + buena命中率 de cache
→ Foco claro en lo esencial
→ Manteneble sin fragmentación
```

---

## NÚMEROS EXACTOS POR PLATAFORMA

### Context Window Real Utilizado por una SKILL

Cuando un agente carga una skill, NO toda llega al mismo contexto:

| Plataforma | Cómo se inyecta la skill | % del sistema prompt |
|------------|-------------------------|---------------------|
| **Qwen Code** | `skill trigger → inject SKILL.md into conversation` | ~5-10% del contexto actual |
| **Claude Code** | `CLAUDE.md siempre incluido al inicio de sesión` | ~2-5% del contexto total |
| **OpenCode/Crush** | `AGENTS.md + skill markdown files loaded by config` | ~3-8% según configuración |
| **Codex CLI** | `/init creates AGENTS.md → included in session` | ~2-6% del contexto |
| **Gemini CLI** | Config-based injection similar to CLAUDE.md | ~3-7% del contexto |

**Regla práctica:** Una skill bien dimensionada ocupa entre 2-10% del contexto útil disponible por plataforma.

---

## TABLAS DE TAMAÑO UNIVERSALES

### Por Categorías de Complejidad

| Tipo de Skill | Líneas SKILL.md | Caracteres Total | Tokens Aprox. | Casos de Uso |
|---------------|-----------------|------------------|---------------|--------------|
| **BÁSICA** | 50-120 líneas | 3K-8K chars | 1.5K-4K tokens | Trigger simple, action directa |
| **ESTÁNDAR** | 120-250 líneas | 8K-18K chars | 4K-9K tokens | Workflow con pasos secuenciales |
| **COMPLEJA** | 250-400 líneas | 18K-30K chars | 9K-15K tokens | Arquitectura + código + ejemplos |
| **MULTIFILE** | 80-200 líneas main | 6K-15K chars | 3K-7K tokens | Main ligero + subfiles detallados |
| **MÁXIMO ÚTIL** | 400-500 líneas | 30K-40K chars | 15K-20K tokens | Último límite antes de romper rendimiento |

### Por Plataforma (Límites Recomendados)

| Plataforma | Máximo SKILL.md | Recommended | Optimizado |
|------------|-----------------|-------------|------------|
| Qwen Code | 40K chars (200 líneas) | 20-30K chars (100-150 líneas) | 10-15K chars (50-80 líneas) |
| Claude Code | 50K chars (250 líneas) | 25-35K chars (125-175 líneas) | 10-20K chars (50-100 líneas) |
| OpenCode/Crush | 45K chars (225 líneas) | 20-30K chars (100-150 líneas) | 10-15K chars (50-80 líneas) |
| Codex CLI | 40K chars (200 líneas) | 20-30K chars (100-150 líneas) | 10-15K chars (50-80 líneas) |
| Gemini CLI | 45K chars (225 líneas) | 25-35K chars (125-175 líneas) | 10-20K chars (50-100 líneas) |

---

## ESTRUCTURA ÓPTIMA POR TIPO

### 1. SKILL BÁSICA (Trigger simple → Acción directa)

```yaml
---
name: example-basic-skill
description: "Quick action skill — generates boilerplate code"
version: 1.0.0
author: Belentani
license: MIT
platforms: [linux, macos, windows]
---

# EXAMPLE BASIC SKILL

Quick one-liner description of what this does.

## When to Use
- User asks for X pattern
- Specific trigger keywords listed

## Implementation
# Step 1: Check if project exists
# Step 2: Generate boilerplate
# Step 3: Run initial test

```javascript
// Minimal working example
function initProject() { /* ... */ }
```

## Edge Cases
- If project exists → skip creation
- If dependencies missing → install first

## Quick Reference
```bash
npx example-basic-skill --help
```

<!-- Total: 50-120 lines / 3K-8K chars -->
```

### 2. SKILL ESTÁNDAR (Workflow con pasos secuenciales)

```yaml
---
name: example-standard-skill
description: "Standard workflow skill — complete feature implementation cycle"
version: 1.0.0
author: Belentani
license: MIT
platforms: [linux, macos, windows]
metadata:
  related_skills: ["example-basic-skill"]
  triggers: ["feature", "implementation", "workflow"]
---

# EXAMPLE STANDARD SKILL

Complete workflow for implementing features end-to-end. Combines planning, 
coding, testing, and review into a single coherent process.

## Architecture Overview

```
User Request → Plan → Implement → Test → Review → Deploy
                ↓          ↓         ↓        ↓       ↓
              Specification   Code     Validation  Verification  Production
```

This follows the industry-standard development lifecycle with AI acceleration at each phase.

## Phase 1: Planning (Exploration Mode)

Before touching any code, understand the full scope:

1. **Read project structure** — Analyze existing patterns
2. **Identify affected files** — Map dependencies
3. **Understand data flow** — How inputs become outputs
4. **Write implementation plan** as markdown

```markdown
# Implementation Plan

## Files to Modify
- src/api/users.ts — Add new endpoint
- src/components/UserList.tsx — Update UI
- drizzle/schema.ts — New table definition

## Dependencies
- Requires existing auth middleware
- Depends on database migration 004_users.sql
```

Wait for approval before proceeding to Phase 2.

## Phase 2: Implementation (Action Mode)

Execute the approved plan with error recovery loop:

```
Loop:
  1. Apply change(s)
  2. Run build/test/lint immediately
  3. If green → Continue next change
  4. If red → Read error → Fix source → Re-test
  5. Max retries: 3 per change
```

```typescript
// Example implementation pattern
async function implementFeature(userPlan: string): Promise<void> {
  const changes = parsePlan(userPlan);
  
  for (const change of changes) {
    await applyChange(change);
    
    const result = await verifyBuild();
    if (!result.success) {
      await recoverFromError(result.error, change);
      // Retry up to 3 times
      for (let i = 0; i < 3; i++) {
        if (await verifyBuild()) break;
      }
    }
  }
}
```

## Phase 3: Testing

Run comprehensive verification:

```bash
pnpm lint          # Style check
pnpm test          # Unit tests  
pnpm test:e2e      # Integration tests
pnpm build         # Final build
```

## Phase 4: Code Review Checklist

Before committing:
- [ ] Build passes (`pnpm build` exit code 0)
- [ ] All tests pass (`pnpm test` exit code 0)  
- [ ] Lint clean (`pnpm lint` exit code 0)
- [ ] No merge conflicts (git status clean)
- [ ] .gitignore still valid
- [ ] CHANGELOG.md updated
- [ ] Screenshots added (if UI visible)
- [ ] Breaking changes documented

## Error Recovery Pattern

When encountering unexpected issues:

1. **STOP** — Don't guess blindly
2. **READ** — Understand the exact error
3. **RESEARCH** — Search for known patterns
4. **FIX** — Targeted correction
5. **VERIFY** — Confirm fix doesn't introduce regressions

Never apply blind patches. Always understand root cause.

<!-- Total: 120-250 lines / 8K-18K chars -->
```

### 3. SKILL COMPLEJA (Arquitectura + Código + Ejemplos)

```yaml
---
name: example-complex-skill
description: "Complex architectural pattern — multi-tier implementation system"
version: 1.0.0
author: Belentani
license: MIT
platforms: [linux, macos, windows]
metadata:
  related_skills: ["example-standard-skill", "example-basic-skill"]
  triggers: ["architecture", "multi-tier", "complex-system"]
  max_lines: 400           # Hard limit enforced by CI
  max_chars: 30000         # Hard limit enforced by CI
---

# EXAMPLE COMPLEX SKILL

Comprehensive architectural framework for building complex multi-layer applications.
Includes backend service layer, frontend presentation layer, shared types, and integration points.

Designed for production-grade systems requiring scalability, security, and maintainability.

<!-- This skill exceeds the recommended 250-line soft limit and uses the MAXIMUM allowed 400 lines.
     For future reference, if you find yourself exceeding 400 lines regularly, consider:
     
     1. Splitting into sub-files (patterns/, templates/)
     2. Using referenced sections instead of inline content
     3. Creating modular compositions rather than monolithic skills
     
     See SKILL-ARCHITECTURE.md in this repo for details on composition patterns. -->

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────────────┐ │
│ │   SPA    │ │ Dashboard │ │ Forms   │ │ Charts/Widgets  │ │
│ │ React    │ │ Component│ │ Builder │ │ Real-time Data  │ │
│ └──────────┘ └──────────┘ └──────────┘ └─────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    APPLICATION LAYER                        │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────────────┐ │
│ │Services  │ │Routers   │ │Utils     │ │State Management │ │
│ │(Domain   │ │(API/REST│ │(Helpers) │ │(Store/Persist)  │ │
│ │ Logic)   │ │GraphQL)  │ │         │ │                  │ │
│ └──────────┘ └──────────┘ └──────────┘ └─────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    INFRASTRUCTURE LAYER                     │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────────────┐ │
│ │Auth      │ │Database  │ │Cache     │ │External APIs    │ │
│ │(JWT/OAuth│ │(ORM/SQL) │ │(Redis)   │ │(Stripe/SendGrid)│ │
│ └──────────┘ └──────────┘ └──────────┘ └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Layer Responsibilities

**Presentation Layer:**
- Handles user interactions ONLY
- Never contains business logic
- Pure view + lightweight state management
- Responsive layout & accessibility compliance

**Application Layer:**
- Contains ALL business rules and validation
- Orchestrates services and data access
- Public API surface (routes/endpoints)
- Shared utilities cross-cutting concerns

**Infrastructure Layer:**
- External service integrations
- Database connectivity & migrations
- Authentication/authorization providers
- Caching layers & background workers

### Project Structure Conventions

```
project-root/
├── src/
│   ├── app/                    # Presentation (UI components/pages)
│   │   ├── _components/        # Private folder (not routable)
│   │   ├── ui/                 # shadcn/ui primitives
│   │   ├── layouts/            # Page shell wrappers
│   │   └── pages/              # Route-level pages
│   │
│   ├── lib/                    # Application layer utilities
│   │   ├── api/                # Fetch helpers, API clients
│   │   ├── auth/               # Auth middleware/guards
│   │   └── utils.ts            # General purpose helpers
│   │
│   ├── services/               # Domain logic (services)
│   │   ├── users.service.ts
│   │   ├── orders.service.ts
│   │   └── notifications.service.ts
│   │
│   ├── routers/                # API route handlers
│   │   ├── users.router.ts     # tRPC REST endpoints
│   │   ├── orders.router.ts
│   │   └── index.ts            # Root router assembly
│   │
│   └── db/                     # Infrastructure (database)
│       ├── schema.ts           # ORM schema definitions
│       ├── relations.ts        # Table relationships
│       └── seeds/              # Sample data generators
│
├── server/                     # Backend entry point
│   ├── index.ts                # Express/Fastify app setup
│   └── _core/                  # Core infrastructure
│       ├── env.ts              # Environment variables loader
│       └── db.ts               # Database connection singleton
│
├── shared/                     # Cross-layer shared types
│   └── types.ts                # TypeScript interfaces/classes
│
└── infrastructure/             # Infra-specific configurations
    ├── docker-compose.yml      # Local dev environment
    └── kubernetes/             # Deployment configs (optional)
```

### Configuration Templates

**.env.example (required fields):**
```bash
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
JWT_SECRET=change-this-to-random-32-char-string-minimum
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
REDIS_URL=redis://localhost:6379
```

**tsconfig.json (minimum strict settings):**
```json
{
  "compilerOptions": {
    "strict": true,
    "noEmit": true,
    "moduleResolution": "bundler",
    "paths": {
      "@/*": ["./src/*"],
      "@/shared/*": ["./shared/*"]
    }
  },
  "include": ["src/**/*.ts", "shared/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

### Migration Strategy

For database schema evolution:

1. **NEVER drop/rename columns directly** — Always ADD first
2. **Add column → Backfill data → Validate → DROP old column** (in separate deployment)
3. **Use Drizzle Kit for SQL generation**:
   ```bash
   drizzle-kit generate --name add_new_column
   drizzle-kit migrate                  # Apply pending migrations
   drizzle-kit studio                   # Visual schema explorer
   ```

4. **Schema versioning**:
   ```sql
   -- Good: additive-only migrations
   ALTER TABLE users ADD COLUMN new_field TEXT;
   
   -- BAD: destructive operations
   -- ALTER TABLE users DROP COLUMN old_field;  -- NEVER do this in prod
   
   -- CORRECT: two-step safe migration
   -- Step 1: CREATE new_columns (new_table_additions)
   -- Step 2: VALIDATE data integrity
   -- Step 3: DROP old_columns (old_table_deletions)
   ```

### Security Checklist

Every request MUST include:
- [ ] Input validation with Zod schemas before processing
- [ ] Rate limiting on auth endpoints
- [ ] CORS restricted to explicit origins (never `*`)
- [ ] Helmet.js sets secure HTTP headers
- [ ] HTTPS enforced in production
- [ ] CSP headers configured
- [ ] Passwords hashed with bcrypt/argon2
- [ ] JWT stored in HttpOnly cookies
- [ ] Parameterized SQL queries exclusively

### Performance Budget

Target metrics for production deployment:
- Initial page load: < 3 seconds (Lighthouse mobile ≥ 80 score)
- API response time: < 200ms p95
- Bundle size: < 200KB gzipped for JavaScript
- First meaningful paint: < 1.5 seconds
- Time to interactive: < 5 seconds
- Largest Contentful Paint: < 2.5 seconds

Monitor using Lighthouse CI checks in every PR.

<!-- Total: 250-400 lines / 18K-30K chars -->
<!-- WARNING: This skill is near the maximum allowed size.
     Consider splitting into sub-files if maintenance becomes difficult. -->
```

### 4. SKILL MULTIFILE (Main ligero + Subfiles detallados)

```yaml
---
name: example-multifile-skill
description: "Multifile architecture — main concise, details in referenced subfiles"
version: 1.0.0
author: Belentani
license: MIT
platforms: [linux, macos, windows]
metadata:
  main_size: 150 lines / 10K chars    # Soft target for main
  subfile_count: 3                     # Number of referenced subfiles
  total_size: 200-300 lines combined   # Combined total across all files
---

# EXAMPLE MULTIFILE SKILL

Core concepts and quick reference guide. See referenced subfiles for detailed 
implementations, examples, and edge cases.

## When to Use
- Complex workflows needing deep explanation
- Multi-step processes with conditional branches
- Large codebases requiring architectural understanding

## Quick Start
```bash
skills use example-multifile-skill --template production-ready
```

## Core Concepts

### 1. Architectural Pattern
Layered architecture separating concerns cleanly. Each layer has explicit 
responsibilities. See [`patterns/layered-architecture.md`](./patterns/layered-architecture.md) 

### 2. Error Handling Strategy
Centralized error handling with custom error classes. See 
[`patterns/error-handling.md`](./patterns/error-handling.md) for complete implementation.

### 3. Testing Pyramid
Three-tier strategy ensuring coverage without redundancy. See 
[`testing/testing-pyramid.md`](./testing/testing-pyramid.md) for detailed guidance.

## Sub-Files Index

| File | Purpose | Lines | Size |
|------|---------|-------|------|
| [layered-architecture.md](./patterns/layered-architecture.md) | Detailed architecture diagram + component mapping | 85 lines | 6.2K chars |
| [error-handling.md](./patterns/error-handling.md) | Custom error classes + middleware + recovery strategies | 95 lines | 7.8K chars |
| [testing-pyramid.md](./testing/testing-pyramid.md) | Test strategy breakdown + automation pipelines | 60 lines | 4.9K chars |

## Implementation Steps

Follow this sequence:
1. Setup project structure (see layered-architecture.md)
2. Configure error handling middleware (see error-handling.md)
3. Implement unit tests for domain logic (see testing-pyramid.md → Tier 1)
4. Write integration tests for API routes (see testing-pyramid.md → Tier 2)
5. Create E2E flows for critical paths (see testing-pyramid.md → Tier 3)

## Common Pitfalls

❌ Don't put business logic in presentation layer  
✅ Keep all domain logic in services directory  

❌ Use blanket error catching  
✅ Catch specific exceptions with custom error classes  

❌ Test implementation details  
✅ Test behavior and observable outcomes  

## Maintenance Notes

This skill evolves alongside its subfiles. When updating:
1. Ensure all referenced paths exist
2. Update subfile counts in metadata
3. Verify checksums match registry
4. Run quality gate checks before merging

<!-- END OF MAIN FILE --- Continue in referenced subfiles -->
<!-- Main size: ~150 lines / 10K chars (OPTIMAL RANGE) -->
```

---

## REGLA CRÍTICA SOBRE COMPRESIÓN (CAVEMAN/SHORTENED OUTPUT)

Si una skill usa formato comprimido tipo *caveman* u otro estilo acortado, ES IMPERATIVO explicar claramente que:

1. **La compresión es PARA VELOCIDAD**, NO para replicar como patrón normal
2. El usuario debe entender que está leyendo una versión optimizada delivery, NO la versión estándar recomendada
3. Debe haber un fallback explícito donde se explique cómo ver/elaborar la versión expandible completa

```yaml
---
compression_note: |
  ⚠️ IMPORTANT: This skill is delivered in compressed format for fast loading.
  Compression was applied SPECIFICALLY TO REDUCE DELIVERY TIME AND TOKEN COST.
  
  DO NOT use compressed format as your default writing style. For normal
  usage scenarios, write skills in full expanded form following the sizing
  standards above.
  
  If you want the EXPANDED version of this skill (full detail, no compression):
  1. Look for [expanded-version-reference] marker in the file
  2. Follow the link/path to load the uncompressed version
  3. The expanded version will be longer (~2-3x more text) but fully detailed
  
  Think of compressed format like: reading a news headline vs reading the full article.
  Headline tells you WHAT happened quickly. Article explains HOW and WHY completely.
---
```

### Ejemplo Práctico

```markdown
# CAVE MAN SHORT VERSION — FAST LOAD MODE

⚠️ COMPRESSED FOR SPEED — Full version available at: ./patterns/full-explanation.md

## WHAT THIS DOES
Multi-agent orchestration for complex tasks. Coordinator splits work into parallel 
specialist subtasks. Results merge automatically. See full docs for implementation.

[Full version includes: detailed coordinator pattern, file ownership matrix, 
merge conflict prevention, result aggregation strategy, performance tips]

📖 LOAD FULL VERSION: npx skills load full-mode --id example-skills
```

---

## RESTRICCIONES DE CALIDAD POR PLATAFORMA

### Calidad Mínima Requerida por Nivel

| Línea SKILL.md | Mínimo Esperado | Qué Debe Incluir |
|----------------|-----------------|------------------|
| **< 50 líneas** | ❌ Demasiado corto | Solo trigger simple + action inmediata |
| **50-120 líneas** | ✅ Básico válido | Trigger + descripción + ejemplo mínimo + edge cases |
| **120-250 líneas** | ✅ Óptimo recomendado | Architecture overview + workflow steps + code samples + checklist |
| **250-400 líneas** | ⚠️ Completo pero largo | Full specification + diagrams + multi-file subreferences |
| **> 400 líneas** | ❌ Demasiado extenso | Fragmentar en subfiles inmediatamente |

### Calidad Mínima Obligatoria (siempre presente)

Todo SKILL.md debe incluir SI O SI estos elementos en su SKILL.md principal:

| Elemento | Presente? | Propósito |
|----------|-----------|-----------|
| YAML frontmatter | ✅ | Metadata, triggers, version, author |
| One-line description | ✅ | Resumen instantáneo del propósito |
| When to Use / Triggers | ✅ | Cuándo dispara automáticamente |
| Step-by-step process | ✅ | Secuencia lógica de implementación |
| Code/example snippet | ✅ | Al menos UN ejemplo funcional |
| Edge cases / warnings | ✅ | Qué evitar + alternativas |
| Quick reference/command | ✅ | Cómo usarlo en línea de comandos |

Si falta cualquier elemento de arriba, la skill está INCOMPLETE — revisar antes de publicar.

---

## RESUMEN FINAL — NÚMEROS ABSOLUTOS

| Parámetro | Valor | Nota |
|-----------|-------|------|
| **Mínimo utilizable** | 50 líneas / 3K chars | Sin esto, no cumple promesa |
| **Óptimo recomendado** | 120-250 líneas / 8-18K chars | Cobertura completa sin exceder |
| **Completo permitido** | 250-400 líneas / 18-30K chars | Para skills muy complejas |
| **MÁXIMO ANTES DE ROMPER** | 400-500 líneas / 30-40K chars | Límite absoluto superior |
| **SUBFILES TOTAL COMBINADO** | 500-800 líneas combinadas | Main ligero + subfiles profundos |
| **TOKENS MÁXIMOS CONSUMIDOS** | 15-20K tokens máx por skill | Fuera de esto rompe caché/cache hit rate |

Estos números son GUÍA UNIVERSAL para TODO GitHub — funcionan igual para Qwen Code, Claude Code, Cline, OpenCode, Codex CLI, Gemini CLI, o cualquier plataforma CLI agent que use skills/patterns.

Los números están basados en el análisis práctico de: context windows típicos (32k-200k tokens), overhead de cada platforma para inyectar prompts, tasa de cache hit rates observada, y tiempo de procesamiento humano/AUtomático efectivo para contenido técnico denso.

El registry valida automáticamente que ningún SKILL.md exceda los límites máximos definidos aquí mediante CI checks en cada PR de contribución.
