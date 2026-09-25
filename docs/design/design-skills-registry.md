# SDD / Design Doc -- skills-registry
Fecha: 2026-09-25 | Estado: Draft

## Arquitectura general

Stack: Node.js, TypeScript. Estructura de primer nivel detectada:

```
  .env.example
  .github
  .gitignore
  LICENSE
  PINNED-POST-READY.txt
  README.md
  cli
  package-lock.json
  package.json
  tests
  tsconfig.json
```

CI: build.yml, ci.yml.

## Decisiones clave

Ver `docs/adr/`. Regla: una fuente de verdad por concern, contratos de frontera
claros y direccion de dependencias sin ciclos.

## Flujos criticos

1. Desarrollo local -> build -> test -> CI.
2. Cambio -> PR -> revision -> merge -> deploy (si aplica).

## Estrategia de verificacion

- Build y tests en CI en cada PR.
- Revision de seguridad (cero secretos, validacion).
- Comprobacion de deploy segun la matriz de plataforma.

## Limites y riesgos

- Deuda tecnica no documentada: registrar como ADR antes de refactor mayor.
- Dependencias externas: fijar versiones y lockfile.
