# Radar Web - Dashboard de Métricas Económicas

Dashboard profesional para monitoreo de métricas económicas en tiempo real, desarrollado con Next.js 14, TypeScript y Tailwind CSS.

## 🚀 Características

- **Dashboard en tiempo real** con métricas económicas clave
- **Interpretaciones didácticas** para cada métrica
- **Gráficos interactivos** con Recharts
- **Diseño responsive** y accesible
- **Arquitectura modular** por features
- **TypeScript estricto** con validación Zod
- **Cache inteligente** con TanStack Query

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS + shadcn/ui
- **Estado**: TanStack Query
- **Validación**: Zod
- **Gráficos**: Recharts
- **Iconos**: Lucide React

## 📋 Prerrequisitos

- Node.js >= 20.9.0
- npm o yarn
- Servidor de métricas ejecutándose en `http://localhost:3000`

## ⚙️ Configuración

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd radar-web
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   Crear archivo `.env.local`:
   ```env
   NEXT_PUBLIC_METRICS_BASE_URL=http://localhost:3000
   REQUEST_TIMEOUT_MS=12000
   TREND_EPSILON=0.001
   ```

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**
   ```
   http://localhost:3001
   ```

## 🏗️ Arquitectura

```
/app
  /(dashboard)/page.tsx          # Dashboard principal
  /metric/[id]/page.tsx         # Detalle de métrica
  /layout.tsx                   # Layout con providers
  /globals.css                  # Estilos globales

/components
  /cards/MetricCard.tsx         # Tarjeta de métrica
  /charts/TimeSeriesChart.tsx   # Gráfico de series temporales
  /ui/                          # Componentes base (shadcn/ui)

/features
  /health/                      # Feature de salud del sistema
  /metrics/                     # Feature de métricas

/lib
  /http.ts                      # Cliente HTTP
  /format.ts                    # Utilidades de formato
  /date.ts                      # Utilidades de fecha

/types
  /health.ts                    # Tipos de health
  /metrics.ts                   # Tipos de métricas
```

## 🔌 Integración con APIs

El dashboard se integra con el **Metrics Engine** a través de las siguientes APIs:

- `GET /api/health` - Estado del sistema
- `GET /api/v1/metrics` - Lista de métricas
- `GET /api/v1/metrics/{id}` - Detalle de métrica
- `GET /api/v1/metrics/{id}?from=&to=` - Datos históricos
- `GET /api/v1/metrics/summary?ids=` - Valores actuales

## 🎨 Diseño

- **Colores semánticos**: Verde (positivo), Rojo (negativo), Ámbar (alerta), Gris (neutral)
- **Tipografía**: Geist Sans (principal), Geist Mono (código)
- **Iconos**: Lucide React con indicadores de tendencia
- **Responsive**: Mobile-first con breakpoints de Tailwind

## 📊 Métricas Incluidas

- Delta de reservas (7d, 30d)
- Delta de base monetaria (7d, 30d)
- Ratio reservas a base monetaria
- Volatilidad del dólar (7d)
- Tendencia del dólar (14v30)
- Freshness de datos BCRA

## 🚀 Despliegue

1. **Build de producción**
   ```bash
   npm run build
   ```

2. **Iniciar servidor**
   ```bash
   npm start
   ```

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

Para soporte técnico o preguntas, crear un issue en el repositorio.