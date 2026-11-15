# SCHEMA — skills-registry

Formato de una skill y de una entrada de `registry.json`.

## Estado real del registro (2026-11-16)

El README describe un árbol con `registry.json`, `cli/src/index.ts`, `skills/<nombre>/SKILL.md`
y un catálogo de "23+" skills. Al 2026-11-16 el repositorio contiene **una** skill indexada
(`meta-skill`) y este esquema. El árbol y el recuento del README son el objetivo, no el estado.

Regla de este repositorio: una skill aparece en `registry.json` solo cuando su `SKILL.md` se puede
abrir en una URL pública. Ninguna entrada se escribe de memoria.

## Entrada de `registry.json`

| Campo | Obligatorio | Significado |
|---|---|---|
| `name` | sí | Igual que el `name` del frontmatter de su `SKILL.md`. Minúsculas, guiones. |
| `version` | sí | Semver. `1.0.0` mientras no exista un release real del repo de origen. |
| `category` | sí | Una de las categorías del README (Coding Workflows, Coding Agents, Education, Planning, Token Opt). |
| `description` | sí | Una frase. Debe salir del propio `SKILL.md`, no de una impresión. |
| `license` | sí | SPDX de la licencia del repo de origen. |
| `source` | sí | URL del `SKILL.md` que se puede abrir. Si da 404, la entrada no vale. |
| `repository` | sí | Repo de origen. |
| `tags` | no | Términos que alguien buscaría. Nada de marcas propias ni adjetivos. |

## `SKILL.md`

Mismo contrato que el resto del ecosistema de agentes: frontmatter YAML con `name` y
`description` (esta última empieza por "Use when…" o describe cuándo usarla), y el cuerpo con
las instrucciones. Sin frontmatter, el agente no la descubre.

## Cómo añadir una skill

1. Comprobar que el `SKILL.md` responde 200 en su repo de origen.
2. Añadir la entrada a `registry.json` y subir `count`.
3. Nada más: el registro no copia código, apunta a la fuente.
