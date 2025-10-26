import { memo } from "react";
import { TrendingUp, TrendingDown, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface WatchItem {
  id: string;
  title: string;
  description: string;
  type: 'positive' | 'negative' | 'warning' | 'info';
  metricId?: string;
  onClick?: () => void;
}

interface WhatToWatchNowProps {
  items: WatchItem[];
  className?: string;
}

const typeConfig = {
  positive: {
    icon: TrendingUp,
    color: "text-positive",
    bgColor: "bg-positive",
    borderColor: "border-positive"
  },
  negative: {
    icon: TrendingDown,
    color: "text-negative", 
    bgColor: "bg-negative",
    borderColor: "border-negative"
  },
  warning: {
    icon: AlertTriangle,
    color: "text-warning",
    bgColor: "bg-warning", 
    borderColor: "border-warning"
  },
  info: {
    icon: Info,
    color: "text-info",
    bgColor: "bg-info",
    borderColor: "border-info"
  }
};

export const WhatToWatchNow = memo(function WhatToWatchNow({
  items,
  className
}: WhatToWatchNowProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-lg font-semibold text-text-900">
        Qué mirar ahora
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item) => {
          const config = typeConfig[item.type];
          const Icon = config.icon;
          
          return (
            <button
              key={item.id}
              onClick={item.onClick}
              className={cn(
                "p-4 rounded-lg border-2 border-dashed text-left transition-all hover:border-solid hover:shadow-sm focus-visible",
                config.borderColor,
                "hover:bg-surface-secondary"
              )}
              aria-label={`Ver detalles de ${item.title}`}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  config.bgColor
                )}>
                  <Icon className={cn("h-4 w-4", config.color)} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-text-900 mb-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-text-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
});

// Helper function to generate watch items from metrics data
export function generateWatchItems(
  metrics: Array<{
    id: string;
    name: string;
    value: number;
    trend: 'up' | 'down' | 'flat';
    interpretation: string;
  }>
): WatchItem[] {
  const items: WatchItem[] = [];
  
  // Look for significant changes
  metrics.forEach((metric) => {
    if (metric.trend === 'up' && Math.abs(metric.value) > 2) {
      items.push({
        id: `${metric.id}-up`,
        title: `${metric.name} subió`,
        description: metric.interpretation,
        type: 'positive',
        metricId: metric.id
      });
    } else if (metric.trend === 'down' && Math.abs(metric.value) > 2) {
      items.push({
        id: `${metric.id}-down`,
        title: `${metric.name} bajó`,
        description: metric.interpretation,
        type: 'negative',
        metricId: metric.id
      });
    } else if (metric.trend === 'flat' && Math.abs(metric.value) < 0.5) {
      items.push({
        id: `${metric.id}-stable`,
        title: `${metric.name} estable`,
        description: metric.interpretation,
        type: 'info',
        metricId: metric.id
      });
    }
  });
  
  // Limit to 6 items
  return items.slice(0, 6);
}
