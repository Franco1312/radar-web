import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import type { TrendDirection } from "@/types/metrics";
import { cn } from "@/lib/utils";

interface TrendIconProps {
  trend: TrendDirection;
  ariaLabel?: string;
  className?: string;
}

export function TrendIcon({ trend, ariaLabel, className }: TrendIconProps) {
  const iconProps = {
    className: cn("h-4 w-4", className),
    "aria-label": ariaLabel,
  };

  switch (trend) {
    case "up":
      return (
        <ArrowUpRight 
          {...iconProps}
          className={cn(iconProps.className, "text-green-600")}
        />
      );
    case "down":
      return (
        <ArrowDownRight 
          {...iconProps}
          className={cn(iconProps.className, "text-red-600")}
        />
      );
    case "flat":
    default:
      return (
        <Minus 
          {...iconProps}
          className={cn(iconProps.className, "text-zinc-500")}
        />
      );
  }
}
