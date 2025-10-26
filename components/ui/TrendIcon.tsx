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
    sm: "h-4 w-4",
    md: "h-5 w-5", 
    lg: "h-6 w-6"
  };

  const iconProps = {
    className: cn(sizeClasses[size], className),
    "aria-label": ariaLabel || `Tendencia ${direction === 'up' ? 'alcista' : direction === 'down' ? 'bajista' : 'estable'}`,
  };

  switch (direction) {
    case "up":
      return (
        <div className="relative">
          <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
          <ArrowUpRight 
            {...iconProps}
            className={cn(iconProps.className, "text-green-600 relative z-10")}
          />
        </div>
      );
    case "down":
      return (
        <div className="relative">
          <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-75"></div>
          <ArrowDownRight 
            {...iconProps}
            className={cn(iconProps.className, "text-red-600 relative z-10")}
          />
        </div>
      );
    case "flat":
    default:
      return (
        <Minus 
          {...iconProps}
          className={cn(iconProps.className, "text-gray-500")}
        />
      );
  }
}
