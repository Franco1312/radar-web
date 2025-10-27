import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

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
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top - 10, // 10px above the trigger
        left: rect.left + rect.width / 2 // centered horizontally
      });
    }
  }, [isVisible]);

  const tooltipContent = isVisible && (
    <div
      className="fixed z-[9999] w-80 max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-2xl"
      role="tooltip"
      aria-live="polite"
      style={{
        top: position.top,
        left: position.left,
        transform: 'translate(-50%, -100%)',
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
      
      {/* Arrow pointing down */}
      <div 
        className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"
        style={{ marginTop: '-1px' }}
      ></div>
    </div>
  );

  return (
    <>
      <div 
        ref={triggerRef}
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
      </div>
      
      {/* Render tooltip in portal */}
      {typeof document !== 'undefined' && tooltipContent && 
        createPortal(tooltipContent, document.body)
      }
    </>
  );
}