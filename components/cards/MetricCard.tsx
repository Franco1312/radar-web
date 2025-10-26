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
  deltas: "badge-info",
  ratios: "badge-positive",
  fx: "badge-warning", 
  monetary: "badge-muted",
  data_health: "badge-negative"
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
      <Card className={cn("surface-card", className)}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="loading-skeleton h-4 w-24 rounded"></div>
            <div className="loading-skeleton h-4 w-4 rounded"></div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="loading-skeleton h-8 w-20 rounded"></div>
            <div className="loading-skeleton h-4 w-full rounded"></div>
            <div className="loading-skeleton h-3 w-32 rounded"></div>
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

  return (
    <Card 
      className={cn(
        "surface-card surface-card-hover cursor-pointer",
        onClick && "hover:bg-surface-secondary",
        className
      )}
      onClick={onClick}
      role="button"
      tabIndex={onClick ? 0 : undefined}
      aria-label={`Ver detalles de ${title}`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={cn("badge text-xs", categoryColors[category])}>
              {categoryLabels[category]}
            </span>
            {def?.description && (
              <InfoTooltip 
                title={title}
                description={def.description}
              />
            )}
          </div>
          <TrendIcon 
            direction={calculatedTrend} 
            size="sm"
          />
        </div>
        <CardTitle className="text-sm font-medium text-text-700">
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-text-900">
              {value !== undefined ? formatValue(value, unit) : "N/A"}
            </span>
            {unit !== 'other' && (
              <span className="text-sm text-muted">
                {unit === 'percent' ? '%' : unit === 'ARS' ? 'ARS' : unit === 'USD' ? 'USD' : ''}
              </span>
            )}
          </div>
          
          <div className={cn(
            "text-sm leading-relaxed",
            toneClasses[interpretationTone]
          )}>
            {calculatedInterpretation}
          </div>
          
          {updatedAt && (
            <div className="text-xs text-muted">
              Actualizado: {formatDate(updatedAt)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});