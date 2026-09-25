# PRD -- skills-registry
Fecha: 2026-09-25 | Estado: Draft (auditoria automatica, requiere revision humana) | Autor: auditoria belentani7 (NOIACORE)

## 1. Problema

**El NPM de las Skills para Agents CLI.** Un sistema universal para organizar, distribuir e instanciar skills en agentes CLI (Qwen Code, Claude Code, Cline, OpenCode, Codex CLI, Gemini CLI).

## 2. Usuarios objetivo

- **Primario**: usuario final que necesita resolver el caso de uso de skills-registry.
- **Secundario**: equipo/persona que mantiene y despliega el proyecto.
- **Terciario**: agentes CLI que operan sobre el repositorio.

## 3. Features (MoSCoW)

| ID | Feature | MoSCoW |
|---|---|---|
| F1 | Open Source — MIT, cualquiera puede contribuir | Must |
| F2 | Versionado Semántico — v1.0.0 → v1.0.1 → v2.0.0 | Must |
| F3 | Zero Lock-in — Skills funcionan offline después de descargar | Must |
| F4 | Dependencias Declarativas — Skills pueden depender de otras | Must |
| F5 | Discovery por Tags — Búsqueda semántica en el registry | Must |
| F6 | Total Skills: 23+ | Must |
| F7 | Categorías: 5 principales (Coding Workflows, Coding Agents, Education, Brainstorming, Token Optimization) | Must |
| F8 | CLI Tools Soportadas: Qwen Code, Claude Code, Cline, OpenCode/Crush, Codex CLI, Gemini CLI | Must |
| F90 | Checklist de produccion (build, tests, deploy, seguridad) | Should |
| F91 | Documentacion viva (esta cadena) | Must |

## 4. Criterios de aceptacion (GWT)

### F1 -- Open Source — MIT, cualquiera puede contribuir
- Given el usuario en el contexto de skills-registry / When usa Open Source — MIT, cualquiera puede contribuir / Then obtiene el resultado esperado sin error.
- Given entrada invalida / When la envia / Then recibe un error generico y el detalle queda en logs.

### F2 -- Versionado Semántico — v1.0.0 → v1.0.1 → v2.0.0
- Given el usuario en el contexto de skills-registry / When usa Versionado Semántico — v1.0.0 → v1.0.1 → v2.0.0 / Then obtiene el resultado esperado sin error.
- Given entrada invalida / When la envia / Then recibe un error generico y el detalle queda en logs.

### F3 -- Zero Lock-in — Skills funcionan offline después de descargar
- Given el usuario en el contexto de skills-registry / When usa Zero Lock-in — Skills funcionan offline después de / Then obtiene el resultado esperado sin error.
- Given entrada invalida / When la envia / Then recibe un error generico y el detalle queda en logs.

### F4 -- Dependencias Declarativas — Skills pueden depender de otras
- Given el usuario en el contexto de skills-registry / When usa Dependencias Declarativas — Skills pueden depender / Then obtiene el resultado esperado sin error.
- Given entrada invalida / When la envia / Then recibe un error generico y el detalle queda en logs.


## 5. Metricas de exito

- Build reproducible en un comando.
- CI verde en cada PR.
- Cero secretos en el repositorio.
- Documentacion actualizada en el mismo PR que el codigo.

## 6. Out of scope

- Funcionalidad no descrita en el README vigente.
- Cambios que rompan compatibilidad sin ADR que lo justifique.
