import { memo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { formatDate } from "@/lib/date";
import { formatValue } from "@/lib/format/number";
import { cn } from "@/lib/utils";

interface TimeSeriesChartProps {
  data: Array<{
    ts: string;
    value: number;
    [key: string]: any;
  }>;
  unit?: string;
  height?: number;
  className?: string;
  showArea?: boolean;
  color?: string;
  name?: string;
}

export const TimeSeriesChart = memo(function TimeSeriesChart({
  data,
  unit = "",
  height = 300,
  className,
  showArea = true,
  color = "var(--info)",
  name = "Valor"
}: TimeSeriesChartProps) {
  if (!data || data.length === 0) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center text-muted",
          className
        )}
        style={{ height }}
      >
        <div className="text-center">
          <div className="text-sm">Sin datos disponibles</div>
        </div>
      </div>
    );
  }

  const formatTooltipValue = (value: number) => {
    return formatValue(value, unit);
  };

  const formatXAxisLabel = (tickItem: string) => {
    const date = new Date(tickItem);
    return date.toLocaleDateString('es-AR', { 
      day: '2-digit', 
      month: 'short' 
    });
  };

  const ChartComponent = showArea ? AreaChart : LineChart;

  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ChartComponent data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="var(--border-300)"
            opacity={0.3}
          />
          <XAxis
            dataKey="ts"
            tickFormatter={formatXAxisLabel}
            stroke="var(--text-500)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            stroke="var(--text-500)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => formatTooltipValue(value)}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const data = payload[0];
                return (
                  <div className="bg-white p-3 border border-border-200 rounded-lg shadow-lg">
                    <div className="text-sm text-text-600 mb-1">
                      {label ? new Date(label).toLocaleDateString('es-AR') : ''}
                    </div>
                    <div className="text-sm font-medium text-text-900">
                      {name}: {formatTooltipValue(data.value as number)}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          {showArea ? (
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              fill={color}
              fillOpacity={0.12}
              strokeWidth={2}
            />
          ) : (
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: color }}
            />
          )}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
});