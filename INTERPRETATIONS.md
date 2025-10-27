# 📊 Interpretaciones y Textos del Dashboard

Este documento centraliza todas las interpretaciones, textos y mensajes que se muestran en el dashboard según los datos recibidos del Metrics Engine.

## 🎯 Estructura General

### Tipos de Interpretación
- **Positiva** (`positive`): Verde - Mejoras o señales favorables
- **Negativa** (`negative`): Rojo - Alertas o señales desfavorables  
- **Advertencia** (`warning`): Ámbar - Situaciones a monitorear
- **Neutral** (`neutral`): Gris - Situaciones estables

---

## 📈 Métricas de Deltas (Cambios)

### `delta.reserves_7d.pct` - Cambio de Reservas 7 días

**Interpretaciones por umbrales:**

| Valor | Interpretación | Tono | Color |
|-------|----------------|------|-------|
| `> 2%` | "Las reservas crecieron fuertemente esta semana, señal positiva." | positive | Verde |
| `0.5% - 2%` | "Las reservas aumentaron levemente esta semana, buena señal." | positive | Verde |
| `-0.5% - 0.5%` | "Las reservas se mantienen estables esta semana." | neutral | Gris |
| `-2% - -0.5%` | "Las reservas disminuyeron levemente esta semana, atención." | warning | Ámbar |
| `< -2%` | "Las reservas cayeron fuertemente esta semana; el mercado percibe mayor presión cambiaria." | negative | Rojo |

### `delta.base_7d.pct` - Cambio de Base Monetaria 7 días

**Interpretaciones por umbrales:**

| Valor | Interpretación | Tono | Color |
|-------|----------------|------|-------|
| `< -2%` | "La base monetaria se contrajo fuertemente, lo que podría aliviar la presión inflacionaria." | positive | Verde |
| `-2% - -0.5%` | "La base monetaria se redujo levemente, un paso hacia la estabilidad." | positive | Verde |
| `-0.5% - 0.5%` | "La base monetaria se mantiene estable esta semana." | neutral | Gris |
| `0.5% - 2%` | "La base monetaria aumentó levemente, monitorear su impacto." | warning | Ámbar |
| `> 2%` | "La base monetaria creció fuertemente esta semana, lo que podría generar presión inflacionaria." | negative | Rojo |

### `delta.base_30d.pct` - Cambio de Base Monetaria 30 días

**Interpretaciones por umbrales:**

| Valor | Interpretación | Tono | Color |
|-------|----------------|------|-------|
| `< -5%` | "Fuerte contracción de la base monetaria en el último mes, positivo para la estabilidad." | positive | Verde |
| `-5% - -1%` | "Reducción moderada de la base monetaria en 30 días." | positive | Verde |
| `-1% - 1%` | "La base monetaria se mantuvo relativamente estable en el último mes." | neutral | Gris |
| `1% - 5%` | "Aumento moderado de la base monetaria en 30 días, a observar." | warning | Ámbar |
| `> 5%` | "Expansión significativa de la base monetaria en el último mes, riesgo inflacionario." | negative | Rojo |

---

## ⚖️ Métricas de Ratios

### `ratio.reserves_to_base` - Ratio Reservas a Base Monetaria

**Interpretaciones por umbrales:**

| Valor | Interpretación | Tono | Color |
|-------|----------------|------|-------|
| `> 0.8` | "Respaldo robusto: las reservas cubren ampliamente la base monetaria." | positive | Verde |
| `0.6 - 0.8` | "Respaldo mixto: las reservas ofrecen una cobertura razonable." | warning | Ámbar |
| `< 0.6` | "Respaldo frágil: las reservas son bajas en relación a la base monetaria, situación delicada." | negative | Rojo |

---

## 💱 Métricas de FX (Foreign Exchange)

### `fx.vol_7d.usd` - Volatilidad USD 7 días

**Interpretaciones por umbrales:**

| Valor | Interpretación | Tono | Color |
|-------|----------------|------|-------|
| `< 0.5` | "La volatilidad del USD está baja esta semana, indicando calma en el mercado cambiario." | positive | Verde |
| `0.5 - 2` | "La volatilidad del USD se mantiene en niveles moderados." | neutral | Gris |
| `> 2` | "La volatilidad del USD es alta esta semana, señal de incertidumbre." | negative | Rojo |

