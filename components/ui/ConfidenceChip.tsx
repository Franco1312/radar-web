import { cn } from "@/lib/utils";
import { ConfidenceLevel } from "@/lib/insights/types";

interface ConfidenceChipProps {
  confidence: ConfidenceLevel;
  className?: string;
}

const confidenceConfig = {
  alta: {
    className: "text-green-600"
  },
  media: {
    className: "text-amber-600"
  },
  baja: {
    className: "text-red-600"
  }
};

export function ConfidenceChip({ confidence, className }: ConfidenceChipProps) {
  const config = confidenceConfig[confidence];
  
  return (
    <span className={cn(
      "px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700",
      config.className,
      className
    )}>
      Confianza: {confidence}
    </span>
  );
}
