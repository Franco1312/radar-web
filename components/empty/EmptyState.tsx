import { AlertCircle, RefreshCw, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action,
  className 
}: EmptyStateProps) {
  const defaultIcon = <BarChart3 className="h-12 w-12 text-muted" />;

  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="mb-4">
        {icon || defaultIcon}
      </div>
      
      <h3 className="text-lg font-semibold text-text-900 mb-2">
        {title}
      </h3>
      
      <p className="text-text-600 mb-6 max-w-md">
        {description}
      </p>
      
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center gap-2 px-4 py-2 bg-info text-white rounded-lg hover:bg-info-dark transition-colors focus-visible"
        >
          <RefreshCw className="h-4 w-4" />
          {action.label}
        </button>
      )}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ 
  title = "Error al cargar datos",
  message = "No se pudieron cargar los datos solicitados. Por favor, inténtalo de nuevo.",
  onRetry,
  className 
}: ErrorStateProps) {
  return (
    <EmptyState
      icon={<AlertCircle className="h-12 w-12 text-negative" />}
      title={title}
      description={message}
      action={onRetry ? {
        label: "Reintentar",
        onClick: onRetry
      } : undefined}
      className={className}
    />
  );
}
