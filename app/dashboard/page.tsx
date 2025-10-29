"use client";

import { DEFAULT_DASHBOARD_METRICS } from "@/config/app";
import { useHealth } from "@/features/health/hooks";
import { useMetricDefinitions, useLatest, useHistorical } from "@/features/metrics/hooks";
import { MetricCardWrapper } from "@/components/cards/MetricCardWrapper";
import { Topbar } from "@/components/layout/Topbar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { WhatToWatchNow } from "@/components/panels/WhatToWatchNow";
import { DarkDashboardSkeleton } from "@/components/ui/LoadingSkeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { formatDate } from "@/lib/date";
import { useDailyReading } from "@/hooks/useDailyReading";
import { useWatchItems } from "@/hooks/useWatchItems";
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

// Dynamic imports for charts
const TimeSeriesChart = dynamic(() => import("@/components/charts/TimeSeriesChart").then(mod => ({ default: mod.TimeSeriesChart })), {
  loading: () => <div className="h-80 bg-surface-tertiary rounded-lg animate-pulse" />
});

const ComparisonChart = dynamic(() => import("@/components/charts/ComparisonChart").then(mod => ({ default: mod.ComparisonChart })), {
  loading: () => <div className="h-80 bg-surface-tertiary rounded-lg animate-pulse" />
});

