

<!-- repo-forge:docs-arquitectura:inicio -->
# Arquitectura

## Tipo

sitio estático publicable tal cual

## Piezas observadas

| Pieza | Evidencia |
|---|---|
| Lenguajes | JSON 41.8%, YAML 27.1%, HTML 9.9%, Markdown 9.7%, TypeScript 4.7%, JavaScript 3.8% |
| Puntos de entrada | ninguno detectado |
| Páginas HTML | 3 |
| Tests | 2 archivos |
| Dependencias de paquete | 5 |

## Capas propuestas

```text
contenido/      datos y textos versionados
plataforma/     ficha, diseño y contrato del producto
brand/          tokens, marca y activos
scripts/        verificación y operación
tests/          pruebas ejecutables
```

La propuesta no mueve archivos existentes: describe dónde debe vivir lo nuevo para que
el repositorio siga siendo legible.

## Deuda declarada

- 6 lenguajes: coste de contexto alto.

<!-- repo-forge:arquitectura -->
<!-- repo-forge:docs-arquitectura:fin -->
