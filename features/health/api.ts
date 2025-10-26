import { fetchJson } from "@/lib/http";
import { HealthSchema, type Health } from "@/types/health";
import { ENV } from "@/config/env";

/**
 * Health API integration
 */
export async function getHealth(): Promise<Health> {
  const url = `${ENV.NEXT_PUBLIC_METRICS_BASE_URL}/api/health`;
  
  try {
    const data = await fetchJson<unknown>(url);
    return HealthSchema.parse(data);
  } catch (error) {
    console.error("[radar-web] Error fetching health:", error);
    throw error;
  }
}
