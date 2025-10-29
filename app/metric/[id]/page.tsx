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
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1f1f1f] text-white font-inter relative overflow-hidden">
        {/* Background decorations - Dark EcoSense style */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-[#F4D35E]/15 to-[#F4D35E]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-gradient-to-tr from-[#F4D35E]/12 to-[#F4D35E]/4 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-br from-[#F4D35E]/10 to-[#F4D35E]/3 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-40 left-20 w-24 h-24 bg-gradient-to-br from-[#F4D35E]/8 to-[#F4D35E]/2 rounded-full blur-2xl"></div>
        <div className="absolute bottom-40 right-20 w-20 h-20 bg-gradient-to-br from-[#F4D35E]/6 to-[#F4D35E]/1 rounded-full blur-xl"></div>
        
        <Topbar />
        <main className="max-w-6xl mx-auto p-6 relative z-10">
          <div className="space-y-6">
            <div className="animate-pulse bg-white/20 rounded h-8 w-64"></div>
            <div className="animate-pulse bg-white/20 rounded h-80 w-full"></div>
            <div className="animate-pulse bg-white/20 rounded h-40 w-full"></div>
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
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1f1f1f] text-white font-inter relative overflow-hidden">
        {/* Background decorations - Dark EcoSense style */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-[#F4D35E]/15 to-[#F4D35E]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-gradient-to-tr from-[#F4D35E]/12 to-[#F4D35E]/4 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-br from-[#F4D35E]/10 to-[#F4D35E]/3 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-40 left-20 w-24 h-24 bg-gradient-to-br from-[#F4D35E]/8 to-[#F4D35E]/2 rounded-full blur-2xl"></div>
        <div className="absolute bottom-40 right-20 w-20 h-20 bg-gradient-to-br from-[#F4D35E]/6 to-[#F4D35E]/1 rounded-full blur-xl"></div>
        
        <Topbar />
        <main className="max-w-6xl mx-auto p-6 relative z-10">
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
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1f1f1f] text-white font-inter relative overflow-hidden">
        {/* Background decorations - Dark EcoSense style */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-[#F4D35E]/15 to-[#F4D35E]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-gradient-to-tr from-[#F4D35E]/12 to-[#F4D35E]/4 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-br from-[#F4D35E]/10 to-[#F4D35E]/3 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-40 left-20 w-24 h-24 bg-gradient-to-br from-[#F4D35E]/8 to-[#F4D35E]/2 rounded-full blur-2xl"></div>
        <div className="absolute bottom-40 right-20 w-20 h-20 bg-gradient-to-br from-[#F4D35E]/6 to-[#F4D35E]/1 rounded-full blur-xl"></div>
        
        <Topbar />
        <main className="max-w-6xl mx-auto p-6 relative z-10">
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
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1f1f1f] text-white font-inter relative overflow-hidden">
      {/* Background decorations - Dark EcoSense style */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-[#F4D35E]/15 to-[#F4D35E]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-gradient-to-tr from-[#F4D35E]/12 to-[#F4D35E]/4 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-br from-[#F4D35E]/10 to-[#F4D35E]/3 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-40 left-20 w-24 h-24 bg-gradient-to-br from-[#F4D35E]/8 to-[#F4D35E]/2 rounded-full blur-2xl"></div>
      <div className="absolute bottom-40 right-20 w-20 h-20 bg-gradient-to-br from-[#F4D35E]/6 to-[#F4D35E]/1 rounded-full blur-xl"></div>
      <Topbar />
      
      <main className="max-w-6xl mx-auto p-6 space-y-8 relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link 
            href="/dashboard"
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al Dashboard
          </Link>
        </div>

        {/* Metric Header - Dark EcoSense Style */}
        <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-[#F4D35E]/30 shadow-lg">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-3">
                {definition.name}
              </h1>
              <p className="text-white/80 text-lg">
                {definition.description}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-white/60 mb-1">
                Última actualización
              </div>
              <div className="text-sm font-medium text-white">
                {latestValue ? new Date(latestValue.ts).toLocaleDateString('es-AR') : 'N/A'}
              </div>
            </div>
          </div>

          {/* Metric Value Display - Dark EcoSense Style */}
          <div className="bg-[#F4D35E]/20 p-6 rounded-lg border border-[#F4D35E]/30">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">
                {latestValue ? formatValue(latestValue.value, getUnit(definition.unit)) : 'N/A'}
              </div>
              <div className="text-sm text-white/70">
                {definition.unit || 'unidad'}
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section - Dark EcoSense Style - PROMINENT */}
        <div className="w-full max-w-7xl mx-auto bg-[#0f0f0f] rounded-xl border border-[#F4D35E]/30 p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-4 h-4 bg-[#F4D35E] rounded-full shadow-lg"></div>
              <span className="text-white font-bold text-2xl">{definition.name}</span>
              <span className="text-[#F4D35E] font-bold text-2xl">
                {latestValue ? formatValue(latestValue.value, getUnit(definition.unit)) : 'N/A'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Calendar className="h-5 w-5" />
              Últimos 90 días
            </div>
          </div>
          
          <div className="relative" style={{height: '500px'}}>
            <TimeSeriesChart
              data={chartData}
              unit={definition.unit || ''}
              height={500}
              color="#F4D35E"
              name={definition.name}
            />
          </div>
        </div>

        {/* How it's calculated - Dark EcoSense Style - COMPACT */}
        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-[#F4D35E]/30 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#F4D35E] rounded-full flex items-center justify-center">
              <Info className="h-5 w-5 text-[#2B2B2B]" />
            </div>
            <h3 className="text-lg font-semibold text-white">
              Cómo se calcula
            </h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-white mb-2">Fórmula</h4>
              <div className="bg-[#F4D35E]/20 p-3 rounded-lg border border-[#F4D35E]/30 font-mono text-sm text-white">
                {definition.formula || 'Fórmula no disponible'}
              </div>
            </div>
            
            {definition.dependencies && definition.dependencies.length > 0 && (
              <div>
                <h4 className="font-medium text-white mb-2">Dependencias</h4>
                <div className="flex flex-wrap gap-2">
                  {definition.dependencies.map((dep, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 rounded-full text-xs font-medium border border-[#F4D35E]/30 text-white bg-[#F4D35E]/20"
                    >
                      {dep}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <h4 className="font-medium text-white mb-2">Interpretación</h4>
              <div className="bg-[#F4D35E]/20 p-3 rounded-lg border border-[#F4D35E]/30">
                <div className="text-sm text-white leading-relaxed space-y-2">
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
        </div>

        {/* Recent Data Table - Dark EcoSense Style */}
        {chartData.length > 0 && (
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-[#F4D35E]/30 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Datos Recientes
              </h3>
              <button className="flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-[#F4D35E]/20 rounded-lg transition-colors border border-[#F4D35E]/30">
                <Download className="h-4 w-4" />
                Exportar CSV
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#F4D35E]/30">
                    <th className="text-left py-3 font-medium text-white">Fecha</th>
                    <th className="text-right py-3 font-medium text-white">Valor</th>
                    <th className="text-right py-3 font-medium text-white">Cambio</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.slice(-10).reverse().map((point: any, index: number) => {
                    // For the most recent point, show no change
                    if (index === 0) {
                      return (
                        <tr key={point.ts} className="border-b border-[#F4D35E]/20 last:border-b-0 hover:bg-[#F4D35E]/10">
                          <td className="py-3 text-white/70">
                            {new Date(point.ts).toLocaleDateString('es-AR')}
                          </td>
                          <td className="py-3 text-right font-medium text-white">
                            {formatValue(point.value, getUnit(definition.unit))}
                          </td>
                          <td className="py-3 text-right">
                            <span className="text-sm text-white/60">-</span>
                          </td>
                        </tr>
                      );
                    }
                    
                    // For other points, compare with the previous point in the reversed array
                    const prevPoint = chartData.slice(-10).reverse()[index - 1];
                    const change = point.value - prevPoint.value;
                    const changePercent = prevPoint.value !== 0 ? (change / Math.abs(prevPoint.value)) * 100 : 0;
                    
                    return (
                      <tr key={point.ts} className="border-b border-[#F4D35E]/20 last:border-b-0 hover:bg-[#F4D35E]/10">
                        <td className="py-3 text-white/70">
                          {new Date(point.ts).toLocaleDateString('es-AR')}
                        </td>
                        <td className="py-3 text-right font-medium text-white">
                          {formatValue(point.value, getUnit(definition.unit))}
                        </td>
                        <td className="py-3 text-right">
                          <span className={`text-sm px-2 py-1 rounded-full ${
                            change > 0 ? 'text-green-300 bg-green-500/20 border border-green-400/30' : 
                            change < 0 ? 'text-red-300 bg-red-500/20 border border-red-400/30' : 
                            'text-white/60'
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