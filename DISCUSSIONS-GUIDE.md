# 📢 Guía de Comunidad — Skills Registry Global

## Bienvenido al Hub Oficial de Comunicación

Este es el espacio donde la comunidad construye, comparte y mejora las skills que hacen posible este ecosistema.

---

## 🗂️ Categorías Disponibles

### 💡 Ideas — Propone Nuevas Skills
Aquí vas cuando tienes UNA IDEA DE SKILL que quieres crear o proponer.
```markdown
## Título de la idea [NOMBRE_SKILL]

**Resumen:** (2-3 líneas explicando qué hace)

**Problema que resuelve:** (¿Por qué existe esta necesidad?)

**Skills similares existentes:** (link a otras que ya cubren algo parecido)

**Plan de implementación:** (tu visión de cómo construirlo)

**Contribuyentes interesados:** (@usuario si hay otros)
```

### 🐛 Bugs & Issues — Reporta Problemas
Cuando una skill NO FUNCIONA como debería.
```markdown
## Descripción del problema [skill-id] v[x.x.x]

**Plataforma afectada:** (Qwen Code / Claude Code / Cline / OpenCode)
**Versión actual:** v[x.x.x] vs versión esperada
**Pasos para reproducir:**
1. ...
2. ...
3. ...

**Resultado esperado:** (...)
**Resultado real:** (...)

**Logs/errores:** ```bash
[paste output aquí]
```
```

### 📦 Featured Skills — Showcase Semanal
Comparte tu skill más reciente destacada por la comunidad.
```markdown
## [skill-name] v[x.x.x] — ¿Qué? Por Qué Importa

**Descripción corta:** (1 línea máximo)

**Lo que hace diferente:** (vs alternativas existentes)

**Cómo funciona en 3 pasos:**
1. Instalar
2. Activar con trigger palabras clave  
3. Funciona automáticamente

**Stats:** ⭐ calidad X/10 | 📥 downloads total

**Demo/Screenshot:** ![demo](url-imagen-o-gif)
```

### 🌍 Translations — Solicitar Traducciones
Pide traducción de una skill a otro idioma.
```markdown
## Request translation: [skill-name] → [idioma-target]

**Skill original ID:** open-school (español → inglés requested)
**Motivo:** Necesito usar esto en producción team hispanohablante
**Ayudantes potenciales:** @usuario-conoce-inglés-y-portugués

¿Quién puede ayudar? ¡Gracias! 👋
```

### 🎓 Tutorials & How-To — Guías Comunitarias
Publica guías que otros puedan seguir paso a paso.
```markdown
## Tutorial: Cómo Crear Tu Primera Skill en <X Minutos>

### Paso 1: Preparación
[comandos + explicación]

### Paso 2: Estructura Base
[estructura carpetas + ejemplos código]

### Paso 3: Validación Local
[tests ejecutar antes publicar]

### Paso 4: Publish al Registry
[últimos pasos + link PR]

**Dificultad:** ⭐☆☆☆☆ Fácil | ⭐⭐⭐⭐⭐ Expert
**Tiempo estimado:** ~15 minutos
```

### ❓ Q&A — Preguntas Rápidas
Tu pregunta específica recibirá respuesta directa.
```markdown
## Pregunta: [tema-resumen-corto]

Contexto adicional mínimo necesario...
Respuestas aceptadas marcadas ✓ por autor original.
```

---

## ⚖️ Reglas Básicas de Convivencia

1. **Respeto siempre.** Sin insultos ni ataques personales. Discute ideas no personas.
2. **No spam publicitario.** Posts promocionando productos/servicios sin aportar valor técnico serán eliminados.
3. **Reportar abuse activamente.** Si ves comportamiento hostil o spam, reportalo inmediatamente.
4. **Usar templates correctamente.** Cada categoría tiene su formato específico — úsalo. Facilita responder.
5. **Creditar fuentes adecuadamente.** Si usas trabajo de otra persona en tu contribución, menciona origen explícitamente.

## 🏆 Badges y Reconocimientos

| Badge | Cómo Obtenerlo | Significado |
|-------|---------------|-------------|
| 🔵 `@founder` | Creadores originales del sistema | Los fundadores |
| 🟢 `@contributor` | >5 PRs merged exitosamente | Miembro activo validado |
| 🟡 `@moderator` | Votado por comunidad existente | Revisor confiable designado |
| 🟠 `@expert` | Calidad score ≥9.0 en 3+ skills | Nivel avanzado reconocido |
| 🔴 `@sponsor` | Apoyo financiero registrado | Sostenibilidad económica |

**Nota:** Solo los badges oficiales son válidos. Ningún usuario se auto-asigna badges internos.

---

## 📊 Métricas Semanales Automatizadas

Cada lunes publicamos stats oficiales:

```markdown
## Stats Semanales — [fecha inicio] a [fecha fin]

📈 **Novedades esta semana:**
• Nuevas skills publicadas: XX
• PRs merged: XXX
• Issues resolved: XXX
• Total downloads: XXXXX

🔥 **Top contribuidores (por contribution count):**
1. @usuario1 — XXX contributions
2. @usuario2 — XXX contributions
3. @usuario3 — XXX contributions

🌍 **Skills trending (más vistas esta semana):**
1. open-school — XXX views
2. cursor-ai-cli-unified — XXX views
3. brainstorming — XXX views

⚠️ **Issues pendientes críticos (>7 días abiertos):**
• Issue #XXX — [descripción breve] — opened by @usuario hace X días
```

---

## 🚀 Cómo Empezar Inmediatamente

### Para Usuarios Nuevos:

```bash
# 1. Clona el registry
git clone https://github.com/belentani7/skills-registry.git
cd skills-registry

# 2. Explora las primeras 23 skills disponibles
ls skills/
cat skills/open-school/SKILL.md
cat skills/cursor-ai-cli-unified/SKILL.md

# 3. Instala una skill localmente
npm i -g @skills/cli
npx skills add belentani7/skills-registry open-school

# 4. Verifica que funcione
npx skills info open-school
```

### Para Contribuidores:

```bash
# 1. Fork del repo principal
gh repo fork belentani7/skills-registry --clone
cd skills-registry

# 2. Crea nueva branch para tu skill
git checkout -b feat/mi-nueva-skill

# 3. Añade tu skill siguiendo SKILL-SIZING standard
mkdir skills/mi-nueva-skill/
echo "---
name: mi-nueva-skill
description: \"Breve descripción clara\"
version: 1.0.0
author: MiNombre
license: MIT
platforms: [linux, macos, windows]
---" > skills/mi-nueva-skill/SKILL.md

# 4. Valida localmente
npx skills validate skills/mi-nueva-skill/

# 5. Push y abre PR
git push origin feat/mi-nueva-skill
gh pr create --title "feat(skill): add mi-nueva-skill v1.0.0" --body "Mi pull request"

# 6. Espera revisión CI checks automáticos pasar
# → Cuando mergeado → badge @contributor automático asignado
```

---

## 🔗 Links Útiles Rápidos

- **Registry principal:** https://github.com/belentani7/skills-registry
- **Documentación completa:** SCHEMA.md + HOT-SWAP.md + SKILLS-COMBINE.md
- **Standard tamaño universal:** SKILL-SIZING.md
- **Expansión estrategia:** EXPANSION-STRATEGY.md
- **Registro trabajo diario:** MODIFIED-WORK-TODAY.md

---

*Última actualización: 2026-09-02 • Mantenido por founders team • Contribuciones welcome vía PR*
