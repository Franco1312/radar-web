/**
 * Application configuration constants
 */

export const CATEGORIES = [
  "deltas",
  "monetary", 
  "ratios",
  "fx",
  "data_health"
] as const;

export const DEFAULT_DASHBOARD_METRICS = [
  "delta.reserves_7d.pct",
  "delta.base_7d.pct", 
  "delta.base_30d.pct",
  "ratio.reserves_to_base",
  "fx.vol_7d.usd",
  "fx.trend_14v30.usd",
  "data.freshness.bcra.cambiarias.usd"
] as const;

export const DATE_DEFAULT_RANGE_DAYS = 90;

export const REFETCH_INTERVALS = {
  HEALTH: 30000, // 30 seconds
  LATEST: 120000, // 2 minutes
  HISTORICAL: 300000, // 5 minutes
  DEFINITIONS: 900000, // 15 minutes
} as const;
