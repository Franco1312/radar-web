import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMetricTrend } from "@/features/metrics/selectors";
import { getInterpretation } from "@/lib/analytics/interpretation";
import { formatValue } from "@/lib/format/number";
import { TrendIcon } from "@/components/ui/TrendIcon";
import { InfoTooltip } from "@/components/ui/InfoTooltip";
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
  unit?: 'percent' | 'ARS' | 'USD' | 'ratio' | 'other';
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
}

const categoryLabels = {
  deltas: "Deltas",
  ratios: "Ratios", 
  fx: "FX",
  monetary: "Monetario",
  data_health: "Calidad"
};

const categoryColors = {
  deltas: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white",
  ratios: "bg-gradient-to-r from-emerald-500 to-green-600 text-white",
  fx: "bg-gradient-to-r from-amber-500 to-orange-600 text-white", 
  monetary: "bg-gradient-to-r from-purple-500 to-pink-600 text-white",
  data_health: "bg-gradient-to-r from-red-500 to-rose-600 text-white"
};

const categoryIcons = {
  deltas: "📊",
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
  className
}: MetricCardProps) {
  // Calculate trend if not provided
  const calculatedTrend = trend || (latest && reference ? getMetricTrend(latest, reference) : 'flat');
  
  // Get interpretation if not provided
  const calculatedInterpretation = interpretation || (value !== undefined ? 
    getInterpretation(id, value, meta).text : 
    "Sin datos disponibles"
  );

  // Get tone for styling
  const interpretationTone = value !== undefined ? 
    getInterpretation(id, value, meta).tone : 
    'neutral';

  const toneClasses = {
    positive: "text-positive",
    negative: "text-negative", 
    warning: "text-warning",
    neutral: "text-muted"
  };

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

  // Get trend direction for visual styling
  const getTrendStyle = (trend: 'up' | 'down' | 'flat') => {
    switch (trend) {
      case 'up':
        return {
          bg: "bg-gradient-to-br from-green-50 to-emerald-100",
          border: "border-green-200",
          icon: "↗️",
          color: "text-green-700"
        };
      case 'down':
        return {
          bg: "bg-gradient-to-br from-red-50 to-rose-100", 
          border: "border-red-200",
          icon: "↘️",
          color: "text-red-700"
        };
      default:
        return {
          bg: "bg-gradient-to-br from-gray-50 to-slate-100",
          border: "border-gray-200", 
          icon: "➡️",
          color: "text-gray-700"
        };
    }
  };

  const trendStyle = getTrendStyle(calculatedTrend);

  return (
    <Card 
      className={cn(
        "relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group",
        trendStyle.bg,
        trendStyle.border,
        onClick && "hover:scale-105",
        className
      )}
      onClick={onClick}
      role="button"
      tabIndex={onClick ? 0 : undefined}
      aria-label={`Ver detalles de ${title}`}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
      
      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">
              {categoryIcons[category]}
            </div>
            <span className={cn("px-3 py-1 rounded-full text-xs font-semibold shadow-sm", categoryColors[category])}>
              {categoryLabels[category]}
            </span>
            {def?.description && (
              <InfoTooltip 
                title={title}
                description={def.description}
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{trendStyle.icon}</span>
            <TrendIcon 
              direction={calculatedTrend} 
              size="lg"
              className={trendStyle.color}
            />
          </div>
        </div>
        <CardTitle className="text-lg font-bold text-gray-900 mt-2">
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0 relative z-10">
        <div className="space-y-4">
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-black text-gray-900">
              {value !== undefined ? formatValue(value, unit) : "N/A"}
            </span>
            {unit !== 'other' && (
              <span className="text-lg font-semibold text-gray-600">
                {unit === 'percent' ? '%' : unit === 'ARS' ? 'ARS' : unit === 'USD' ? 'USD' : ''}
              </span>
            )}
          </div>
          
          <div className={cn(
            "text-base leading-relaxed font-medium p-3 rounded-lg bg-white/60 backdrop-blur-sm",
            toneClasses[interpretationTone]
          )}>
            {calculatedInterpretation}
          </div>
          
          {updatedAt && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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