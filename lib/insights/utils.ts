/**
 * Utility functions for human copy interpretation
 */

import { ContextData, RiskLevel, ConfidenceLevel, IconType, ColorType } from './types';
import { CONFIDENCE_LEVELS, ICONS, COLORS, THRESHOLDS } from './constants';

/**
 * Get direction based on value
 */
export function getDirection(value: number): IconType {
  if (Math.abs(value) < 0.001) return ICONS.FLAT;
  return value > 0 ? ICONS.UP : ICONS.DOWN;
}

/**
 * Get magnitude category
 */
export function getMagnitude(value: number): 'fuerte' | 'moderado' | 'leve' | 'mínimo' {
  const abs = Math.abs(value);
  if (abs >= 5) return 'fuerte';
  if (abs >= 2) return 'moderado';
  if (abs >= 0.5) return 'leve';
  return 'mínimo';
}

/**
 * Calculate confidence level based on context
 */
export function calcConfidence(ctx?: ContextData): ConfidenceLevel {
  if (!ctx) return CONFIDENCE_LEVELS.MEDIA;
  
  const { freshnessH = 0, coverage30d = 100 } = ctx;
  
  // Alta si freshness ≤ 24h y cobertura_30d ≥ 80%
  if (freshnessH <= THRESHOLDS.FRESHNESS_EXCELLENT && coverage30d >= THRESHOLDS.COVERAGE_EXCELLENT) {
    return CONFIDENCE_LEVELS.ALTA;
  }
  
  // Media si freshness ≤ 72h o cobertura_30d 60–80%
  if (freshnessH <= THRESHOLDS.FRESHNESS_POOR || (coverage30d >= THRESHOLDS.COVERAGE_GOOD && coverage30d < THRESHOLDS.COVERAGE_EXCELLENT)) {
    return CONFIDENCE_LEVELS.MEDIA;
  }
  
  // Baja si freshness > 72h o cobertura_30d < 60%
  return CONFIDENCE_LEVELS.BAJA;
}

/**
 * Generate data quality notes
 */
export function makeDataNote(ctx?: ContextData, issues?: string[]): string | undefined {
  if (!ctx && !issues?.length) return undefined;
  
  const notes: string[] = [];
  
  if (ctx) {
    const { freshnessH = 0, coverage30d = 100 } = ctx;
    
    if (freshnessH > THRESHOLDS.FRESHNESS_GOOD) {
      notes.push(`Dato con retraso de ${Math.round(freshnessH)}h; puede actualizarse.`);
    }
    
    if (coverage30d < THRESHOLDS.COVERAGE_EXCELLENT) {
      notes.push(`Cobertura de ${Math.round(coverage30d)}% en 30 días; interpretar con cautela.`);
    }
  }
  
  if (issues?.length) {
    notes.push(...issues);
  }
  
  return notes.length > 0 ? notes.join(' ') : undefined;
}

/**
 * Map risk level to color
 */
export function getRiskColor(risk: RiskLevel): ColorType {
  switch (risk) {
    case 'positive': return COLORS.GREEN;
    case 'warning': return COLORS.AMBER;
    case 'negative': return COLORS.RED;
    case 'neutral': return COLORS.GRAY;
    default: return COLORS.GRAY;
  }
}

/**
 * Map risk level to icon based on value direction
 */
export function getRiskIcon(risk: RiskLevel, value: number): IconType {
  if (risk === 'neutral') return ICONS.FLAT;
  if (risk === 'positive') return value < 0 ? ICONS.DOWN : ICONS.UP;
  if (risk === 'negative') return value < 0 ? ICONS.DOWN : ICONS.UP;
  if (risk === 'warning') return value < 0 ? ICONS.DOWN : ICONS.UP;
  return ICONS.FLAT;
}

/**
 * Check if value is null or invalid
 */
export function isInvalidValue(value: number | null): boolean {
  return value === null || value === undefined || isNaN(value);
}

/**
 * Get risk level from severity
 */
export function getRiskFromSeverity(severity: 'high' | 'medium' | 'low'): RiskLevel {
  switch (severity) {
    case 'high': return 'negative';
    case 'medium': return 'warning';
    case 'low': return 'positive';
    default: return 'neutral';
  }
}

/**
 * Get priority from risk level
 */
export function getPriorityFromRisk(risk: RiskLevel): 'high' | 'medium' | 'low' {
  switch (risk) {
    case 'negative': return 'high';
    case 'warning': return 'medium';
    case 'positive': return 'low';
    case 'neutral': return 'low';
    default: return 'low';
  }
}
