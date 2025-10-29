import { memo } from "react";
import { ExternalLink, Github } from "lucide-react";
import { cn } from "@/lib/utils";

interface SiteFooterProps {
  className?: string;
}

export const SiteFooter = memo(function SiteFooter({
  className
}: SiteFooterProps) {
  return (
    <footer className={cn(
      "py-8 border-t border-white/10",
      className
    )}>
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p className="text-sm text-white/60">
          EcoSense · Política de Privacidad · Términos de Uso
        </p>
      </div>
    </footer>
  );
});
