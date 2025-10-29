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
  updatedAt,
  loading = false,
  error,
  onClick,
  meta,
  def,
  latest,
  reference,
  interpretation,
  className
}: MetricCardProps) {
  // Calculate trend if not provided
  const calculatedTrend = trend || (latest && reference ? getMetricTrend(latest, reference) : 'flat');
  
  // Get interpretation
  const metricInterpretation: Interpretation = interpretation || (value !== undefined ? 
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
    <div 
      className={cn(
        "rounded-xl border-2 border-[#F4D35E]/30 bg-white/10 backdrop-blur-sm p-5 text-center hover:border-[#F4D35E]/50 hover:bg-white/20 hover:shadow-lg transition-all duration-300 cursor-pointer group",
        className
      )}
      onClick={onClick}
      role="button"
      tabIndex={onClick ? 0 : undefined}
      aria-label={`Ver detalles de ${title}`}
    >
      {/* Icon - EcoSense style */}
      <div className="w-12 h-12 bg-[#F4D35E] rounded-full mb-4 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
        {metricInterpretation.tone === 'positive' ? (
          <svg className="w-6 h-6 text-[#2B2B2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        ) : metricInterpretation.tone === 'negative' ? (
          <svg className="w-6 h-6 text-[#2B2B2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
          </svg>
        ) : metricInterpretation.tone === 'warning' ? (
          <svg className="w-6 h-6 text-[#2B2B2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-[#2B2B2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        )}
      </div>

      {/* Title */}
      <div className="text-sm text-white/80 mb-2 font-medium">{title}</div>
      
      {/* Value */}
      <div className="text-2xl font-bold text-white mb-2">
        {value !== undefined ? formatValue(value, unit) : "N/A"}
      </div>

      {/* Interpretation summary - compact */}
      {metricInterpretation.what_to_watch && (
        <div className="text-xs text-white/70 mb-3 leading-relaxed">
          {metricInterpretation.what_to_watch}
        </div>
      )}
      
      {/* Status badge - Dark EcoSense style */}
      <div className={`text-xs px-2 py-1 rounded-full font-medium inline-block ${
        metricInterpretation.tone === 'positive' ? 'border border-green-400/30 text-green-300 bg-green-500/20' :
        metricInterpretation.tone === 'negative' ? 'border border-red-400/30 text-red-300 bg-red-500/20' :
        metricInterpretation.tone === 'warning' ? 'border border-amber-400/30 text-amber-300 bg-amber-500/20' :
        'border border-blue-400/30 text-blue-300 bg-blue-500/20'
      }`}>
        {metricInterpretation.tone === 'positive' ? 'Mejora' : 
         metricInterpretation.tone === 'negative' ? 'Empeora' : 
         metricInterpretation.tone === 'warning' ? 'Atención' : 'Estable'}
      </div>
    </div>
  );
});