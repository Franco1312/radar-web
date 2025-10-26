import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import type { TrendDirection } from "@/types/metrics";
import { cn } from "@/lib/utils";

interface TrendIconProps {
  direction: TrendDirection;
  ariaLabel?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function TrendIcon({ 
  direction, 
  ariaLabel, 
  className,
  size = 'md'
}: TrendIconProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4", 
    lg: "h-5 w-5"
  };

  const iconProps = {
    className: cn(sizeClasses[size], className),
    "aria-label": ariaLabel || `Tendencia ${direction === 'up' ? 'alcista' : direction === 'down' ? 'bajista' : 'estable'}`,
  };

  switch (direction) {
    case "up":
      return (
        <ArrowUpRight 
          {...iconProps}
          className={cn(iconProps.className, "text-positive")}
        />
      );
    case "down":
      return (
        <ArrowDownRight 
          {...iconProps}
          className={cn(iconProps.className, "text-negative")}
        />
      );
    case "flat":
    default:
      return (
        <Minus 
          {...iconProps}
          className={cn(iconProps.className, "text-muted")}
        />
      );
  }
}