export default function DashboardPage() {
  const { data: health, isLoading: healthLoading, error: healthError } = useHealth();
  const { data: definitions, isLoading: defsLoading, error: defsError } = useMetricDefinitions();
  const { data: latestData, isLoading: latestLoading, error: latestError } = useLatest([...DEFAULT_DASHBOARD_METRICS]);

  // Historical data for charts - without date filters for testing
  const { data: reservesData, error: reservesError } = useHistorical("ratio.reserves_to_base");
  const { data: baseData, error: baseError } = useHistorical("delta.base_7d.pct");

  // Create a map of definitions for quick lookup
  const defsMap = useMemo(() => {
    if (!definitions) return new Map();
    return new Map(definitions.map(def => [def.id, def]));
  }, [definitions]);

  // Get the latest timestamp for "updated at" display
  const lastUpdate = useMemo(() => {
    if (!latestData?.items?.length) return null;
    const timestamps = latestData.items.map(item => new Date(item.ts).getTime());
    return new Date(Math.max(...timestamps));
  }, [latestData]);

  // Use custom hooks for cleaner logic
  const dailyReading = useDailyReading({ latestData });
  const watchItems = useWatchItems({ latestData });

  const isLoading = healthLoading || defsLoading || latestLoading;
  const hasError = healthError || defsError || latestError;
  const hasChartError = reservesError || baseError;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1f1f1f] text-white font-inter relative overflow-hidden">
        {/* Background decorations - Dark EcoSense style */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-[#F4D35E]/15 to-[#F4D35E]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-gradient-to-tr from-[#F4D35E]/12 to-[#F4D35E]/4 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-br from-[#F4D35E]/10 to-[#F4D35E]/3 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-40 left-20 w-24 h-24 bg-gradient-to-br from-[#F4D35E]/8 to-[#F4D35E]/2 rounded-full blur-2xl"></div>
        <div className="absolute bottom-40 right-20 w-20 h-20 bg-gradient-to-br from-[#F4D35E]/6 to-[#F4D35E]/1 rounded-full blur-xl"></div>
        
        <Topbar />
        <main className="max-w-6xl mx-auto px-6 py-6 space-y-8 relative z-10">
          <DarkDashboardSkeleton />
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1f1f1f] text-white font-inter relative overflow-hidden">
        {/* Background decorations - Dark EcoSense style */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-[#F4D35E]/15 to-[#F4D35E]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-gradient-to-tr from-[#F4D35E]/12 to-[#F4D35E]/4 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-br from-[#F4D35E]/10 to-[#F4D35E]/3 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-40 left-20 w-24 h-24 bg-gradient-to-br from-[#F4D35E]/8 to-[#F4D35E]/2 rounded-full blur-2xl"></div>
        <div className="absolute bottom-40 right-20 w-20 h-20 bg-gradient-to-br from-[#F4D35E]/6 to-[#F4D35E]/1 rounded-full blur-xl"></div>
        
        <Topbar />
        <main className="max-w-6xl mx-auto px-6 py-6 space-y-8 relative z-10">
          <ErrorState
            title="Error al cargar el dashboard"
            message="No se pudieron cargar los datos del dashboard. Por favor, verifica que el servidor de métricas esté funcionando."
            onRetry={() => window.location.reload()}
          />
        </main>
        <SiteFooter />
      </div>
    );
  }

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1f1f1f] text-white font-inter relative overflow-hidden">
        {/* Background decorations - Dark EcoSense style */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-[#F4D35E]/15 to-[#F4D35E]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-gradient-to-tr from-[#F4D35E]/12 to-[#F4D35E]/4 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-br from-[#F4D35E]/10 to-[#F4D35E]/3 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-40 left-20 w-24 h-24 bg-gradient-to-br from-[#F4D35E]/8 to-[#F4D35E]/2 rounded-full blur-2xl"></div>
        <div className="absolute bottom-40 right-20 w-20 h-20 bg-gradient-to-br from-[#F4D35E]/6 to-[#F4D35E]/1 rounded-full blur-xl"></div>
        
        <Topbar
          health={health}
          lastUpdated={lastUpdate?.toISOString()}
          onRefresh={() => window.location.reload()}
        />

        <main className="max-w-6xl mx-auto px-6 py-6 space-y-8 relative z-10">
        {/* Reading of the day - Dark EcoSense Style */}
        <section 
          className="relative overflow-hidden bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-[#F4D35E]/30 shadow-lg"
          aria-live="polite"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#F4D35E] rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-[#2B2B2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                Lectura del día
              </h2>
              <p className="text-sm text-white/70">
                Análisis económico en tiempo real
              </p>
            </div>
          </div>
          
          <div className="text-base text-white leading-relaxed">
            {dailyReading ? (
              <div className="space-y-4">
                <div className="bg-[#F4D35E]/20 p-4 rounded-lg border border-[#F4D35E]/30">
                  <p className="font-medium text-white mb-2">
                    Hoy, {dailyReading.headline.toLowerCase()}.
                  </p>
                  <p className="text-sm text-white/80">
                    <strong>Por qué importa:</strong> {dailyReading.why}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className={`px-3 py-1 rounded-full font-medium ${
                    dailyReading.risk === 'positive' ? 'border border-green-400/30 text-green-300 bg-green-500/20' :
                    dailyReading.risk === 'warning' ? 'border border-amber-400/30 text-amber-300 bg-amber-500/20' :
                    dailyReading.risk === 'negative' ? 'border border-red-400/30 text-red-300 bg-red-500/20' :
                    'border border-gray-400/30 text-gray-300 bg-gray-500/20'
                  }`}>
                    Riesgo: {dailyReading.risk === 'positive' ? 'Bajo' : 
                             dailyReading.risk === 'warning' ? 'Medio' : 
                             dailyReading.risk === 'negative' ? 'Alto' : 'Neutral'}
                  </span>
                  <span className={`px-3 py-1 rounded-full font-medium border ${
                    dailyReading.confidence === 'alta' ? 'border-green-400/30 text-green-300 bg-green-500/20' :
                    dailyReading.confidence === 'media' ? 'border-amber-400/30 text-amber-300 bg-amber-500/20' :
                    'border-red-400/30 text-red-300 bg-red-500/20'
                  }`}>
                    Confianza: {dailyReading.confidence}
                  </span>
                  <span className="text-white/60">
                    Última act.: {lastUpdate ? Math.round((Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60)) : '?'}h
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-[#F4D35E]/20 p-4 rounded-lg border border-[#F4D35E]/30">
                <p className="font-medium text-white">
                  Las métricas se mantienen estables. No se detectaron cambios significativos en el corto plazo.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Metrics Grid - Dark EcoSense Style */}
        <section className="relative">
          <h2 className="text-2xl font-bold mb-12 text-white text-center">Indicadores clave</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {DEFAULT_DASHBOARD_METRICS.map((metricId) => {
              const def = defsMap.get(metricId);
              const latest = latestData?.items?.find(item => item.metric_id === metricId);
              
              if (!def) return null;

              return (
                <MetricCardWrapper
                  key={metricId}
                  metricId={metricId}
                  def={def}
                  latest={latest}
                />
              );
            })}
          </div>
        </section>

        {/* Charts Section - Dark EcoSense Style */}
        <section className="relative">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">Señal del mercado</h2>
          {hasChartError ? (
            <div className="w-full max-w-5xl mx-auto bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl border border-[#F4D35E]/20 p-6 shadow-2xl">
              <div className="text-center p-8">
                <div className="text-[#F4D35E] mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">
                  Datos históricos no disponibles
                </h3>
                <p className="text-sm text-gray-400">
                  Los gráficos históricos no se pueden cargar en este momento. 
                  Las métricas principales siguen funcionando correctamente.
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-5xl mx-auto bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl border border-[#F4D35E]/20 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-[#F4D35E] rounded-full shadow-lg"></div>
                  <span className="text-white font-semibold text-lg">USD/ARS</span>
                  <span className="text-[#F4D35E] font-bold text-lg">$425.00</span>
                  <span className="text-green-400 text-sm bg-green-400/10 px-2 py-1 rounded-full">+2.1%</span>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-[#2B2B2B]/80 text-white text-xs rounded hover:bg-[#3a3a3a] transition-colors">1D</button>
                  <button className="px-3 py-1 bg-[#F4D35E] text-[#1a1a1a] text-xs rounded font-semibold shadow-lg">1M</button>
                  <button className="px-3 py-1 bg-[#2B2B2B]/80 text-white text-xs rounded hover:bg-[#3a3a3a] transition-colors">3M</button>
                  <button className="px-3 py-1 bg-[#2B2B2B]/80 text-white text-xs rounded hover:bg-[#3a3a3a] transition-colors">1Y</button>
                </div>
              </div>
              <div className="relative" style={{height: '300px'}}>
                <div className="w-full h-full bg-gradient-to-br from-[#2B2B2B] to-[#1a1a1a] rounded-lg flex items-center justify-center border border-[#F4D35E]/10">
                  <p className="text-gray-400">Gráfico de tendencias</p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* What to Watch Now - EcoSense Style */}
        {watchItems.length > 0 && (
          <section className="relative">
            <div className="max-w-6xl mx-auto px-6">
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">Beneficios claros y simples.</h2>
              <div className="flex justify-center">
                <div className={`grid gap-6 md:gap-8 max-w-4xl ${watchItems.length === 1 ? 'grid-cols-1' : 'md:grid-cols-3'}`}>
                  {watchItems.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-[#F4D35E]/30 bg-white/10 backdrop-blur-sm p-6 text-center hover:shadow-lg hover:bg-white/20 transition-all duration-300 cursor-pointer group mx-auto"
                      style={{ maxWidth: watchItems.length === 1 ? '400px' : 'none' }}
                      onClick={() => {
                        if (item.metricId) {
                          window.location.href = `/metric/${item.metricId}`;
                        }
                      }}
                    >
                      <div className="w-12 h-12 bg-[#F4D35E] rounded-full mb-4 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-[#2B2B2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L16 7l-6 6-6-6z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-3">
                        {item.priority === 'high' ? 'Alta Prioridad' : 
                         item.priority === 'medium' ? 'Media Prioridad' : 'Baja Prioridad'}
                      </h3>
                      <p className="text-white/80">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Final CTA Section - Dark EcoSense Style */}
        <section className="py-20 md:py-28">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Sé el primero en saberlo.</h2>
            <p className="text-xl lg:text-2xl text-white/80 mb-12 max-w-3xl mx-auto">
              Unite a la lista temprana y recibí interpretación clara cuando algo importante suceda.
            </p>
            <form className="flex flex-col lg:flex-row gap-4 max-w-2xl mx-auto">
              <input 
                type="email" 
                placeholder="Tu correo electrónico" 
                className="flex-1 px-6 py-4 text-lg rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#F4D35E] focus:border-transparent bg-white/10 text-white placeholder-white/60"
              />
              <button 
                type="submit" 
                className="bg-[#F4D35E] text-[#2B2B2B] px-8 py-4 rounded-xl font-semibold text-lg hover:brightness-95 transition-all"
              >
                Unirme ahora
              </button>
            </form>
            <a href="#" className="mt-6 text-lg text-white/70 underline underline-offset-4 hover:opacity-80 transition-all inline-block">
              Solo quiero estar atento
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}