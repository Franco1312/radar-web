import { MetricCard } from './MetricCard';
import { getInterpretation } from '@/lib/analytics/interpretation';
import { LatestItem, MetricDefinition } from '@/types/metrics';
import Link from 'next/link';

interface MetricCardWrapperProps {
  metricId: string;
  def: MetricDefinition;
  latest?: LatestItem;
}

export function MetricCardWrapper({ 
  metricId, 
  def, 
  latest
}: MetricCardWrapperProps) {
  const interpretation = latest ? getInterpretation(
    metricId, 
    typeof latest.value === 'string' ? parseFloat(latest.value) : latest.value, 
    latest.metadata
  ) : undefined;

  // Map category from metric ID
  const getCategory = (id: string): 'deltas' | 'ratios' | 'fx' | 'monetary' | 'data_health' => {
    if (id.startsWith('delta.')) return 'deltas';
    if (id.startsWith('ratio.')) return 'ratios';
    if (id.startsWith('fx.')) return 'fx';
    if (id.startsWith('data.')) return 'data_health';
    return 'monetary';
  };

  // Map unit from definition
  const getUnit = (unit?: string): 'percent' | 'ARS' | 'USD' | 'ratio' | 'volatility' | 'other' => {
    if (!unit) return 'other';
    if (unit.includes('%') || unit.includes('percent')) return 'percent';
    if (unit.includes('ARS')) return 'ARS';
    if (unit.includes('USD')) return 'USD';
    if (unit.includes('ratio')) return 'ratio';
    if (unit.includes('vol') || unit.includes('volatility')) return 'volatility';
    return 'other';
  };

  return (
    <Link href={`/metric/${metricId}`} className="block h-full">
      <MetricCard
        id={metricId}
        category={getCategory(metricId)}
        title={def.name}
        value={typeof latest?.value === 'string' ? parseFloat(latest.value) : latest?.value}
        unit={getUnit(def.unit)}
        updatedAt={latest?.ts}
        def={def}
        latest={latest}
        interpretation={interpretation}
        className="h-full min-h-[320px]"
      />
    </Link>
  );
}
