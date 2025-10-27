/**
 * Human-readable interpretation system for metrics
 * Produces clear, empathetic, and actionable text for general audience
 */

import { HumanCopy, ContextData, MetricData, WatchItem } from './types';
import { InterpreterFactory } from './interpreters/InterpreterFactory';
import { getPriorityFromRisk } from './utils';

/**
 * Main function to get human copy for any metric
 */
export function getHumanCopy(
  metricId: string, 
  value: number | null, 
  metadata?: any, 
  ctx?: ContextData
): HumanCopy {
  const interpreter = InterpreterFactory.getInterpreter(metricId);
  return interpreter.interpret(value, ctx);
}

/**
 * Get daily reading (highest severity metric)
 */
export function getDailyReading(metrics: MetricData[]): HumanCopy | null {
  if (!metrics.length) return null;
  
  // Sort by severity: negative > warning > positive > neutral
  const severityOrder = { negative: 0, warning: 1, positive: 2, neutral: 3 };
  
  const interpretations = metrics
    .map(m => ({ ...m, interpretation: getHumanCopy(m.metricId, m.value, m.metadata, m.ctx) }))
    .sort((a, b) => severityOrder[a.interpretation.risk] - severityOrder[b.interpretation.risk]);
  
  return interpretations[0].interpretation;
}

/**
 * Generate watch items for actionable insights
 */
export function generateWatchItems(metrics: MetricData[]): WatchItem[] {
  const items: WatchItem[] = [];
  
  metrics.forEach(metric => {
    const interpretation = getHumanCopy(metric.metricId, metric.value, metric.metadata, metric.ctx);
    
    if (interpretation.watch) {
      items.push({
        metricId: metric.metricId,
        description: interpretation.watch,
        priority: getPriorityFromRisk(interpretation.risk)
      });
    }
  });
  
  return items.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

// Re-export types for convenience
export type { HumanCopy, ContextData, MetricData, WatchItem };