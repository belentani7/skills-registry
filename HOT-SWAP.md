# Hot-Swap & In-Context Composition

Cuando la persona está en medio de un flujo usando una skill y descubre que puede actualizarla o combinarla con otra — esto sucede SILENCIOSAMENTE y SIN FRICCIÓN. No requiere salir del contexto ni abrir terminal.

---

## EL MOMENTO CLAVE

```
Usuario: "Voy a construir una plataforma educativa con open-school"
  ↓
[Usa open-school] durante 15 minutos creando arquitectura
  ↓
⏱️ Composition Engine detecta:
  • LinguaForge tiene traducción automática para 5 idiomas
  • open-school + LinguaForge = education-suite (nadie lo probó)
  • open-school v2.1.0 tiene mejoras en offline mode (ya instalado pero desactualizado)
  ↓
✅ NOTIFICACIÓN IN-CONTEXT (aparece discretamente):
┌──────────────────────────────────────┐
│ 💡 Actualización disponible          │
│ open-school v2.0→v2.1 (offline mode) │
│                                      │
│ [Actualizar solo]                    │
│ [Agregar LinguaForge]                │
│ [Crear composición: edu-suite]       │
│ [Omitir por ahora]                   │
└──────────────────────────────────────┘
```

**El usuario nunca salió del flujo.** Todo ocurrió donde estaba trabajando.

---

## CAPA 1: SKILLS QUE SE AUTO-PUBLICITAN

Cada skill expone su metadata al Composition Engine en tiempo real:

```jsonc
// Cuando se usa una skill, registra sus capacidades y needs
{
  "active_skill": "open-school",
  "version": "2.0.0",
  "current_context": "building platform architecture",
  "detected_needs": ["translation", "accessibility", "voice_assistant"],
  "available_from_registry": {
    "matches_detected_needs": [
      {
        "id": "linguaforge",
        "why_relevant": "Adds translation for detected need: 'translation'",
        "quality_score": 8.7,
        "composition_potential": "high" // Puede combinarse bien con open-school
      }
    ],
    "updates_available": [
      {
        "id": "open-school",
        "from": "2.0.0",
        "to": "2.1.0",
        "changes": ["improved offline mode", "bug fixes"],
        "breaking": false
      }
    ]
  }
}
```

### Mecanismo de Reporte

```typescript
// Cuando el agente termina una acción con una skill:
async function afterSkillExecution(skillId, context) {
  // 1. Registrar uso en .sessions/session.json
  await recordUsage(skillId, context);
  
  // 2. Auto-preguntar al registry qué hay mejor/disponible
  const registryData = await fetchRegistryMetadata();
  const localSkills = await getInstalledSkills();
  
  // 3. Buscar matches entre NEEDS del usuario Y SKILLS disponibles
  const suggestions = findComplementarySkills(context.detected_needs, registryData);
  
  // 4. Si hay sugerencias relevantes y el usuario lleva >10 min en skill
  if (suggestions.length > 0 && timeInCurrentSkill > 10 * 60 * 1000) {
    showHotSwapUI(suggestions);
  }
}
```

---

## CAPA 2: COMPOSICIÓN EN UN CLICK

### La Forma Más Fácil de Combinar: `skills combine` automático

Cuando Composition Engine detecta dos skills compatibles:

```bash
# OPCIÓN A: Usuario hace click manual en hot-swap UI
skills combine open-school linguaforge --auto

# Output: Composición propuesta: "education-suite"
# ┌─ Planifica arquitectura (open-school)         │
# ├─ Traduce contenido (LinguaForge)               │
# └─ Mantiene consistencia estructural              │

# Impacto esperado:
# • Reduce tiempo de setup en 40%
# • Añade traducción multiidioma nativa
# • Sin cambios break al flujo actual
```

### Generación Automática del Skill Compuesto

```bash
# CLI genera la skill compuesta automáticamente
skills create-compose education-suite \
  --from open-school \
  --from linguaforge \
  --type sequential
  
# Resultado: ~/.qwen/skills/education-suite/SKILL.md
# Contenido fusionado:
# ─ Section 1: open-school architecture pattern
# ─ Section 2: LinguaForge integration hooks
# ─ Orchestrator layer (decide cual ejecutar cuando)
# ─ Shared types y config unificados
```

---

