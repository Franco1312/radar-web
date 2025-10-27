"use client";

import { DEFAULT_DASHBOARD_METRICS } from "@/config/app";
import { useHealth } from "@/features/health/hooks";
import { useMetricDefinitions, useLatest, useHistorical } from "@/features/metrics/hooks";
import { MetricCardWrapper } from "@/components/cards/MetricCardWrapper";
import { Topbar } from "@/components/layout/Topbar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { WhatToWatchNow } from "@/components/panels/WhatToWatchNow";
import { DashboardSkeleton } from "@/components/ui/LoadingSkeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { formatDate } from "@/lib/date";
import { useDailyReading } from "@/hooks/useDailyReading";
import { useWatchItems } from "@/hooks/useWatchItems";
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

// Dynamic imports for charts
const TimeSeriesChart = dynamic(() => import("@/components/charts/TimeSeriesChart").then(mod => ({ default: mod.TimeSeriesChart })), {
  loading: () => <div className="h-80 bg-surface-tertiary rounded-lg animate-pulse" />
});

const ComparisonChart = dynamic(() => import("@/components/charts/ComparisonChart").then(mod => ({ default: mod.ComparisonChart })), {
  loading: () => <div className="h-80 bg-surface-tertiary rounded-lg animate-pulse" />
});

