import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface InfoTooltipProps {
  title: string;
  description: string;
  className?: string;
  children?: React.ReactNode;
}

export function InfoTooltip({ 
  title, 
  description, 
  className,
  children 
}: InfoTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className={cn("relative inline-block", className)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children || (
        <Info 
          className="h-4 w-4 text-muted cursor-help" 
          aria-label={`Información: ${title}`}
        />
      )}
      
      {isVisible && (
        <div
          className="absolute z-tooltip bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-white border border-border-200 rounded-lg shadow-lg"
          role="tooltip"
          aria-live="polite"
        >
          <div className="text-sm font-medium text-text-900 mb-1">
            {title}
          </div>
          <div className="text-xs text-text-600 leading-relaxed">
            {description}
          </div>
          
          {/* Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
        </div>
      )}
    </div>
  );
}
