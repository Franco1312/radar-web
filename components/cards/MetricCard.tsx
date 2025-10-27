import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMetricTrend } from "@/features/metrics/selectors";
import { getHumanCopy, HumanCopy } from "@/lib/insights/humanCopy";
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
  humanCopy?: HumanCopy;
  contextData?: { freshnessH?: number; coverage30d?: number; ma30?: number; p30?: number; p70?: number };
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
  
  // Get human copy interpretation
  const humanInterpretation = humanCopy || (value !== undefined ? 
    getHumanCopy(id, value, meta, contextData) : 
    {
      headline: "Sin datos disponibles",
      summary: "No hay información suficiente para mostrar esta métrica.",
      why: "Los datos son necesarios para un análisis preciso.",
      risk: 'neutral' as const,
      confidence: 'baja' as const,
      icon: 'na' as const,
      color: 'gray' as const
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

  // Get trend direction for visual styling based on human copy
  const getTrendStyle = (icon: 'up' | 'down' | 'flat' | 'na') => {
    switch (icon) {
      case 'up':
        return {
          bg: "bg-green-50/50",
          border: "border-green-100",
          icon: "↗",
          color: "text-green-600"
        };
      case 'down':
        return {
          bg: "bg-red-50/50", 
          border: "border-red-100",
          icon: "↘",
          color: "text-red-600"
        };
      case 'na':
        return {
          bg: "bg-gray-50/50",
          border: "border-gray-100", 
          icon: "?",
          color: "text-gray-500"
        };
      default:
        return {
          bg: "bg-gray-50/50",
          border: "border-gray-100", 
          icon: "→",
          color: "text-gray-500"
        };
    }
  };

  const trendStyle = getTrendStyle(humanInterpretation.icon);

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
          <div className="flex items-center gap-1">
            <span className="text-lg font-medium text-gray-400">{trendStyle.icon}</span>
            <TrendIcon 
              direction={calculatedTrend} 
              size="sm"
              className={trendStyle.color}
            />
          </div>
        </div>
        <CardTitle className="text-lg font-semibold text-gray-900 mt-2">
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0 relative z-10">
        <div className="space-y-4">
          {/* Value display */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-gray-900">
              {value !== undefined ? formatValue(value, unit) : "N/A"}
            </span>
            {unit !== 'other' && (
              <span className="text-base font-medium text-gray-500">
                {unit === 'percent' ? '%' : unit === 'ARS' ? 'ARS' : unit === 'USD' ? 'USD' : ''}
              </span>
            )}
          </div>
          
          {/* Headline */}
          <div className="text-lg font-semibold text-gray-900">
            {humanInterpretation.headline}
          </div>
          
          {/* Summary */}
          <div className="text-sm text-gray-700 leading-relaxed">
            {humanInterpretation.summary}
          </div>
          
          {/* Why it matters */}
          <div className="text-xs text-gray-600 italic">
            <strong>Por qué importa:</strong> {humanInterpretation.why}
          </div>
          
          {/* Watch section */}
          {humanInterpretation.watch && (
            <WatchSection watch={humanInterpretation.watch} />
          )}
          
          {/* Risk and confidence chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <RiskChip risk={humanInterpretation.risk} />
            <ConfidenceChip confidence={humanInterpretation.confidence} />
          </div>
          
          {/* Data note */}
          {humanInterpretation.dataNote && (
            <DataNote note={humanInterpretation.dataNote} />
          )}
          
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