## CAPA 3: UPDATE INVISIBLE

### Auto-update sin Notificación Interrumpidora

```typescript
// Cuando una skill tiene minor version disponible (ej: v2.0.0 → v2.0.1)
// Y las reglas de actualización dicen auto_minor: true

async function silentUpdate() {
  const skillId = "open-school";
  const latestVersion = await checkForUpdates(skillId);
  
  if (latestVersion && shouldAutoUpdate(latestVersion)) {
    // 1. Crear snapshot de seguridad
    await createSnapshot(skillId);
    
    // 2. Download new version
    await downloadNewVersion(skillId, latestVersion);
    
    // 3. Test rápido (si hay tests definidos)
    const testPass = await quickTest(skillId);
    
    if (!testPass) {
      await rollbackToSnapshot(skillId);
      return; // Fallo silencioso, no interrumpir
    }
    
    // 4. Aplicar swap (invisible para el usuario)
    await applySwap(skillId, latestVersion);
    
    // 5. LOG sutil (no popup gigante)
    console.log(`[system] open-school updated to ${latestVersion}`);
  }
}
```

### Estado Visual del Progreso

| Estado | Display | Acción |
|--------|---------|--------|
| Up-to-date | ✅ open-school v2.0.0 | Ninguna |
| Updating... | 🔄 open-school v2.0.0 → v2.1.0... | Esperar |
| Updated | ✓ open-school v2.1.0 (updated) | Log sutil |
| Error | ❌ open-school rolled back | Revertido |
| Breaking change | ⚠️ open-school v3.0.0 (review) | Notificar usuario |

---

## CAPA 4: WIDGET DE ACTIVIDAD EN TIEMPO REAL

Lo que ve el usuario mientras trabaja (panel lateral o inferior):

```
┌──────────────────────────────────────────────────────────┐
│                                                           │
│  ╔═══════════════╗                                        │
│  ║ BUILDING ARCH │ ← Título de la actividad actual        │
│  ╚═══════════════╝                                        │
│                                                           │
│  ▶ active-skill: open-school v2.0.0                       │
│  📊 Progress: [██████░░░░░░░░] 40%                         │
│                                                           │
│  ┌──────────────────────────────────────────────────────┐│
│  │ 💡 Sugestión basada en tu uso                        ││
│  │                                                      ││
│  │   ¿Necesitas traducción?                              ││
│  │   └─ Agregar LinguaForge                             ││
│  │                                                      ││
│  │   ¿Quieres más calidad?                               ││
│  │   └─ Subir a open-school v2.1                        ││
│  │                                                      ││
│  │   [Solo actualizar]  [Combinar con LinguaForge]      ││
│  └──────────────────────────────────────────────────────┘│
│                                                           │
│  ┌──────────────────────────────────────────────────────┐│
│  │ Session stats                                          ││
│  │ ● open-school: 18 min                                  ││
│  │ ● LinguaForge: 5 min                                   ││
│  │ 💰 Tokens gastados: 14.2k                              ││
│  │                                                        ││
│  │ Compositions activas: 0                                ││
│  │ Updates pendientes: 1 (v2.1.0)                         ││
│  └──────────────────────────────────────────────────────┘│
│                                                           │
│  [View more]  [Pause]  [Log out]                          │
└──────────────────────────────────────────────────────────┘
```

Este panel aparece como **floating widget** debajo de la pantalla principal — siempre visible pero discreto. El usuario lo arrastra minimiza o oculta si no lo necesita.

---

## CAPA 5: FLUJO DE USUARIO COMPLETO

### Escenario Realista

