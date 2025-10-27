import { cn } from "@/lib/utils";
import { RiskLevel } from "@/lib/insights/types";

interface RiskChipProps {
  risk: RiskLevel;
  className?: string;
}

const riskConfig = {
  positive: {
    label: "Bajo",
    className: "bg-green-100 text-green-700 border-green-200"
  },
  warning: {
    label: "Medio", 
    className: "bg-amber-100 text-amber-700 border-amber-200"
  },
  negative: {
    label: "Alto",
    className: "bg-red-100 text-red-700 border-red-200"
  },
  neutral: {
    label: "Neutral",
    className: "bg-gray-100 text-gray-700 border-gray-200"
  }
};

export function RiskChip({ risk, className }: RiskChipProps) {
  const config = riskConfig[risk];
  
  return (
    <span className={cn(
      "px-2 py-1 rounded-full text-xs font-medium border",
      config.className,
      className
    )}>
      Riesgo: {config.label}
    </span>
  );
}
