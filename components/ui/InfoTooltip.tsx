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
        <>
          {/* Backdrop to ensure tooltip is on top */}
          <div 
            className="fixed inset-0 z-[9998]"
            onClick={() => setIsVisible(false)}
          />
          
          {/* Tooltip */}
          <div
            className="absolute z-[9999] bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-80 max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-2xl"
            role="tooltip"
            aria-live="polite"
            style={{
              maxWidth: 'min(320px, calc(100vw - 2rem))',
              wordWrap: 'break-word',
              whiteSpace: 'normal'
            }}
          >
            <div className="text-sm font-medium text-gray-900 mb-2">
              {title}
            </div>
            <div className="text-xs text-gray-600 leading-relaxed break-words">
              {description}
            </div>
            
            {/* Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
          </div>
        </>
      )}
    </div>
  );
}