```
[Inicio]
Usuario abre Qwen Code
  ↓
Composition Engine arranca en background (no interactivo aún)
  ↓
Usuario escribe: "quiero crear una plataforma educativa multilingüe"
  ↓
Qwen Code activa skill [open-school] automáticamente (trigger match)
  ↓
⏱️ 15 minutos después — usuario está construyendo la arquitectura
  ↓
⏱️ 25 minutos después — open-school reporta:
  "Estás en building arch mode. Detecté necesidad de traducción."
  ↓
Composition Engine consulta registry:
  • LinguaForge existe (quality: 8.7/10)
  • open-school+v2.1.0 disponible (minor update)
  • open-school+LinguaForge = composition posible
  ↓
Widget in-context aparece discretamente:
┌──────────────────────────────────────────┐
│ 💡 Suggestions                           │
│                                           │
│ • open-school v2.1 (4 improvements)       │
│ • LinguaForge adds translation            │
│ • Combined: education-suite               │
│                                           │
│ [All three] [Just update OS] [Skip]       │
└──────────────────────────────────────────┘
  ↓
Usuario piensa: "¿Por qué no?" → Click en "All three"
  ↓
1. open-school → v2.1.0 (silent update, snapshot before)
2. LinguaForge → instala desde registry
3. Composition → genera ~/.qwen/skills/education-suite/
  ↓
Nuevo skill compuesto activo automáticamente
  ↓
Usuario continúa trabajando con la nueva composición
  ↓
Todo el tiempo anterior, el Composition Engine monitoraba
y fue adaptando las sugerencias según el flujo real
```

### Lo que Hace el Composition Engine en Background

```typescript
class CompositionEngine {
  private sessionState = {};
  private suggestionCache = new Map<string, Suggestion>();
  
  constructor(private registryUrl: string) {}
  
  // Cada X segundos verifica el estado global
  async tick() {
    // 1. Chequear updates para todas las skills activas
    for (const skill of this.getActiveSkills()) {
      await this.checkUpdate(skill);
    }
    
    // 2. Ver si hay composiciones nuevas posibles
    await this.checkNewCompositions();
    
    // 3. Refrescar sugerencias basadas en uso reciente
    await this.refreshSuggestions();
  }
  
  // Verifica si dos skills pueden complementarse
  private async canCompose(skillA: SkillEntry, skillB: SkillEntry): Promise<boolean> {
    const compatibilityScore = await calculateCompatibility(skillA, skillB);
    return compatibilityScore >= 0.7; // Umbral mínimo para sugerir
  }
  
  // Calcula cuánto tiempo llevara antes de notificar
  private async getTimeSinceLastNotif(skillId: string): number {
    return Date.now() - this.lastNotification.get(skillId) || Infinity;
  }
  
  // No molestar si ya sugirió hace <5 minutos
  shouldNotify(skillId: string): boolean {
    return this.getTimeSinceLastNotif(skillId) > 5 * 60 * 1000;
  }
}
```

---

## PRINCIPIOS UX PARA NO MATAR LA ADOPCIÓN

1. **No romper el flow bajo ninguna circunstancia**
   - Las actualizaciones silentes deben ser <1 segundo
   - Los popups deben tener botón "skip" inmediato

2. **Recomendar siempre algo relevante al contexto**
   - Nunca mostrar "Popular skills" genérico
   - Siempre mostrar "Skills que complementan TU flujo actual"

3. **Hacer que la composición sea visible y entendible**
   - Antes de aplicar, explicar qué hará cada skill en secuencia
   - Mostrar preview visual del output combinado

4. **Rollback siempre disponible e inmediato**
   - Un click vuelve al estado anterior sin perder trabajo
   - Snapshot creado ANTES de cualquier cambio

5. **Metered updates (controlar ritmo)**
   - Nunca más de 1 actualización simultánea
   - Si 2 updates llegan juntos, esperar a que termine la primera

---

## IMPLEMENTACIÓN RÁPIDA PRIMER PASO

Para empezar a probar este sistema hoy mismo:

### Paso 1: Crear el daemon de composition engine

```bash
mkdir -p ~/.qwen/skills-registry/daemon
cp cli/src/index.ts ~/.qwen/skills-registry/daemon/engine.ts
```

### Paso 2: Configurar intervalos de verificación

En cada SKILL.md frontmatter agregar:
```yaml
update_policy:
  check_interval_minutes: 30
  auto_minor: true
  notify_on_new_version: false  # Solo toast sutil
  compatible_with: []
```

### Paso 3: Comando hot-swap manual (sin waiting por daemon)

```bash
# Mientras usas open-school:
skills hotswap open-school

# Output instantáneo:
┌────────────────────────────────────┐
│ Available actions for open-school  │
│                                    │
│ [Update to v2.1.0]                 │
│ [Add LinguaForge]                  │
│ [Create composition combo]         │
│ [Check what else is available]     │
└────────────────────────────────────┘
```

Este es el MVP — funciona HOY sin esperar el daemon completo.
