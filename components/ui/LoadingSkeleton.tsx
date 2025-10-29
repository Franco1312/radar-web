import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
}

export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-gray-200 rounded",
        className
      )}
    />
  );
}

export function DarkLoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-white/20 rounded",
        className
      )}
    />
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="p-6 border rounded-lg bg-white">
      <div className="flex items-center justify-between mb-4">
        <LoadingSkeleton className="h-4 w-32" />
        <LoadingSkeleton className="h-4 w-4 rounded-full" />
      </div>
      <div className="space-y-2">
        <LoadingSkeleton className="h-8 w-24" />
        <LoadingSkeleton className="h-3 w-16" />
        <LoadingSkeleton className="h-3 w-full" />
      </div>
    </div>
  );
}

export function ChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <div className="p-6 border rounded-lg bg-white">
      <div className="mb-4">
        <LoadingSkeleton className="h-6 w-48 mb-2" />
        <LoadingSkeleton className="h-4 w-32" />
      </div>
      <div className="w-full" style={{ height }}>
        <LoadingSkeleton className="w-full h-full" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <LoadingSkeleton className="h-8 w-64" />
        <LoadingSkeleton className="h-8 w-32" />
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    </div>
  );
}

export function DarkMetricCardSkeleton() {
  return (
    <div className="p-6 border border-[#F4D35E]/20 rounded-xl bg-white/10 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <DarkLoadingSkeleton className="h-4 w-32" />
        <DarkLoadingSkeleton className="h-4 w-4 rounded-full" />
      </div>
      <div className="space-y-2">
        <DarkLoadingSkeleton className="h-8 w-24" />
        <DarkLoadingSkeleton className="h-3 w-16" />
        <DarkLoadingSkeleton className="h-3 w-full" />
      </div>
    </div>
  );
}

export function DarkChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <div className="p-6 border border-[#F4D35E]/20 rounded-xl bg-white/10 backdrop-blur-sm">
      <div className="mb-4">
        <DarkLoadingSkeleton className="h-6 w-48 mb-2" />
        <DarkLoadingSkeleton className="h-4 w-32" />
      </div>
      <div className="w-full" style={{ height }}>
        <DarkLoadingSkeleton className="w-full h-full" />
      </div>
    </div>
  );
}

export function DarkDashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Reading of the day skeleton */}
      <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-[#F4D35E]/30">
        <div className="flex items-center gap-3 mb-6">
          <DarkLoadingSkeleton className="w-12 h-12 rounded-full" />
          <div className="space-y-2">
            <DarkLoadingSkeleton className="h-6 w-48" />
            <DarkLoadingSkeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="space-y-4">
          <DarkLoadingSkeleton className="h-4 w-full" />
          <DarkLoadingSkeleton className="h-4 w-3/4" />
          <DarkLoadingSkeleton className="h-4 w-1/2" />
        </div>
      </div>

      {/* Metrics Grid */}
      <div>
        <DarkLoadingSkeleton className="h-8 w-48 mx-auto mb-12" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <DarkMetricCardSkeleton key={i} />
          ))}
        </div>
      </div>
      
      {/* Chart skeleton */}
      <div>
        <DarkLoadingSkeleton className="h-10 w-64 mx-auto mb-12" />
        <DarkChartSkeleton height={300} />
      </div>
    </div>
  );
}
