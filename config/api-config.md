# API Configuration

## Problema Actual
La aplicación está intentando conectarse a la API en `http://localhost:3000` pero está recibiendo un error HTTP 500.

## Solución

### 1. Crear archivo `.env.local`
Crea un archivo `.env.local` en la raíz del proyecto con el siguiente contenido:

```bash
# Metrics API Base URL - Update this to your actual API endpoint
NEXT_PUBLIC_METRICS_BASE_URL=http://localhost:3000

# Request timeout in milliseconds
REQUEST_TIMEOUT_MS=12000

# Trend calculation epsilon
TREND_EPSILON=0.001
```

### 2. Verificar que la API esté corriendo
Asegúrate de que tu API de métricas esté corriendo en el puerto correcto. Puedes verificar visitando:
- `http://localhost:3000/api/v1/metrics` - Debería devolver la lista de métricas
- `http://localhost:3000/api/v1/metrics/summary?ids=delta.reserves_7d.pct` - Debería devolver datos de ejemplo

### 3. Si la API está en otro puerto
Si tu API está corriendo en un puerto diferente (ej: 8000), actualiza la URL en `.env.local`:
```bash
NEXT_PUBLIC_METRICS_BASE_URL=http://localhost:8000
```

### 4. Si no tienes API
Si no tienes una API de métricas corriendo, la aplicación mostrará:
- ✅ Métricas principales con datos de ejemplo
- ✅ Lectura del día
- ✅ Qué mirar ahora
- ⚠️ Gráficos históricos no disponibles (con mensaje informativo)

## Estado Actual
- ✅ App funciona sin API (con datos de ejemplo)
- ✅ Sistema HumanCopy implementado
- ✅ Componentes reutilizables
- ⚠️ Gráficos históricos requieren API funcionando
