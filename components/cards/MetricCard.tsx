import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMetricTrend } from "@/features/metrics/selectors";
import { getInterpretation, Interpretation } from "@/lib/analytics/interpretation";
import { formatValue } from "@/lib/format/number";
import { TrendIcon } from "@/components/ui/TrendIcon";
import { InfoTooltip } from "@/components/ui/InfoTooltip";
import { RiskChip } from "@/components/ui/RiskChip";
import { ConfidenceChip } from "@/components/ui/ConfidenceChip";
import { DataNote } from "@/components/ui/DataNote";
import { WatchSection } from "@/components/ui/WatchSection";
import { LatestItem, MetricDefinition } from "@/types/metrics";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/date";
import { memo } from "react";

interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  category: 'deltas' | 'ratios' | 'fx' | 'monetary' | 'data_health';
  title: string;
  value?: number;
  rawValue?: number;
  unit?: 'percent' | 'ARS' | 'USD' | 'ratio' | 'volatility' | 'other';
  trend?: 'up' | 'down' | 'flat';
  interpretation?: string;
  updatedAt?: string;
  loading?: boolean;
  error?: string;
  onClick?: () => void;
  meta?: Record<string, unknown>;
  def?: MetricDefinition;
  latest?: LatestItem;
  reference?: LatestItem;
  interpretation?: Interpretation;
}

const categoryLabels = {
  deltas: "Deltas",
  ratios: "Ratios", 
  fx: "FX",
  monetary: "Monetario",
  data_health: "Calidad"
};

const categoryColors = {
  deltas: "bg-blue-50 text-blue-700 border-blue-200",
  ratios: "bg-emerald-50 text-emerald-700 border-emerald-200",
  fx: "bg-amber-50 text-amber-700 border-amber-200", 
  monetary: "bg-purple-50 text-purple-700 border-purple-200",
  data_health: "bg-rose-50 text-rose-700 border-rose-200"
};

const categoryIcons = {
  deltas: "📈",
  ratios: "⚖️",
  fx: "💱", 
  monetary: "💰",
  data_health: "🔍"
};

export const MetricCard = memo(function MetricCard({
  id,
  category,
  title,
  value,
  rawValue,
  unit = 'other',
  trend,
  interpretation,
  updatedAt,
  loading = false,
  error,
  onClick,
  meta,
  def,
  latest,
  reference,
  humanCopy,
  contextData,
  className
}: MetricCardProps) {
  // Calculate trend if not provided
  const calculatedTrend = trend || (latest && reference ? getMetricTrend(latest, reference) : 'flat');
  
  // Get interpretation
  const metricInterpretation = interpretation || (value !== undefined ? 
    getInterpretation(id, value, meta) : 
    {
      title: "Sin datos disponibles",
      explanation: "No hay información suficiente para mostrar esta métrica.",
      why_it_matters: "Los datos son necesarios para un análisis preciso.",
      what_to_watch: "Esperar a que lleguen nuevos datos para poder evaluar la situación.",
      tone: "neutral" as const
    }
  );

  // No need for these classes anymore - using components

  if (loading) {
    return (
      <Card className={cn("surface-card shadow-lg", className)}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="loading-skeleton h-6 w-28 rounded-lg"></div>
            <div className="loading-skeleton h-6 w-6 rounded-lg"></div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            <div className="loading-skeleton h-12 w-32 rounded-lg"></div>
            <div className="loading-skeleton h-5 w-full rounded-lg"></div>
            <div className="loading-skeleton h-4 w-40 rounded-lg"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn("surface-card border-negative", className)}>
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-sm text-negative mb-2">{error}</div>
            {onClick && (
              <button 
                onClick={onClick}
                className="text-xs text-info hover:underline"
              >
                Reintentar
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get trend direction for visual styling based on interpretation tone
  const getTrendStyle = (tone: 'positive' | 'neutral' | 'warning' | 'negative') => {
    switch (tone) {
      case 'positive':
        return {
          bg: "bg-green-50/50",
          border: "border-green-100",
          icon: "📈",
          color: "text-green-600"
        };
      case 'negative':
        return {
          bg: "bg-red-50/50", 
          border: "border-red-100",
          icon: "📉",
          color: "text-red-600"
        };
      case 'warning':
        return {
          bg: "bg-amber-50/50",
          border: "border-amber-100", 
          icon: "⚠️",
          color: "text-amber-600"
        };
      default: // neutral
        return {
          bg: "bg-blue-50/50",
          border: "border-blue-100", 
          icon: "➡️",
          color: "text-blue-600"
        };
    }
  };

  const trendStyle = getTrendStyle(metricInterpretation.tone);

  return (
    <Card 
      className={cn(
        "relative overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group bg-white/80 backdrop-blur-sm",
        trendStyle.border,
        onClick && "hover:scale-[1.02]",
        className
      )}
      onClick={onClick}
      role="button"
      tabIndex={onClick ? 0 : undefined}
      aria-label={`Ver detalles de ${title}`}
    >
      {/* Subtle background decoration with color */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100/20 to-indigo-100/20 rounded-full -translate-y-10 translate-x-10"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-emerald-100/20 to-blue-100/20 rounded-full translate-y-8 -translate-x-8"></div>
      
      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-xl text-gray-600">
              {categoryIcons[category]}
            </div>
            <span className={cn("px-2.5 py-1 rounded-md text-xs font-medium border", categoryColors[category])}>
              {categoryLabels[category]}
            </span>
            {def?.description && (
              <InfoTooltip 
                title={title}
                description={def.description}
              />
            )}
          </div>
        </div>
        <CardTitle className="text-lg font-semibold text-gray-900 mt-2">
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0 relative z-10">
        <div className="space-y-4">
          {/* Value display with trend indicator */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">
                {value !== undefined ? formatValue(value, unit) : "N/A"}
              </span>
              {unit !== 'other' && unit !== 'volatility' && (
                <span className="text-base font-medium text-gray-500">
                  {unit === 'percent' ? '%' : unit === 'ARS' ? 'ARS' : unit === 'USD' ? 'USD' : ''}
                </span>
              )}
            </div>
            {/* Trend indicator */}
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-bold ${trendStyle.color}`}>
                {trendStyle.icon}
              </span>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${trendStyle.bg} ${trendStyle.color}`}>
                {metricInterpretation.tone === 'positive' ? 'Mejora' : metricInterpretation.tone === 'negative' ? 'Empeora' : metricInterpretation.tone === 'warning' ? 'Atención' : 'Estable'}
              </span>
            </div>
          </div>
          
          {/* Title */}
          <div className="text-lg font-semibold text-gray-900">
            {metricInterpretation.title}
          </div>
          
          {/* Explanation */}
          <div className="text-sm text-gray-700 leading-relaxed">
            {metricInterpretation.explanation}
          </div>
          
          {/* Why it matters with tooltip */}
          <div className="text-xs text-gray-600 italic flex items-start gap-2">
            <span><strong>Por qué importa:</strong> {metricInterpretation.why_it_matters}</span>
          </div>
          
          {/* What to watch */}
          <div className="text-xs text-gray-600 italic">
            <strong>Qué mirar:</strong> {metricInterpretation.what_to_watch}
          </div>
          
          {/* Updated timestamp */}
          {updatedAt && (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Actualizado: {formatDate(updatedAt)}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});