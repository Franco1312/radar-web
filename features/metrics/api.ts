import { fetchJson } from "@/lib/http";
import { 
  MetricsListSchema, 
  MetricPointsResponseSchema, 
  LatestSummarySchema,
  type MetricDefinition,
  type MetricPointsResponse,
  type LatestSummary
} from "@/types/metrics";
import { ENV } from "@/config/env";

/**
 * Metrics API integration
 */

/**
 * Get all metric definitions
 */
export async function getAllDefinitions(): Promise<MetricDefinition[]> {
  const url = `${ENV.NEXT_PUBLIC_METRICS_BASE_URL}/api/v1/metrics`;
  
  try {
    const data = await fetchJson<unknown>(url);
    const parsed = MetricsListSchema.parse(data);
    return parsed.metrics;
  } catch (error) {
    console.error("[radar-web] Error fetching metric definitions:", error);
    throw error;
  }
}

/**
 * Get specific metric definition by ID
 */
export async function getDefinition(id: string): Promise<MetricDefinition | null> {
  const url = `${ENV.NEXT_PUBLIC_METRICS_BASE_URL}/api/v1/metrics?id=${encodeURIComponent(id)}`;
  
  try {
    const data = await fetchJson<unknown>(url);
    const parsed = MetricsListSchema.parse(data);
    return parsed.metrics[0] || null;
  } catch (error) {
    console.error("[radar-web] Error fetching metric definition:", error);
    throw error;
  }
}

/**
 * Get historical data points for a metric
 */
export async function getHistoricalPoints(
  metricId: string,
  params?: {
    from?: string;
    to?: string;
    limit?: number;
  }
): Promise<MetricPointsResponse> {
  const searchParams = new URLSearchParams();
  
  if (params?.from) searchParams.set("from", params.from);
  if (params?.to) searchParams.set("to", params.to);
  if (params?.limit) searchParams.set("limit", params.limit.toString());
  
  const url = `${ENV.NEXT_PUBLIC_METRICS_BASE_URL}/api/v1/metrics/${encodeURIComponent(metricId)}?${searchParams.toString()}`;
  
  try {
    const data = await fetchJson<unknown>(url);
    return MetricPointsResponseSchema.parse(data);
  } catch (error) {
    console.error("[radar-web] Error fetching historical points:", error);
    throw error;
  }
}

/**
 * Get latest values for multiple metrics
 */
export async function getLatest(ids: string[]): Promise<LatestSummary> {
  const url = `${ENV.NEXT_PUBLIC_METRICS_BASE_URL}/api/v1/metrics/summary?ids=${ids.join(",")}`;
  
  try {
    const data = await fetchJson<unknown>(url);
    return LatestSummarySchema.parse(data);
  } catch (error) {
    console.error("[radar-web] Error fetching latest values:", error);
    throw error;
  }
}
