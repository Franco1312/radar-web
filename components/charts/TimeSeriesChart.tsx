import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { formatValue } from "@/lib/format";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";

interface TimeSeriesChartProps {
  data: Array<{ ts: string; value: number }>;
  unit?: string;
  height?: number;
  className?: string;
  title?: string;
  description?: string;
}

export function TimeSeriesChart({
  data,
  unit,
  height = 300,
  className,
  title,
  description,
}: TimeSeriesChartProps) {
  // Transform data for Recharts
  const chartData = data.map((point) => ({
    ...point,
    formattedDate: formatDate(point.ts),
    formattedValue: formatValue(point.value, unit),
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{data.formattedDate}</p>
          <p className="text-sm text-gray-600">
            Valor: <span className="font-medium">{data.formattedValue}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <div className={cn("flex items-center justify-center p-8 border rounded-lg", className)}>
        <div className="text-center">
          <p className="text-gray-500 mb-2">Sin datos disponibles</p>
          <p className="text-sm text-gray-400">
            No hay datos históricos para mostrar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </div>
      )}
      
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="formattedDate"
              stroke="#666"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#666"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatValue(value, unit)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#colorValue)"
              dot={false}
              activeDot={{ r: 4, fill: "#3b82f6" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
