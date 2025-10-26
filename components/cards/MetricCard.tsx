import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendIcon } from "@/components/ui/TrendIcon";
import { formatValue } from "@/lib/format";
import { interpret } from "@/features/metrics/interpretations";
import { getMetricTrend } from "@/features/metrics/selectors";
import type { MetricDefinition, LatestItem } from "@/types/metrics";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  def: MetricDefinition;
  latest?: LatestItem;
  reference?: LatestItem;
  onClick?: () => void;
  className?: string;
}

export function MetricCard({ 
  def, 
  latest, 
  reference, 
  onClick, 
  className 
}: MetricCardProps) {
  const trend = getMetricTrend(latest, reference);
  const interpretation = interpret(def.id, {
    value: latest?.value || 0,
    metadata: latest?.metadata,
    def,
  });

  const getToneColor = (tone: string) => {
    switch (tone) {
      case "positivo":
        return "text-green-600";
      case "negativo":
        return "text-red-600";
      default:
        return "text-zinc-600";
    }
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-700 line-clamp-2">
            {def.name}
          </CardTitle>
          <TrendIcon 
            trend={trend} 
            ariaLabel={`Tendencia: ${trend}`}
          />
        </div>
        {def.category && (
          <Badge variant="secondary" className="w-fit text-xs">
            {def.category}
          </Badge>
        )}
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {formatValue(
                typeof latest?.value === "number" ? latest.value : 
                typeof latest?.value === "string" ? parseFloat(latest.value) : null,
                def.unit
              )}
            </span>
            {def.unit && (
              <span className="text-sm text-gray-500">
                {def.unit}
              </span>
            )}
          </div>
          
          <p className={cn(
            "text-sm leading-relaxed",
            getToneColor(interpretation.tone)
          )}>
            {interpretation.text}
          </p>
          
          {latest && (
            <div className="text-xs text-gray-500">
              Última actualización: {new Date(latest.ts).toLocaleString("es-AR")}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
