import { ENV } from "@/config/env";
import type { MetricPoint, LatestItem, TrendDirection } from "@/types/metrics";

/**
 * UI selectors and data processing utilities
 */

/**
 * Normalize value from string or number to number
 */
export function normalizeValue(value: number | string): number | null {
  if (typeof value === "number") {
    return isNaN(value) ? null : value;
  }
  
  const parsed = parseFloat(value);
  return isNaN(parsed) ? null : parsed;
}

/**
 * Compute trend direction based on current and reference values
 */
export function computeTrend(
  current: number,
  reference?: number,
  epsilon: number = ENV.TREND_EPSILON
): TrendDirection {
  if (reference === undefined || reference === null) {
    return "flat";
  }
  
  const diff = current - reference;
  
  if (Math.abs(diff) < epsilon) {
    return "flat";
  }
  
  return diff > 0 ? "up" : "down";
}

/**
 * Get the last valid point from an array of points
 */
export function lastValid(points: { ts: string; value: any; metadata?: unknown }[]): { ts: string; value: number } | null {
  for (let i = points.length - 1; i >= 0; i--) {
    const point = points[i];
    const normalizedValue = normalizeValue(point.value);
    
    if (normalizedValue !== null) {
      return {
        ts: point.ts,
        value: normalizedValue,
      };
    }
  }
  
  return null;
}

/**
 * Get the last two valid points for computing deltas
 */
export function lastTwo(points: { ts: string; value: any; metadata?: unknown }[]): [LatestItem | null, LatestItem | null] {
  const validPoints: LatestItem[] = [];
  
  for (let i = points.length - 1; i >= 0; i--) {
    const point = points[i];
    const normalizedValue = normalizeValue(point.value);
    
    if (normalizedValue !== null) {
      validPoints.push({
        metric_id: "", // Will be filled by caller
        ts: point.ts,
        value: normalizedValue,
        metadata: point.metadata,
      });
      
      if (validPoints.length === 2) break;
    }
  }
  
  return [validPoints[0] || null, validPoints[1] || null];
}

/**
 * Calculate percentage change between two values
 */
export function calculatePercentageChange(current: number, reference: number): number {
  if (reference === 0) return 0;
  return ((current - reference) / reference) * 100;
}

/**
 * Get trend direction for a metric based on its latest data
 */
export function getMetricTrend(
  latest: LatestItem | null,
  reference: LatestItem | null
): TrendDirection {
  if (!latest || !reference) {
    return "flat";
  }
  
  const currentValue = normalizeValue(latest.value);
  const referenceValue = normalizeValue(reference.value);
  
  if (currentValue === null || referenceValue === null) {
    return "flat";
  }
  
  return computeTrend(currentValue, referenceValue);
}
