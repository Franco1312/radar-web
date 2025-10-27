/**
 * Types for human copy interpretation system
 */

import { RiskLevel, ConfidenceLevel, IconType, ColorType } from './constants';

// Re-export types for convenience
export type { RiskLevel, ConfidenceLevel, IconType, ColorType };

export interface HumanCopy {
  headline: string;
  summary: string;
  why: string;
  watch?: string;
  risk: RiskLevel;
  confidence: ConfidenceLevel;
  dataNote?: string;
  icon: IconType;
  color: ColorType;
}

export interface ContextData {
  freshnessH?: number;
  coverage30d?: number;
  ma30?: number;
  p30?: number;
  p70?: number;
}

export interface MetricData {
  metricId: string;
  value: number | null;
  metadata?: any;
  ctx?: ContextData;
}

export interface WatchItem {
  metricId: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export interface InterpretationResult {
  headline: string;
  summary: string;
  why: string;
  watch?: string;
  risk: RiskLevel;
  confidence: ConfidenceLevel;
  dataNote?: string;
  icon: IconType;
  color: ColorType;
}