### `fx.trend_14v30.usd` - Tendencia USD (MA14 vs MA30)

**Interpretaciones por umbrales:**

| Valor | Interpretación | Tono | Color |
|-------|----------------|------|-------|
| `> 0` | "El tipo de cambio muestra una tendencia alcista en el corto plazo (MA14 > MA30)." | negative | Rojo |
| `= 0` | "El tipo de cambio se mantiene estable en el corto plazo." | neutral | Gris |
| `< 0` | "El tipo de cambio muestra una tendencia bajista en el corto plazo (MA14 < MA30)." | positive | Verde |

---

## 🔍 Métricas de Calidad de Datos

### `data.freshness.bcra.cambiarias.usd` - Frescura de Datos BCRA

**Interpretaciones por umbrales:**

| Valor (horas) | Interpretación | Tono | Color |
|---------------|----------------|------|-------|
| `≤ 24` | "Datos de reservas actualizados: información fresca disponible." | positive | Verde |
| `24 - 48` | "Datos de reservas con leve retraso: aún útiles para el análisis." | warning | Ámbar |
| `> 48` | "Datos de reservas desactualizados: la información podría no reflejar la situación actual." | negative | Rojo |

---

## 📝 Textos de la Sección "Lectura del día"

### Mensajes por Prioridad

**1. Alertas Negativas (Prioridad Alta):**
```
"Alerta: [NOMBRE_MÉTRICA] muestra una tendencia negativa. [INTERPRETACIÓN]"
```

**2. Advertencias (Prioridad Media):**
```
"Atención: [NOMBRE_MÉTRICA] presenta una situación a monitorear. [INTERPRETACIÓN]"
```

**3. Noticias Positivas (Prioridad Baja):**
```
"Noticia positiva: [NOMBRE_MÉTRICA] con buen desempeño. [INTERPRETACIÓN]"
```

**4. Estado Estable (Default):**
```
"Las métricas se mantienen estables. No se detectaron cambios significativos en el corto plazo."
```

---

## 🎨 Códigos de Color y Iconos

### Colores Semánticos
- **Verde** (`text-positive`): `#16a34a` - Situaciones positivas
- **Rojo** (`text-negative`): `#dc2626` - Alertas y situaciones negativas
- **Ámbar** (`text-warning`): `#f59e0b` - Advertencias y situaciones a monitorear
- **Gris** (`text-muted`): `#6b7280` - Estados neutrales

### Iconos de Tendencia
- **↗** (Verde): Tendencia alcista positiva
- **↘** (Rojo): Tendencia bajista negativa  
- **→** (Gris): Tendencia estable/neutral

### Iconos de Categoría
- **📈** Deltas
- **⚖️** Ratios
- **💱** FX
- **💰** Monetario
- **🔍** Calidad de Datos

---

## 🔧 Configuración Técnica

### Umbrales de Tendencia
```typescript
const TREND_EPSILON = 0.001; // Umbral mínimo para considerar cambio significativo
```

### Lógica de Priorización para "Lectura del día"
1. **Primero**: Métricas con tono `negative`
2. **Segundo**: Métricas con tono `warning`  
3. **Tercero**: Métricas con tono `positive`
4. **Default**: Mensaje de estabilidad general

### Formateo de Valores
- **Porcentajes**: `formatPercent(value, decimals)`
- **Millones ARS**: `formatMillionsARS(value, decimals)`
- **Millones USD**: `formatMillionsUSD(value, decimals)`
- **Ratios**: `formatRatio(value, decimals)`

---

## 📋 Checklist de Implementación

- [x] Interpretaciones para deltas de reservas
- [x] Interpretaciones para deltas de base monetaria
- [x] Interpretaciones para ratios de respaldo
- [x] Interpretaciones para volatilidad FX
- [x] Interpretaciones para tendencias FX
- [x] Interpretaciones para frescura de datos
- [x] Sistema de priorización para "Lectura del día"
- [x] Códigos de color semánticos
- [x] Iconos de tendencia y categoría
- [x] Formateo de valores numéricos

---

## 🚀 Uso en el Código

```typescript
import { getInterpretation } from '@/lib/analytics/interpretation';

const interpretation = getInterpretation(metricId, value, metadata);
// Retorna: { text: string, tone: 'positive' | 'negative' | 'warning' | 'neutral' }
```

---

*Última actualización: Octubre 2024*
*Versión: 1.0.0*
