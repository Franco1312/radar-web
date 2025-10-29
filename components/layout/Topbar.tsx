import { memo } from "react";
import { BarChart3, Clock, RefreshCw } from "lucide-react";
import { HealthBadge } from "@/components/ui/HealthBadge";
import { Navigation } from "./Navigation";
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
      "py-20 md:py-28",
      className
    )}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <svg className="h-8 w-8" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                <path d="M10 30a14 14 0 1 1 4 -19" stroke="white" strokeWidth="2.4" strokeLinecap="round"/>
                <circle cx="28" cy="12" r="4" fill="#F4D35E"/>
              </svg>
              <span className="text-xl font-semibold tracking-tight text-white">EcoSense</span>
            </div>
          </div>

          {/* Navigation and CTA */}
          <div className="flex items-center gap-6">
            {/* Navigation */}
            <Navigation />
            
            {/* CTA Button */}
            <a href="#" className="text-sm font-medium underline underline-offset-4 hover:opacity-80 text-white">
              Me interesa
            </a>
          </div>
        </div>
      </div>
    </header>
  );
});
