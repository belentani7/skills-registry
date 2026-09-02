# Skills Composition & Auto-Update System

Cuando la persona está usando contenido y descubre nuevas formas de combinar/actualizar skills, este sistema hace el proceso transparente y automático.

---

## PROBLEMA ACTUAL

```
Usuario usa skill A durante 3 horas
Se da cuenta de que existe skill B mejorada → ¿Qué hago?
  ↓
1. Salir del flujo actual
2. Abrir terminal
3. Correr `npx skills search <query>`
4. Instalar manualmente
5. Reaprender workflow nuevo
6. Integrar manualmente con A
```

**Friction total.** El usuario abandona antes de mejorar su setup.

---

## SOLUCIÓN: SKILL COMPOSITION ENGINE

### Concepto Central

Las skills no son entidades aisladas — son **módulos composables** que pueden:
- **Auto-reportar** mejores alternativas disponibles en el registry
- **Combinarse automáticamente** para crear workflows más potentes
- **Actualizarse sin interrumpir** la sesión activa

### Flujo Ideal (Sin Fricción)

```
1. Usuario usa skill [open-school]
   ↓
2. Cada 30 min, el composition engine consulta registry
   ↓
3. Detecta: open-school v2.1.0 disponible (mejoras en offline mode)
   ↓
4. Muestra tooltip suave: "¡nueva versión! 5MB"
   ↓
5. Usuario hace click en "Actualizar" o deja pasar (auto)
   ↓
6. La skill se actualiza SIN detener el flujo actual
   ↓
7. Si hay cambios breakin, NOTIFICA antes de aplicar
```

---

## CAPA 1: AUTO-UPDATE INTELIGENTE

### Mechanismo de Detección

```jsonc
// manifest.json (por cada skill)
{
  "id": "open-school",
  "version": "2.0.0",
  "update_policy": {
    "check_interval_ms": 30 * 60 * 1000, // 30 minutos
    "auto_update_minor": true,           // Patch/Minor → auto
    "auto_update_major": false,          // Major → notifica primero
    "notify_on_new_version": true        // Toast/bell al detectar
  },
  "compatible_with": ["cursor-ai-cli"], // Qué otras skills combina bien
  "requires_reactivation": false       // Necesita reiniciar session?
}
```

### Estrategia de Actualización

| Tipo | Ejemplo | Acción | Delay |
|------|---------|--------|-------|
| **Patch** | v1.0.0→v1.0.1 | Silent update | 0ms |
| **Minor** | v1.0.0→v1.1.0 | Auto + toast | 500ms |
| **Major** | v1.0.0→v2.0.0 | Notifica + wait user click | Manual |
| **Breaking change** | v2.0.0→v3.0.0 (sin compat) | Alerta urgente | Manual |

### Implementación (CLI daemon)

```typescript
// cli/src/update-engine.ts
interface UpdatePolicy {
  checkIntervalMs: number;
  autoMinor: boolean;
  notifyBeforeBreak: boolean;
}

class UpdateEngine {
  private cache = new Map<string, SkillEntry>();
  private lastCheck = new Map<string, Date>();
  
  async checkForUpdates(skillId: string, policy: UpdatePolicy) {
    const now = Date.now();
    if (now - this.lastCheck.get(skillId) < policy.checkIntervalMs) return null;
    
    this.lastCheck.set(skillId, new Date(now));
    const registry = await fetchRegistry();
    const local = this.cache.get(skillId);
    const remote = registry.skills.find(s => s.id === skillId);
    
    if (!remote || !local) return null;
    if (sameVersion(local, remote)) return null;
    
    if (isBreakingChange(local.version, remote.version)) {
      if (policy.notifyBeforeBreak) {
        notify(`BREAKING: ${skillId} v${local.version} → v${remote.version}`);
      }
      return null; // Don't auto-update breaking
    }
    
    if (isMinorOrPatch(local.version, remote.version)) {
      if (policy.autoMinor) {
        await downloadAndSwap(skillId, remote);
        showToast(`${skillId} updated to v${remote.version}`);
      }
      return remote;
    }
    
    return remote;
  }
}
```

---

## CAPA 2: SKILL COMPOSITION (Combinación Dinámica)

### El Problema de Combinar Skills Manualmente

```bash
# Forma vieja (FRICCION):
1. Instalar skill-a
2. Instalar skill-b
3. Aprender cómo se usan juntos
4. Escribir script/manual para usarlas en secuencia
5. Testear que no entren conflicto
6. Mantener ambas actualizadas coordinadamente
```

### Nueva Forma: Composición Automática

