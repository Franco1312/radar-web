"use client";

import { useParams } from "next/navigation";
import { useMetricDefinition, useHistorical } from "@/features/metrics/hooks";
import { MetricCard } from "@/components/cards/MetricCard";
import { Topbar } from "@/components/layout/Topbar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { getDateRange } from "@/lib/date";
import { getHumanCopy } from "@/lib/insights/humanCopy";
import { formatValue } from "@/lib/format/number";
import { useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, Info, Calendar, TrendingUp, Download } from "lucide-react";

// Dynamic import for chart
const TimeSeriesChart = dynamic(() => import("@/components/charts/TimeSeriesChart").then(mod => ({ default: mod.TimeSeriesChart })), {
  loading: () => <div className="h-80 bg-surface-tertiary rounded-lg animate-pulse" />
});

export default function MetricDetailPage() {
  const params = useParams();
  const metricId = params.id as string;

  const { data: definition, isLoading: defLoading, error: defError } = useMetricDefinition(metricId);
  const { data: historicalData, isLoading: histLoading, error: histError } = useHistorical(metricId);

  const isLoading = defLoading || histLoading;
  const hasError = defError || histError;

  // Process historical data for the chart
  const chartData = useMemo(() => {
    if (!historicalData?.points) return [];
    
    return historicalData.points
      .map(point => ({
        ts: point.ts,
        value: typeof point.value === "string" ? parseFloat(point.value) : point.value,
      }))
      .filter(point => !isNaN(point.value))
      .sort((a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime());
  }, [historicalData]);

  // Get latest value for interpretation
  const latestValue = useMemo(() => {
    if (!chartData.length) return null;
    return chartData[chartData.length - 1];
  }, [chartData]);

  // Get human copy interpretation
  const humanCopy = useMemo(() => {
    if (!latestValue || !definition) return null;
    return getHumanCopy(metricId, latestValue.value, {}, {
      freshnessH: 24,
      coverage30d: 85
    });
  }, [latestValue, definition, metricId]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-secondary">
        <Topbar />
        <main className="max-w-6xl mx-auto p-6">
          <div className="space-y-6">
            <LoadingSkeleton className="h-8 w-64" />
            <LoadingSkeleton className="h-80 w-full" />
            <LoadingSkeleton className="h-40 w-full" />
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (hasError) {
    // Check if it's a 500 error (metric not found/no data)
    const isMetricNotFound = histError?.message?.includes('500') || defError?.message?.includes('500');
    
    return (
      <div className="min-h-screen bg-surface-secondary">
        <Topbar />
        <main className="max-w-6xl mx-auto p-6">
          <ErrorState
            title={isMetricNotFound ? "Métrica sin datos" : "Error al cargar la métrica"}
            message={isMetricNotFound 
              ? "Esta métrica no tiene datos disponibles en el servidor de métricas."
              : "No se pudo cargar la información de la métrica seleccionada."
            }
            onRetry={() => window.location.reload()}
          />
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (!definition) {
    return (
      <div className="min-h-screen bg-surface-secondary">
        <Topbar />
        <main className="max-w-6xl mx-auto p-6">
          <ErrorState
            title="Métrica no encontrada"
            message="La métrica solicitada no existe en el sistema."
            onRetry={() => window.location.reload()}
          />
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-secondary">
      <Topbar />
      
      <main className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link 
            href="/dashboard"
            className="flex items-center gap-2 text-text-600 hover:text-text-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al Dashboard
          </Link>
        </div>

        {/* Metric Header */}
        <div className="bg-white p-6 rounded-lg border border-border-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-text-900 mb-2">
                {definition.name}
              </h1>
              <p className="text-text-600">
                {definition.description}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted mb-1">
                Última actualización
              </div>
              <div className="text-sm font-medium text-text-900">
                {latestValue ? new Date(latestValue.ts).toLocaleDateString('es-AR') : 'N/A'}
              </div>
            </div>
          </div>

          {/* Metric Card */}
          <MetricCard
            id={metricId}
            category={getCategory(metricId)}
            title={definition.name}
            value={latestValue?.value}
            unit={getUnit(definition.unit)}
            updatedAt={latestValue?.ts}
            def={definition}
            latest={latestValue ? {
              metric_id: metricId,
              ts: latestValue.ts,
              value: latestValue.value,
              metadata: {}
            } : undefined}
            humanCopy={humanCopy}
            contextData={{
              freshnessH: 24,
              coverage30d: 85
            }}
            className="border-0 shadow-none"
          />
        </div>

        {/* Chart Section */}
        <div className="bg-white p-6 rounded-lg border border-border-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-900">
              Evolución Histórica
            </h2>
            <div className="flex items-center gap-2 text-sm text-muted">
              <Calendar className="h-4 w-4" />
              Últimos 90 días
            </div>
          </div>
          
          <TimeSeriesChart
            data={chartData}
            unit={definition.unit || ''}
            height={400}
            color="var(--info)"
            name={definition.name}
          />
        </div>

        {/* How it's calculated */}
        <div className="bg-white p-6 rounded-lg border border-border-200">
          <h3 className="text-lg font-semibold text-text-900 mb-4 flex items-center gap-2">
            <Info className="h-5 w-5" />
            Cómo se calcula
          </h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-text-900 mb-2">Fórmula</h4>
              <div className="bg-surface-tertiary p-4 rounded-lg font-mono text-sm">
                {definition.formula || 'Fórmula no disponible'}
              </div>
            </div>
            
            {definition.dependencies && definition.dependencies.length > 0 && (
              <div>
                <h4 className="font-medium text-text-900 mb-2">Dependencias</h4>
                <div className="flex flex-wrap gap-2">
                  {definition.dependencies.map((dep, index) => (
                    <span 
                      key={index}
                      className="badge badge-info text-xs"
                    >
                      {dep}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <h4 className="font-medium text-text-900 mb-2">Interpretación</h4>
              <div className="text-sm text-text-600 leading-relaxed space-y-2">
                {humanCopy ? (
                  <>
                    <div>
                      <strong>Resumen:</strong> {humanCopy.summary}
                    </div>
                    <div>
                      <strong>Por qué importa:</strong> {humanCopy.why}
                    </div>
                    {humanCopy.watch && (
                      <div>
                        <strong>Qué mirar:</strong> {humanCopy.watch}
                      </div>
                    )}
                  </>
                ) : (
                  'Interpretación no disponible'
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Data Table */}
        {chartData.length > 0 && (
          <div className="bg-white p-6 rounded-lg border border-border-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-900">
                Datos Recientes
              </h3>
              <button className="flex items-center gap-2 px-3 py-2 text-sm text-info hover:bg-info-light rounded-lg transition-colors">
                <Download className="h-4 w-4" />
                Exportar CSV
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-200">
                    <th className="text-left py-2 font-medium text-text-700">Fecha</th>
                    <th className="text-right py-2 font-medium text-text-700">Valor</th>
                    <th className="text-right py-2 font-medium text-text-700">Cambio</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.slice(-10).reverse().map((point: any, index: number) => {
                    // For the most recent point, show no change
                    if (index === 0) {
                      return (
                        <tr key={point.ts} className="border-b border-border-200 last:border-b-0">
                          <td className="py-2 text-text-600">
                            {new Date(point.ts).toLocaleDateString('es-AR')}
                          </td>
                          <td className="py-2 text-right font-medium text-text-900">
                            {formatValue(point.value, getUnit(definition.unit))}
                          </td>
                          <td className="py-2 text-right">
                            <span className="text-sm text-muted">-</span>
                          </td>
                        </tr>
                      );
                    }
                    
                    // For other points, compare with the previous point in the reversed array
                    const prevPoint = chartData.slice(-10).reverse()[index - 1];
                    const change = point.value - prevPoint.value;
                    const changePercent = prevPoint.value !== 0 ? (change / Math.abs(prevPoint.value)) * 100 : 0;
                    
                    return (
                      <tr key={point.ts} className="border-b border-border-200 last:border-b-0">
                        <td className="py-2 text-text-600">
                          {new Date(point.ts).toLocaleDateString('es-AR')}
                        </td>
                        <td className="py-2 text-right font-medium text-text-900">
                          {formatValue(point.value, getUnit(definition.unit))}
                        </td>
                        <td className="py-2 text-right">
                          <span className={`text-sm ${
                            change > 0 ? 'text-positive' : change < 0 ? 'text-negative' : 'text-muted'
                          }`}>
                            {change > 0 ? '+' : ''}{changePercent.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}