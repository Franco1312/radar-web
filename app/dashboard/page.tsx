"use client";

import { useHealth } from "@/features/health/hooks";
import { useMetricDefinitions, useLatest } from "@/features/metrics/hooks";
import { HealthBadge } from "@/components/ui/HealthBadge";
import { MetricCard } from "@/components/cards/MetricCard";
import { TimeSeriesChart } from "@/components/charts/TimeSeriesChart";
import { ErrorState } from "@/components/ui/ErrorState";
import { DashboardSkeleton } from "@/components/ui/LoadingSkeleton";
import { DEFAULT_DASHBOARD_METRICS, DATE_DEFAULT_RANGE_DAYS } from "@/config/app";
import { formatDate } from "@/lib/date";
import { useMemo } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: health, isLoading: healthLoading, error: healthError } = useHealth();
  const { data: definitions, isLoading: defsLoading, error: defsError } = useMetricDefinitions();
  const { data: latestData, isLoading: latestLoading, error: latestError } = useLatest([...DEFAULT_DASHBOARD_METRICS]);

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

  const isLoading = healthLoading || defsLoading || latestLoading;
  const hasError = healthError || defsError || latestError;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <ErrorState
            title="Error al cargar el dashboard"
            message="No se pudieron cargar los datos del dashboard. Por favor, verifica que el servidor de métricas esté funcionando."
            onRetry={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Radar Web</h1>
              <p className="text-sm text-gray-600">Dashboard de Métricas Económicas</p>
            </div>
            <div className="flex items-center gap-4">
              {health && <HealthBadge health={health} />}
              {lastUpdate && (
                <div className="text-sm text-gray-600">
                  Actualizado al: {formatDate(lastUpdate.toISOString())}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Metrics Grid */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Métricas Principales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {DEFAULT_DASHBOARD_METRICS.map((metricId) => {
              const def = defsMap.get(metricId);
              const latest = latestData?.items?.find(item => item.metric_id === metricId);
              
              if (!def) return null;

              return (
                <Link key={metricId} href={`/metric/${metricId}`}>
                  <MetricCard
                    def={def}
                    latest={latest}
                    className="h-full"
                  />
                </Link>
              );
            })}
          </div>
        </section>

        {/* Charts Section */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Tendencias Históricas
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Reserves to Base Ratio Chart */}
            <div className="bg-white p-6 rounded-lg border">
              <TimeSeriesChart
                data={[]} // This would be populated with historical data
                unit="ratio"
                title="Ratio Reservas a Base Monetaria"
                description="Evolución del respaldo del peso en USD"
                height={300}
              />
            </div>
            
            {/* Base Monetary Change Chart */}
            <div className="bg-white p-6 rounded-lg border">
              <TimeSeriesChart
                data={[]} // This would be populated with historical data
                unit="percent"
                title="Cambio Base Monetaria 7d"
                description="Variación semanal de la base monetaria"
                height={300}
              />
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Acciones Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/metrics"
              className="bg-white p-6 rounded-lg border hover:shadow-md transition-shadow"
            >
              <h3 className="font-medium text-gray-900 mb-2">Ver Todas las Métricas</h3>
              <p className="text-sm text-gray-600">
                Explora el catálogo completo de métricas disponibles
              </p>
            </Link>
            
            <Link
              href="/alerts"
              className="bg-white p-6 rounded-lg border hover:shadow-md transition-shadow"
            >
              <h3 className="font-medium text-gray-900 mb-2">Configurar Alertas</h3>
              <p className="text-sm text-gray-600">
                Establece notificaciones para cambios importantes
              </p>
            </Link>
            
            <Link
              href="/export"
              className="bg-white p-6 rounded-lg border hover:shadow-md transition-shadow"
            >
              <h3 className="font-medium text-gray-900 mb-2">Exportar Datos</h3>
              <p className="text-sm text-gray-600">
                Descarga datos históricos en diferentes formatos
              </p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
