"use client";

import { DEFAULT_DASHBOARD_METRICS } from "@/config/app";
import { useHealth } from "@/features/health/hooks";
import { useMetricDefinitions, useLatest, useHistorical } from "@/features/metrics/hooks";
import { MetricCard } from "@/components/cards/MetricCard";
import { Topbar } from "@/components/layout/Topbar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { WhatToWatchNow, generateWatchItems } from "@/components/panels/WhatToWatchNow";
import { DashboardSkeleton } from "@/components/ui/LoadingSkeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { formatDate } from "@/lib/date";
import { getInterpretation } from "@/lib/analytics/interpretation";
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

  // Historical data for charts
  const { data: reservesData } = useHistorical("ratio.reserves_to_base", {
    from: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    to: new Date().toISOString(),
  });

  const { data: baseData } = useHistorical("delta.base_7d.pct", {
    from: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    to: new Date().toISOString(),
  });

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

  // Generate watch items from metrics
  const watchItems = useMemo(() => {
    if (!latestData?.items || !definitions) return [];
    
    const metrics = latestData.items.map(item => {
      const def = defsMap.get(item.metric_id);
      if (!def) return null;
      
      const interpretation = getInterpretation(item.metric_id, typeof item.value === 'string' ? parseFloat(item.value) : item.value, item.metadata);
      
      return {
        id: item.metric_id,
        name: def.name,
        value: typeof item.value === 'string' ? parseFloat(item.value) : item.value,
        trend: interpretation.tone === 'positive' ? 'up' : interpretation.tone === 'negative' ? 'down' : 'flat' as 'up' | 'down' | 'flat',
        interpretation: interpretation.text
      };
    }).filter((item): item is NonNullable<typeof item> => item !== null);

    return generateWatchItems(metrics);
  }, [latestData, definitions, defsMap]);

  const isLoading = healthLoading || defsLoading || latestLoading;
  const hasError = healthError || defsError || latestError;

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
    <div className="min-h-screen bg-surface-secondary">
      <Topbar 
        health={health} 
        lastUpdated={lastUpdate?.toISOString()}
        onRefresh={() => window.location.reload()}
      />

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Reading of the day - Enhanced */}
        <section 
          className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8 rounded-2xl border-2 border-blue-200 shadow-lg"
          aria-live="polite"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-400/20 to-blue-400/20 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Lectura del día
                </h2>
                <p className="text-sm text-gray-600">
                  Análisis económico en tiempo real
                </p>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-white/50 shadow-lg">
              <div className="text-lg text-gray-800 leading-relaxed font-medium">
                {watchItems.length > 0 ? (
                  <p className="flex items-start gap-3">
                    <span className="text-2xl">📊</span>
                    <span>{watchItems[0].description}</span>
                  </p>
                ) : (
                  <p className="flex items-start gap-3">
                    <span className="text-2xl">📈</span>
                    <span>Las métricas se mantienen estables. No se detectaron cambios significativos en el corto plazo.</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Metrics Grid - Enhanced */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Métricas Principales
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {DEFAULT_DASHBOARD_METRICS.map((metricId) => {
              const def = defsMap.get(metricId);
              const latest = latestData?.items?.find(item => item.metric_id === metricId);
              
              if (!def) return null;

              // Map category from metric ID
              const getCategory = (id: string): 'deltas' | 'ratios' | 'fx' | 'monetary' | 'data_health' => {
                if (id.startsWith('delta.')) return 'deltas';
                if (id.startsWith('ratio.')) return 'ratios';
                if (id.startsWith('fx.')) return 'fx';
                if (id.startsWith('data.')) return 'data_health';
                return 'monetary';
              };

              // Map unit from definition
              const getUnit = (unit?: string): 'percent' | 'ARS' | 'USD' | 'ratio' | 'other' => {
                if (!unit) return 'other';
                if (unit.includes('%') || unit.includes('percent')) return 'percent';
                if (unit.includes('ARS')) return 'ARS';
                if (unit.includes('USD')) return 'USD';
                if (unit.includes('ratio')) return 'ratio';
                return 'other';
              };

              return (
                <Link key={metricId} href={`/metric/${metricId}`} className="block h-full">
                  <MetricCard
                    id={metricId}
                    category={getCategory(metricId)}
                    title={def.name}
                    value={typeof latest?.value === 'string' ? parseFloat(latest.value) : latest?.value}
                    unit={getUnit(def.unit)}
                    updatedAt={latest?.ts}
                    def={def}
                    latest={latest}
                    className="h-full min-h-[280px]"
                  />
                </Link>
              );
            })}
          </div>
        </section>

        {/* Charts Section */}
        <section>
          <h2 className="text-lg font-semibold text-text-900 mb-4">
            Tendencias Históricas
          </h2>
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
        </section>

        {/* What to Watch Now */}
        {watchItems.length > 0 && (
          <section>
            <WhatToWatchNow 
              items={watchItems.map(item => ({
                ...item,
                onClick: () => {
                  if (item.metricId) {
                    window.location.href = `/metric/${item.metricId}`;
                  }
                }
              }))}
            />
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