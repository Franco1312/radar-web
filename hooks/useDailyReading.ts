import { useMemo } from 'react';
import { getDailyReading, MetricData } from '@/lib/insights/humanCopy';
import { LatestItem } from '@/types/metrics';

interface UseDailyReadingProps {
  latestData?: { items: LatestItem[] };
}

export function useDailyReading({ latestData }: UseDailyReadingProps) {
  return useMemo(() => {
    if (!latestData?.items) return null;
    
    const metrics: MetricData[] = latestData.items.map(item => ({
      metricId: item.metric_id,
      value: typeof item.value === 'string' ? parseFloat(item.value) : item.value,
      metadata: item.metadata,
      ctx: {
        freshnessH: 24, // Default - could be calculated from updatedAt
        coverage30d: 85 // Default - could be calculated from historical data
      }
    }));

    return getDailyReading(metrics);
  }, [latestData]);
}
