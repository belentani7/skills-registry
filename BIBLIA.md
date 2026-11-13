# skills-registry — BIBLIA.md

> Documento de doctrina del producto. Visión, misión, reglas, arquitectura, stack y decisiones de diseño.

## 1. Visión

skills-registry es un producto del ecosistema belentani7. 
Forma parte del universo integrado de proyectos bajo la organización GitHub belentani7.

## 2. Misión

Proveer valor a través de tecnología moderna, código mantenible y experiencia de usuario excepcional.

## 3. Stack Tecnológico

- **Node.js**: Runtime principal
- **TypeScript**: Tipado estático

## 4. Reglas de Desarrollo

- Protocolo spec-first: PRD → SRS → Design Doc → ADR → Plan → Tests GWT
- No commitear secretos, API keys, tokens ni credenciales
- Ejecutar gitleaks antes de cada push
- CODEOWNERS: @belentani7 revisión requerida
- Conventional commits: type(scope): summary
- Cada cambio es reversible, uno a uno

## 5. Tokens de Diseño (CANON)

- Negro vacío: #05030a (body bg)
- Rojo neón: #ff073a (acento primario)
- Dorado Zion: #d4af37 (acento secundario)
- Cyan señal: #4de8e0 (acento terciario)

## 6. Impeccable (Diseño Frontend)

- Body text contrast >= 4.5:1
- No gradient text, no side-stripe borders, no eyebrow on every section
- No identical card grids, no nested cards
- Hero heading <= 6rem (96px)
- Touch targets >= 44px, focus indicators visible
- Estados vacío, error y carga diseñados
- Animaciones con prefers-reduced-motion

## 7. Seguridad

- .gitleaks.toml configurado con reglas del ecosistema Belentani
- CODEOWNERS @belentani7
- SECURITY.md con política de reporte

## 8. Decisiones de Arquitectura

- Monorepo o repositorio independiente según el producto
- Despliegue por copia de archivos (cero build) salvo que se especifique lo contrario
- Working trees respetados: no se sobrescriben cambios sin restaurar desde HEAD

<!-- repo-forge:biblia:inicio -->
# BIBLIA.md — skills-registry

Doctrina del producto del repositorio `skills-registry` del ecosistema belentani7.

## Visión

el npm de las skills: publicar, versionar y verificar una skill con un comando, con procedencia y auditoría de cada afirmación

## Misión

Una herramienta que se puede auditar: dice qué hace, lo hace, y deja rastro de lo que hizo.

## Público

desarrolladores que construyen agentes y necesitan skills reutilizables

## Stack

sitio estático publicable tal cual · JSON, YAML, HTML, Markdown, TypeScript, JavaScript

## Módulos que la promesa exige

- Índice buscable
- Contrato de skill
- Verificador
- Publicación
- Procedencia

## Reglas de desarrollo

- Protocolo spec-first: PRD → SRS → Design Doc → ADR → Plan → Tests.
- Un cambio, un resultado verificable.
- Nada se afirma sin ejecución; lo no probado se declara como no probado.
- Escritura solo con confirmación; nada destructivo.
- Idioma del producto: español, salvo el público del repositorio.
- Secreto fuera de disco, logs y manifiestos.

## Lo que este repositorio no va a hacer

skills sin contrato verificable

## Convenciones

`type(scope): resumen` — feat, fix, docs, chore, refactor, test, perf.

<!-- repo-forge:biblia -->
<!-- repo-forge:biblia:fin -->
