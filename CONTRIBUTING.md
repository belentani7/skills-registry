# Contribuir

## Flujo

1. Abre un issue describiendo el problema o la propuesta.
2. Crea una rama corta: `feat/...`, `fix/...` o `docs/...`.
3. Aplica el protocolo spec-first y añade tests.
4. Ejecuta la verificación local.
5. Abre un PR completando la checklist de `.github/pull_request_template.md`.

## Comandos

- `build`: `tsc`
- `start`: `node cli/dist/index.js`
- `dev`: `tsx cli/src/index.ts`
- `validate`: `tsx scripts/validate-registry.ts`
- `test`: `vitest run`
- `generate-index`: `tsx scripts/generate-index.ts`

## Reglas

- Conventional commits.
- Sin secretos ni credenciales.
- Un cambio reversible por PR.
- Revisión de `@belentani7` y CI verde.
