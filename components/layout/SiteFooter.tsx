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
      "bg-surface-secondary border-t border-border-200 px-6 py-8",
      className
    )}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-text-900">
              Radar Web
            </h3>
            <p className="text-sm text-text-600 leading-relaxed">
              Dashboard profesional para monitoreo de métricas económicas en tiempo real.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-text-900">
              Enlaces
            </h4>
            <ul className="space-y-2 text-sm text-text-600">
              <li>
                <a 
                  href="#" 
                  className="hover:text-text-900 transition-colors flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  Documentación
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="hover:text-text-900 transition-colors flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  API Reference
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="hover:text-text-900 transition-colors flex items-center gap-1"
                >
                  <Github className="h-3 w-3" />
                  Código Fuente
                </a>
              </li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-text-900">
              Disclaimer
            </h4>
            <p className="text-xs text-text-500 leading-relaxed">
              Los datos mostrados son informativos y no constituyen asesoramiento financiero. 
              La información puede tener retrasos y no garantizamos su exactitud.
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-border-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-text-500">
              © 2024 Radar Web. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-4 text-xs text-text-500">
              <span>Versión 1.0.0</span>
              <span>•</span>
              <span>Última actualización: {new Date().toLocaleDateString('es-AR')}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});
