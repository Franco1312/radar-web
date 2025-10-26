import { useQuery } from "@tanstack/react-query";
import { 
  getAllDefinitions, 
  getDefinition, 
  getHistoricalPoints, 
  getLatest 
} from "./api";
import { REFETCH_INTERVALS } from "@/config/app";

/**
 * Metrics hooks using TanStack Query
 */

/**
 * Get all metric definitions
 */
export function useMetricDefinitions() {
  return useQuery({
    queryKey: ["metrics", "defs"],
    queryFn: getAllDefinitions,
    refetchInterval: REFETCH_INTERVALS.DEFINITIONS,
    staleTime: 300000, // 5 minutes
    retry: 3,
  });
}

/**
 * Get specific metric definition by ID
 */
export function useMetricDefinition(id: string) {
  return useQuery({
    queryKey: ["metrics", "def", id],
    queryFn: () => getDefinition(id),
    enabled: !!id,
    staleTime: 300000, // 5 minutes
    retry: 3,
  });
}

/**
 * Get historical data points for a metric
 */
export function useHistorical(
  metricId: string,
  params?: {
    from?: string;
    to?: string;
    limit?: number;
  }
) {
  return useQuery({
    queryKey: ["metrics", "hist", metricId, params],
    queryFn: () => getHistoricalPoints(metricId, params),
    enabled: !!metricId,
    refetchInterval: REFETCH_INTERVALS.HISTORICAL,
    staleTime: 60000, // 1 minute
    retry: (failureCount, error: any) => {
      // Don't retry on 500 errors (metric not found)
      if (error?.status === 500) return false;
      return failureCount < 3;
    },
  });
}

/**
 * Get latest values for multiple metrics
 */
export function useLatest(ids: string[]) {
  return useQuery({
    queryKey: ["metrics", "latest", ids],
    queryFn: () => getLatest(ids),
    enabled: ids.length > 0,
    refetchInterval: REFETCH_INTERVALS.LATEST,
    staleTime: 30000, // 30 seconds
    retry: 3,
  });
}
