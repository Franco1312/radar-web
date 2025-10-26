/**
 * Environment configuration with safe defaults
 * Prevents build failures if environment variables are missing
 */

export const ENV = {
  NEXT_PUBLIC_METRICS_BASE_URL: process.env.NEXT_PUBLIC_METRICS_BASE_URL || "http://localhost:3000",
  REQUEST_TIMEOUT_MS: Number(process.env.REQUEST_TIMEOUT_MS) || 12000,
  TREND_EPSILON: Number(process.env.TREND_EPSILON) || 0.001,
} as const;

// Validate required environment variables
if (typeof window === "undefined" && !process.env.NEXT_PUBLIC_METRICS_BASE_URL) {
  console.warn("[radar-web] NEXT_PUBLIC_METRICS_BASE_URL not set, using default: http://localhost:3000");
}