```bash
# Composer detecta patrones automáticamente
skills combine cursor-ai-cli open-school --output fullstack-coder

# Internamente:
# 1. Analiza manifest.json de ambas skills
# 2. Detecta trigger overlap → fusiona arrays
# 3. Concatena content sections en orden lógico
# 4. Inyecta orchestrator layer entre ambas
# 5. Genera skill compuesta v1.0.0
# 6. Devuelve id: fullstack-coder ready-to-use
```

### Schema de Composición

```jsonc
{
  "composition_id": "fullstack-coder",
  "version": "1.0.0",
  "composed_from": ["cursor-ai-cli-unified", "open-school"],
  "composer": "auto-compose-engine",
  "composition_type": "sequential", // "parallel" | "conditional" | "merged"
  "trigger_contains": [
    ...["multi-file editing", "agent orchestration"],     // from skill A
    ...["crear plataforma educativa", "LMS"]             // from skill B
  ],
  "content_sections": [
    {"source": "cursor-ai-cli", "section": "patterns/*"},
    {"source": "open-school", "section": "architecture"},
    {"source": "open-school", "section": "curriculum-model"}
  ],
  "orchestrator": {
    "type": "pipeline",
    "steps": [
      {"skill": "cursor-ai-cli", "condition": "trigger_detects_multi_edit"},
      {"skill": "open-school", "condition": "trigger_detects_education_request"}
    ]
  }
}
```

### Tipos de Composición

#### A) Sequential (Paso a paso)
```
skill-A ejecuta → output pasa a skill-B como input
Ejemplo: brainstorming → lean-build
  brainstorming genera specs → lean-build los convierte en código
```

#### B) Parallel (Simultáneo)
```
skill-A Y skill-B corren juntas en paralelo
Ejemplo: caveman + systematic-debugging
  debugging hace analysis detallado → caveman comprime output
```

#### C) Conditional (Switch inteligente)
```
Ambas disponibles, pero se elige la adecuada según contexto
Ejemplo: open-school + LinguaForge
  Si detecta "idioma" → usa LinguaForge
  Si detecta "plataforma educativa general" → usa Open School
```

#### D) Merged (Fusión profunda)
```
Contenido se mezcla creando un nuevo artefacto único
Ejemplo: cursor-ai-cli + designing-taste → Design-Agent
  Pattern de Cursor + principios de diseño frontend → agente especializado
```

---

## CAPA 3: DISCOVERY DURANTE USO (El Momento "AHÁ")

### Cuando el Usuario Descubre Algo Útil Mientras Usa Contenido

El sistema debe ser **proactivo** en mostrar oportunidades:

```
Flujo típico:
Usuario lee documento X.txt sobre educación
Usa skill [open-school] para construir plataforma
  ↓
⏱️ 25 minutos después...
  ↓
Composition Engine detecta:
- open-school v2.0.0 está instalado
- open-school v2.1.0 tiene mejoras en modo offline
- LinguaForge v1.0.0 tiene traducción automática avanzada
- Hay una composición open-school+LinguaForge que nadie probó aún
  ↓
✅ Notificación suave (no intrusiva):
┌─────────────────────────────────────────────┐
│ 💡 ¡Tienes herramientas más potentes!       │
│                                              │
│ • open-school v2.1.0 (4 improvements)       │
│ • LinguaForge v1.0.0 (traducción automática)│
│ • Composición abierta: education-suite      │
│                                              │
│ [Actualizar todo]  [Ver detalles]           │
└─────────────────────────────────────────────┘
```

### Mecanismo de Trigger Contextual

```typescript
// El composition engine monitorea usage patterns
async function monitorUsage() {
  const currentSession = getSessionState();
  
  // Si el usuario lleva >20 min con open-school
  if (currentSession.skillUsage.open-school > 20 * 60 * 1000) {
    // Buscar complementos naturales
    const potentialAddons = await findComplementarySkills(
      'open-school', 
      { category: 'education', qualityScore: '>8.5' }
    );
    
    // LinguaForge aparece porque tiene trigger overlap parcial
    // Y resuelve un problema que el usuario NO sabía que necesitaba
    
    if (potentialAddons.length > 0 && currentSession.needsComplement) {
      showSoftNotification(potentialAddons[0]);
    }
  }
}
```

---

## CAPA 4: WORKSPACE DE SKILLS VIVIENTES

### Estado Actual vs Propuesto

**Estado actual (frío):**
```bash
~/.qwen/skills/open-school/
├── SKILL.md
└── manifest.json

static — solo se actualiza manualmente
```

