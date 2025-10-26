import { CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Health } from "@/types/health";

interface HealthBadgeProps {
  health: Health;
  className?: string;
}

export function HealthBadge({ health, className }: HealthBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "healthy":
        return {
          icon: CheckCircle,
          text: "Sistema Operativo",
          className: "bg-green-100 text-green-800 border-green-200",
          iconClassName: "text-green-600",
        };
      case "degraded":
        return {
          icon: AlertCircle,
          text: "Sistema Degradado",
          className: "bg-amber-100 text-amber-800 border-amber-200",
          iconClassName: "text-amber-600",
        };
      case "down":
      default:
        return {
          icon: XCircle,
          text: "Sistema Inactivo",
          className: "bg-red-100 text-red-800 border-red-200",
          iconClassName: "text-red-600",
        };
    }
  };

  const config = getStatusConfig(health.status);
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium",
        config.className,
        className
      )}
    >
      <Icon className={cn("h-4 w-4", config.iconClassName)} />
      <span>{config.text}</span>
    </div>
  );
}
