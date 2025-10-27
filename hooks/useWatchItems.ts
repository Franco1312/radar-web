import { useMemo } from 'react';
import { generateWatchItems, MetricData } from '@/lib/insights/humanCopy';
import { LatestItem } from '@/types/metrics';

interface UseWatchItemsProps {
  latestData?: { items: LatestItem[] };
}

export function useWatchItems({ latestData }: UseWatchItemsProps) {
  return useMemo(() => {
    if (!latestData?.items) return [];
    
    const metrics: MetricData[] = latestData.items.map(item => ({
      metricId: item.metric_id,
      value: typeof item.value === 'string' ? parseFloat(item.value) : item.value,
      metadata: item.metadata,
      ctx: {
        freshnessH: 24, // Default - could be calculated from updatedAt
        coverage30d: 85 // Default - could be calculated from historical data
      }
    }));

    return generateWatchItems(metrics);
  }, [latestData]);
}
