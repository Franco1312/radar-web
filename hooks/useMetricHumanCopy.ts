import { useMemo } from 'react';
import { getHumanCopy, HumanCopy } from '@/lib/insights/humanCopy';
import { LatestItem } from '@/types/metrics';

interface UseMetricHumanCopyProps {
  metricId: string;
  latest?: LatestItem;
  contextData?: {
    freshnessH?: number;
    coverage30d?: number;
    ma30?: number;
    p30?: number;
    p70?: number;
  };
}

export function useMetricHumanCopy({ 
  metricId, 
  latest, 
  contextData = { freshnessH: 24, coverage30d: 85 } 
}: UseMetricHumanCopyProps): HumanCopy | undefined {
  return useMemo(() => {
    if (!latest) return undefined;
    
    return getHumanCopy(
      metricId,
      typeof latest.value === 'string' ? parseFloat(latest.value) : latest.value,
      latest.metadata,
      contextData
    );
  }, [metricId, latest, contextData]);
}
