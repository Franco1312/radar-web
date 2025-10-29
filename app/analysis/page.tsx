"use client";

import { Topbar } from "@/components/layout/Topbar";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default function AnalysisPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1f1f1f] text-white font-inter relative overflow-hidden">
      {/* Background decorations - Dark EcoSense style */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-[#F4D35E]/15 to-[#F4D35E]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-gradient-to-tr from-[#F4D35E]/12 to-[#F4D35E]/4 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-br from-[#F4D35E]/10 to-[#F4D35E]/3 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
      
      <Topbar />
      
      <main className="max-w-6xl mx-auto px-6 py-6 space-y-8 relative z-10">
        <div className="text-center py-20">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Análisis</h1>
          <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
            Análisis profundos y reportes especializados sobre la economía.
          </p>
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-[#F4D35E]/30">
            <p className="text-white/70">
              Reportes de análisis económico en desarrollo. Insights profundos y tendencias del mercado.
            </p>
          </div>
        </div>
      </main>
      
      <SiteFooter />
    </div>
  );
}
