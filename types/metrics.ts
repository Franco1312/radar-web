import { z } from "zod";

/**
 * Metric categories
 */
export const MetricCategorySchema = z.enum([
  "deltas",
  "monetary", 
  "ratios",
  "fx",
  "data_health"
]);

export type MetricCategory = z.infer<typeof MetricCategorySchema>;

/**
 * Individual metric definition
 */
export const MetricDefinitionSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: MetricCategorySchema,
  description: z.string().optional(),
  unit: z.string().optional(),
  formula: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

export type MetricDefinition = z.infer<typeof MetricDefinitionSchema>;

/**
 * Metrics list response
 */
export const MetricsListSchema = z.object({
  metrics: z.array(MetricDefinitionSchema),
  count: z.number(),
});

export type MetricsList = z.infer<typeof MetricsListSchema>;

/**
 * Historical data point
 */
export const MetricPointSchema = z.object({
  ts: z.string(),
  value: z.union([z.number(), z.string()]),
  metadata: z.unknown().optional(),
});

export type MetricPoint = z.infer<typeof MetricPointSchema>;

/**
 * Historical points response
 */
export const MetricPointsResponseSchema = z.object({
  metric_id: z.string(),
  points: z.array(MetricPointSchema),
  count: z.number(),
});

export type MetricPointsResponse = z.infer<typeof MetricPointsResponseSchema>;

/**
 * Latest value item
 */
export const LatestItemSchema = z.object({
  metric_id: z.string(),
  ts: z.string(),
  value: z.union([z.number(), z.string()]),
  metadata: z.unknown().optional(),
});

export type LatestItem = z.infer<typeof LatestItemSchema>;

/**
 * Latest values summary response
 */
export const LatestSummarySchema = z.object({
  items: z.array(LatestItemSchema),
  missing: z.array(z.union([z.string(), z.object({}).passthrough()])),
  summary: z.unknown().optional(),
});

export type LatestSummary = z.infer<typeof LatestSummarySchema>;

/**
 * Trend direction
 */
export type TrendDirection = "up" | "down" | "flat";

/**
 * Interpretation tone
 */
export type InterpretationTone = "positivo" | "negativo" | "neutral";

/**
 * Interpretation result
 */
export interface Interpretation {
  tone: InterpretationTone;
  text: string;
}
