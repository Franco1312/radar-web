"use client";

import { useMetricDefinition, useHistorical } from "@/features/metrics/hooks";
import { TimeSeriesChart } from "@/components/charts/TimeSeriesChart";
import { ErrorState } from "@/components/ui/ErrorState";
import { ChartSkeleton } from "@/components/ui/LoadingSkeleton";
import { interpret } from "@/features/metrics/interpretations";
import { formatValue } from "@/lib/format";
import { formatDate } from "@/lib/date";
import { getDateRange } from "@/lib/date";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info, Calendar, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";

export default function MetricDetailPage() {
  const params = useParams();
  const metricId = params.id as string;

  const { data: definition, isLoading: defLoading, error: defError } = useMetricDefinition(metricId);
  const { data: historicalData, isLoading: histLoading, error: histError } = useHistorical(
    metricId,
    getDateRange(90) // Last 90 days
  );

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

  // Generate interpretation
  const interpretation = useMemo(() => {
    if (!latestValue || !definition) return null;
    
    return interpret(definition.id, {
      value: latestValue.value,
      metadata: historicalData?.points?.find(p => p.ts === latestValue.ts)?.metadata,
      def: definition,
    });
  }, [latestValue, definition, historicalData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
          <ChartSkeleton height={400} />
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <ErrorState
            title="Error al cargar la métrica"
            message="No se pudo cargar la información de la métrica seleccionada."
            onRetry={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  if (!definition) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <ErrorState
            title="Métrica no encontrada"
            message="La métrica solicitada no existe o no está disponible."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Volver al Dashboard
              </Button>
            </Link>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">{definition.name}</h1>
            {definition.description && (
              <p className="text-gray-600">{definition.description}</p>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg border">
              <TimeSeriesChart
                data={chartData}
                unit={definition.unit}
                title={`${definition.name} - Últimos 90 días`}
                description={definition.description}
                height={400}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Value */}
            {latestValue && (
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Valor Actual
                </h3>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-gray-900">
                    {formatValue(latestValue.value, definition.unit)}
                  </div>
                  {definition.unit && (
                    <div className="text-sm text-gray-500">{definition.unit}</div>
                  )}
                  <div className="text-sm text-gray-500">
                    {formatDate(latestValue.ts)}
                  </div>
                </div>
              </div>
            )}

            {/* Interpretation */}
            {interpretation && (
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Interpretación
                </h3>
                <div className={`p-3 rounded-lg ${
                  interpretation.tone === "positivo" ? "bg-green-50 text-green-800" :
                  interpretation.tone === "negativo" ? "bg-red-50 text-red-800" :
                  "bg-gray-50 text-gray-800"
                }`}>
                  <p className="text-sm font-medium">{interpretation.text}</p>
                </div>
              </div>
            )}

            {/* Metric Details */}
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Detalles
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Categoría:</span>
                  <span className="ml-2 text-gray-600">{definition.category}</span>
                </div>
                {definition.formula && (
                  <div>
                    <span className="font-medium text-gray-700">Fórmula:</span>
                    <div className="mt-1 p-2 bg-gray-50 rounded text-xs font-mono">
                      {definition.formula}
                    </div>
                  </div>
                )}
                {definition.dependencies && definition.dependencies.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-700">Dependencias:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {definition.dependencies.map((dep) => (
                        <span
                          key={dep}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                        >
                          {dep}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {definition.tags && definition.tags.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-700">Etiquetas:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {definition.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Data Points Info */}
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-semibold text-gray-900 mb-4">Información de Datos</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div>
                  Puntos de datos: {chartData.length}
                </div>
                <div>
                  Período: Últimos 90 días
                </div>
                {historicalData?.count && (
                  <div>
                    Total disponible: {historicalData.count}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
