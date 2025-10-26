import { useQuery } from "@tanstack/react-query";
import { getHealth } from "./api";
import { REFETCH_INTERVALS } from "@/config/app";

/**
 * Health hooks using TanStack Query
 */

/**
 * Get system health status
 */
export function useHealth() {
  return useQuery({
    queryKey: ["health"],
    queryFn: getHealth,
    refetchInterval: REFETCH_INTERVALS.HEALTH,
    staleTime: 10000, // 10 seconds
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
