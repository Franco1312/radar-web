import { memo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatDate } from "@/lib/date";
import { formatValue } from "@/lib/format/number";
import { cn } from "@/lib/utils";

interface ComparisonChartProps {
  data: Array<{
    ts: string;
    series1: number;
    series2: number;
    [key: string]: any;
  }>;
  series1Name: string;
  series2Name: string;
  series1Unit?: string;
  series2Unit?: string;
  height?: number;
  className?: string;
  series1Color?: string;
  series2Color?: string;
}

export const ComparisonChart = memo(function ComparisonChart({
  data,
  series1Name,
  series2Name,
  series1Unit = "",
  series2Unit = "",
  height = 300,
  className,
  series1Color = "var(--info)",
  series2Color = "var(--positive)"
}: ComparisonChartProps) {
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

  const formatTooltipValue = (value: number, unit: string) => {
    return formatValue(value, unit);
  };

  const formatXAxisLabel = (tickItem: string) => {
    const date = new Date(tickItem);
    return date.toLocaleDateString('es-AR', { 
      day: '2-digit', 
      month: 'short' 
    });
  };

  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
            tickFormatter={(value) => formatTooltipValue(value, series1Unit)}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-3 border border-border-200 rounded-lg shadow-lg">
                    <div className="text-sm text-text-600 mb-2">
                      {formatDate(label)}
                    </div>
                    {payload.map((entry, index) => (
                      <div key={index} className="text-sm font-medium" style={{ color: entry.color }}>
                        {entry.name}: {formatTooltipValue(entry.value as number, index === 0 ? series1Unit : series2Unit)}
                      </div>
                    ))}
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="series1"
            stroke={series1Color}
            strokeWidth={2}
            name={series1Name}
            dot={false}
            activeDot={{ r: 4, fill: series1Color }}
          />
          <Line
            type="monotone"
            dataKey="series2"
            stroke={series2Color}
            strokeWidth={2}
            name={series2Name}
            dot={false}
            activeDot={{ r: 4, fill: series2Color }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});
