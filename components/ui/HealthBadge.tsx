import { CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Health } from "@/types/health";

interface HealthBadgeProps {
  health: Health;
  className?: string;
  variant?: 'ok' | 'warn' | 'crit';
}

export function HealthBadge({ health, className, variant }: HealthBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "healthy":
        return {
          icon: CheckCircle,
          text: "Sistema Operativo",
          variant: "ok" as const,
        };
      case "degraded":
        return {
          icon: AlertCircle,
          text: "Sistema Degradado", 
          variant: "warn" as const,
        };
      case "down":
      default:
        return {
          icon: XCircle,
          text: "Sistema Inactivo",
          variant: "crit" as const,
        };
    }
  };

  const config = getStatusConfig(health.status);
  const Icon = config.icon;
  const badgeVariant = variant || config.variant;

  const variantClasses = {
    ok: "badge-positive",
    warn: "badge-warning", 
    crit: "badge-negative"
  };

  return (
    <div
      className={cn(
        "badge",
        variantClasses[badgeVariant],
        className
      )}
      role="status"
      aria-live="polite"
    >
      <Icon className="h-3 w-3 mr-1" />
      <span className="text-xs font-medium">{config.text}</span>
    </div>
  );
}