export default function DashboardPage() {
  const { data: health, isLoading: healthLoading, error: healthError } = useHealth();
  const { data: definitions, isLoading: defsLoading, error: defsError } = useMetricDefinitions();
  const { data: latestData, isLoading: latestLoading, error: latestError } = useLatest([...DEFAULT_DASHBOARD_METRICS]);

  // Historical data for charts - without date filters for testing
  const { data: reservesData, error: reservesError } = useHistorical("ratio.reserves_to_base");
  const { data: baseData, error: baseError } = useHistorical("delta.base_7d.pct");

  // Create a map of definitions for quick lookup
  const defsMap = useMemo(() => {
    if (!definitions) return new Map();
    return new Map(definitions.map(def => [def.id, def]));
  }, [definitions]);

  // Get the latest timestamp for "updated at" display
  const lastUpdate = useMemo(() => {
    if (!latestData?.items?.length) return null;
    const timestamps = latestData.items.map(item => new Date(item.ts).getTime());
    return new Date(Math.max(...timestamps));
  }, [latestData]);

  // Use custom hooks for cleaner logic
  const dailyReading = useDailyReading({ latestData });
  const watchItems = useWatchItems({ latestData });

  const isLoading = healthLoading || defsLoading || latestLoading;
  const hasError = healthError || defsError || latestError;
  const hasChartError = reservesError || baseError;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-secondary">
        <Topbar />
        <main className="max-w-7xl mx-auto p-6">
          <DashboardSkeleton />
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-surface-secondary">
        <Topbar />
        <main className="max-w-7xl mx-auto p-6">
          <ErrorState
            title="Error al cargar el dashboard"
            message="No se pudieron cargar los datos del dashboard. Por favor, verifica que el servidor de métricas esté funcionando."
            onRetry={() => window.location.reload()}
          />
        </main>
        <SiteFooter />
      </div>
    );
  }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 relative">
        {/* Background decorations */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-blue-300/40 to-indigo-300/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-gradient-to-tr from-emerald-300/40 to-blue-300/40 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-br from-purple-300/35 to-pink-300/35 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
        
        <Topbar
          health={health}
          lastUpdated={lastUpdate?.toISOString()}
          onRefresh={() => window.location.reload()}
        />

        <main className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Reading of the day - Soft Enhanced */}
        <section 
          className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50/30 p-8 rounded-xl border border-blue-200/50 shadow-md"
          aria-live="polite"
        >
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-200/20 to-blue-200/20 rounded-full translate-y-12 -translate-x-12"></div>
          <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-gradient-to-br from-purple-200/15 to-pink-200/15 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Lectura del día
                </h2>
                <p className="text-sm text-gray-500">
                  Análisis económico en tiempo real
                </p>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-lg border border-blue-100/50 shadow-sm">
              <div className="text-base text-gray-700 leading-relaxed">
                {dailyReading ? (
                  <div className="space-y-3">
                    <p className="flex items-start gap-3">
                      <span className="text-xl text-blue-500">📊</span>
                      <span className="font-medium">
                        Hoy, {dailyReading.headline.toLowerCase()}.
                      </span>
                    </p>
                    <p className="text-sm text-gray-600 ml-8">
                      <strong>Por qué importa:</strong> {dailyReading.why}
                    </p>
                    <div className="flex items-center gap-3 ml-8 text-xs">
                      <span className={`px-2 py-1 rounded-full font-medium ${
                        dailyReading.risk === 'positive' ? 'bg-green-100 text-green-700' :
                        dailyReading.risk === 'warning' ? 'bg-amber-100 text-amber-700' :
                        dailyReading.risk === 'negative' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        Riesgo: {dailyReading.risk === 'positive' ? 'Bajo' : 
                                dailyReading.risk === 'warning' ? 'Medio' : 
                                dailyReading.risk === 'negative' ? 'Alto' : 'Neutral'}
                      </span>
                      <span className={`px-2 py-1 rounded-full font-medium bg-gray-100 ${
                        dailyReading.confidence === 'alta' ? 'text-green-600' :
                        dailyReading.confidence === 'media' ? 'text-amber-600' :
                        'text-red-600'
                      }`}>
                        Confianza: {dailyReading.confidence}
                      </span>
                      <span className="text-gray-500">
                        Última act.: {lastUpdate ? Math.round((Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60)) : '?'}h
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="flex items-start gap-3">
                    <span className="text-xl text-emerald-500">📈</span>
                    <span className="font-medium">Las métricas se mantienen estables. No se detectaron cambios significativos en el corto plazo.</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Metrics Grid - Soft Enhanced */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Métricas Principales
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {DEFAULT_DASHBOARD_METRICS.map((metricId) => {
              const def = defsMap.get(metricId);
              const latest = latestData?.items?.find(item => item.metric_id === metricId);
              
              if (!def) return null;

              return (
                <MetricCardWrapper
                  key={metricId}
                  metricId={metricId}
                  def={def}
                  latest={latest}
                  contextData={{
                    freshnessH: 24, // Default - could be calculated from updatedAt
                    coverage30d: 85 // Default - could be calculated from historical data
                  }}
                />
              );
            })}
          </div>
        </section>

        {/* Charts Section */}
        <section>
          <h2 className="text-lg font-semibold text-text-900 mb-4">
            Tendencias Históricas
          </h2>
          {hasChartError ? (
            <div className="surface-card p-6 text-center">
              <div className="text-amber-600 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Datos históricos no disponibles
              </h3>
              <p className="text-sm text-gray-600">
                Los gráficos históricos no se pueden cargar en este momento. 
                Las métricas principales siguen funcionando correctamente.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Reserves to Base Ratio Chart */}
              <div className="surface-card p-6">
                <h3 className="text-md font-medium text-text-900 mb-2">
                  Ratio Reservas a Base Monetaria
                </h3>
                <p className="text-sm text-text-600 mb-4">
                  Evolución del respaldo del peso en USD
                </p>
                <TimeSeriesChart
                  data={reservesData?.points?.map(p => ({
                    ts: p.ts,
                    value: typeof p.value === 'string' ? parseFloat(p.value) : p.value
                  })) || []}
                  unit="ratio"
                  height={300}
                  color="var(--info)"
                  name="Ratio"
                />
              </div>
              
              {/* Base Monetary Change Chart */}
              <div className="surface-card p-6">
                <h3 className="text-md font-medium text-text-900 mb-2">
                  Cambio Base Monetaria 7d
                </h3>
                <p className="text-sm text-text-600 mb-4">
                  Variación semanal de la base monetaria
                </p>
                <TimeSeriesChart
                  data={baseData?.points?.map(p => ({
                    ts: p.ts,
                    value: typeof p.value === 'string' ? parseFloat(p.value) : p.value
                  })) || []}
                  unit="percent"
                  height={300}
                  color="var(--warning)"
                  name="Cambio %"
                />
              </div>
            </div>
          )}
        </section>

        {/* What to Watch Now */}
        {watchItems.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-100 rounded-lg">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L16 7l-6 6-6-6z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Qué mirar ahora
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {watchItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-amber-200/50 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    if (item.metricId) {
                      window.location.href = `/metric/${item.metricId}`;
                    }
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      item.priority === 'high' ? 'bg-red-500' :
                      item.priority === 'medium' ? 'bg-amber-500' :
                      'bg-green-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="mt-2 text-xs text-gray-500">
                        Prioridad: {item.priority === 'high' ? 'Alta' : 
                                   item.priority === 'medium' ? 'Media' : 'Baja'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Quick Actions */}
        <section>
          <h2 className="text-lg font-semibold text-text-900 mb-4">
            Acciones Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/metrics"
              className="surface-card surface-card-hover p-6 block"
            >
              <h3 className="font-medium text-text-900 mb-2">Ver Todas las Métricas</h3>
              <p className="text-sm text-text-600">
                Explora el catálogo completo de métricas disponibles
              </p>
            </Link>
            
            <Link
              href="/alerts"
              className="surface-card surface-card-hover p-6 block"
            >
              <h3 className="font-medium text-text-900 mb-2">Configurar Alertas</h3>
              <p className="text-sm text-text-600">
                Establece notificaciones para cambios importantes
              </p>
            </Link>
            
            <Link
              href="/export"
              className="surface-card surface-card-hover p-6 block"
            >
              <h3 className="font-medium text-text-900 mb-2">Exportar Datos</h3>
              <p className="text-sm text-text-600">
                Descarga datos históricos en diferentes formatos
              </p>
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}