# SRS -- skills-registry
Fecha: 2026-09-25 | Estado: Draft | Traza a: PRD prd-skills-registry.md

## Requisitos funcionales

| ID | Requisito | Traza PRD | Prioridad |
|---|---|---|---|
| FR-001 | El sistema implementa: Open Source — MIT, cualquiera puede contribuir | F1 | Must |
| FR-002 | El sistema implementa: Versionado Semántico — v1.0.0 → v1.0.1 → v2.0.0 | F2 | Must |
| FR-003 | El sistema implementa: Zero Lock-in — Skills funcionan offline después de descargar | F3 | Must |
| FR-004 | El sistema implementa: Dependencias Declarativas — Skills pueden depender de otras | F4 | Must |
| FR-005 | El sistema implementa: Discovery por Tags — Búsqueda semántica en el registry | F5 | Must |
| FR-006 | El sistema implementa: Total Skills: 23+ | F6 | Must |
| FR-007 | El sistema implementa: Categorías: 5 principales (Coding Workflows, Coding Agents, Education, Brainstorming, Toke | F7 | Must |
| FR-008 | El sistema implementa: CLI Tools Soportadas: Qwen Code, Claude Code, Cline, OpenCode/Crush, Codex CLI, Gemini CLI | F8 | Must |

## Requisitos no funcionales

| ID | Requisito | Metrica | Traza |
|---|---|---|---|
| NFR-001 | Build reproducible | `build` pasa en CI | todos |
| NFR-002 | Calidad estatica | lint + typecheck sin errores | todos |
| NFR-003 | Seguridad | 0 secretos; validacion de entrada | FR-001 |
| NFR-004 | Observabilidad | logs estructurados y errores claros | todos |
| NFR-005 | Accesibilidad (si hay UI) | WCAG 2.1 AA | FR-001 |
| NFR-006 | CI verde | workflow en cada PR | todos |

## Trazabilidad

`PRD -> FR/NFR -> tests -> verificacion`. Todo cambio actualiza la documentacion
en el mismo PR y debe pasar la suite antes de fusionar.
