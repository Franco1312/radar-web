import { z } from "zod";

/**
 * Health API response schema
 */
export const HealthSchema = z.object({
  status: z.string(),
  timestamp: z.string(),
  timezone: z.string(),
  databases: z.object({
    source: z.boolean(),
    target: z.boolean(),
  }),
});

export type Health = z.infer<typeof HealthSchema>;
