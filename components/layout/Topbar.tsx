import { memo } from "react";
import { BarChart3, Clock, RefreshCw } from "lucide-react";
import { HealthBadge } from "@/components/ui/HealthBadge";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/date";
import type { Health } from "@/types/health";

interface TopbarProps {
  health?: Health;
  lastUpdated?: string;
  onRefresh?: () => void;
  className?: string;
}

export const Topbar = memo(function Topbar({
  health,
  lastUpdated,
  onRefresh,
  className
}: TopbarProps) {
  return (
    <header className={cn(
      "bg-white/80 backdrop-blur-sm border-b border-blue-200/50 px-6 py-4 shadow-sm",
      className
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-info" />
            <h1 className="text-xl font-bold text-text-900">
              Radar Web
            </h1>
          </div>
          <div className="hidden sm:block text-sm text-muted">
            Dashboard de Métricas Económicas
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Health Status */}
          {health && (
            <HealthBadge health={health} />
          )}

          {/* Last Updated */}
          {lastUpdated && (
            <div className="hidden md:flex items-center gap-2 text-sm text-muted">
              <Clock className="h-4 w-4" />
              <span>
                Actualizado: {formatDate(lastUpdated)}
              </span>
            </div>
          )}

          {/* Refresh Button */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="flex items-center gap-2 px-3 py-2 text-sm text-text-600 hover:text-text-900 hover:bg-surface-secondary rounded-lg transition-colors focus-visible"
              aria-label="Actualizar datos"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Actualizar</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
});