**Propuesto (vivo):**
```bash
~/.qwen/skills/open-school/
├── SKILL.md                    # Contenido principal
├── manifest.json               # Metadata + update_policy
├── .cache/                     # Estado de uso actual
│   ├── last-checked.json       # Timestamp última verificación
│   ├── active-compositions.json # Composiciones activas
│   └── usage-stats.json        # Stats de uso real
├── .updater/                   # Temporal de actualización
│   ├── pending/                # Versiones pendientes instaladas
│   └── rollback-point/         # Punto seguro para revertir
└── .sessions/                  # Sesiones en curso
    ├── 2026-09-02-session-1.log
    └── 2026-09-02-session-2.log
```

### Sesión Viva con Composición Activa

```typescript
// .sessions/session-activity.json
{
  "session_id": "sess_2026-09-02_1015",
  "started_at": "2026-09-02T10:15:00Z",
  "active_skills": [
    {
      "id": "open-school",
      "version": "2.0.0",
      "context": "building education platform",
      "user_actions": ["read SKILL.md", "applied architecture pattern"],
      "time_spent_ms": 25 * 60 * 1000
    }
  ],
  "suggested_compositions": [
    {
      "name": "education-suite",
      "skills": ["open-school", "linguaforge"],
      "reason": "You're building platforms. LinguaForge adds translation."
    }
  ]
}
```

---

## UX PRINCIPLES PARA EL SISTEMA

### Principio 1: No Interrumir el Flujo

```
❌ MAL: "¿Quieres actualizar open-school ahora?"
         [Cancelar] [Actualizar] ← Friction
   
✅ BIEN: "open-school actualizado automáticamente (no break changes)"
         [✕ Close] ← Click mínimo
```

### Principio 2: Recomendar Basado en Uso Real, No Popularidad

```
❌ MAL: Mostrar las 100 skills más populares siempre
   
✅ BIEN: "Basado en tu último uso de 'open-school', 
         te conviene 'LinguaForge' para traducción automática"
```

### Principio 3: Composición Visible y Explicada

```
❌ MAL: Dos skills que corren en secreto sin saber por qué
   
✅ BIEN: "Abajo tienes 2 skills activas:
         - open-school (planificando arquitectura)
         - cursor-ai-cli (generando código)
         Se ejecutan secuencialmente: planificar → codificar"
```

### Principio 4: Rollback Siempre Disponible

```typescript
// Antes de cualquier actualización:
async function applyUpdate(skillId, newVersion) {
  // 1. Crear snapshot del estado actual
  await createSnapshot(skillId);
  
  // 2. Aplicar actualización
  await installNewVersion(skillId, newVersion);
  
  // 3. TEST AUTOMÁTICO (si hay tests definidos en manifest)
  const testResult = await runTests(skillId);
  
  if (testResult.passed) {
    // 4. OK → Activar nueva versión
    activateNewVersion(skillId, newVersion);
  } else {
    // 5. FALLÓ → Rollback inmediato
    await rollbackToSnapshot(skillId);
    alert("Update failed. Rolled back to previous version.");
  }
}
```

---

## IMPLEMENTACIÓN PRACTICA RÁPIDA

### Paso 1: Agregar auto-update a las skills existentes

```yaml
# En cada SKILL.md frontmatter:
---
update_policy:
  check_interval_minutes: 30
  auto_patch: true
  auto_minor: true
  require_approval_major: true
  compatible_with: []   # Lista de IDs compatibles
---
```

### Paso 2: Comando de combinación manual

```bash
# Usuario decide combinar
skills combine open-school cursor-ai-cli --name education-dev-team

# CLI genera nueva skill en ~/.qwen/skills/education-dev-team/SKILL.md
# Con contenido fusionado + orchestrador automático
```

### Paso 3: Dashboard de composición activa

```bash
skills dashboard
```

Muestra visualmente:
- Skills activas actualmente
- Composiciones en curso
- Actualizaciones pendientes
- Sugerencias basadas en uso

---

## RESUMEN DEL FLUJO COMPLETO

```
1. Usuario inicia sesión
    ↓
2. Composition Engine arranca (background)
    ↓
3. Usuario usa [open-school]
    ↓
4. Motor monitorea uso (20+ min)
    ↓
5. Detecta oportunidad: LinguaForge complementa perfecto
    ↓
6. Muestra notification suave (no popup gigante)
    ↓
7. Usuario dice "Sí, instalar"
    ↓
8. Motor instala LinguaForge + crea composición automática
    ↓
9. Composition resultante: "education-suite"
    ↓
10. Usuario ahora tiene skill compuesta:
    - open-school (planificar/estructurar)
    - LinguaForge (traducir/adaptar)
    - Orchestrador (decide cual ejecutar cuando)
    ↓
11. Todo el tiempo anterior, open-school auto-checkeó updates
    ↓
12. V2.1.0 llegó silenciosamente (minor update auto-applied)
    ↓
13. Sesión continúa sin interrupciones
```

Este es el nivel de automatización que hace que el sistema sea realment