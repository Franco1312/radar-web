/**
 * Base class for metric interpreters
 */

import { HumanCopy, ContextData } from '../types';
import { calcConfidence, makeDataNote, getRiskColor, getRiskIcon } from '../utils';
import { RISK_LEVELS, CONFIDENCE_LEVELS, ICONS, COLORS } from '../constants';

export abstract class BaseInterpreter {
  protected abstract getInterpretation(value: number, ctx?: ContextData): Partial<HumanCopy>;

  interpret(value: number | null, ctx?: ContextData): HumanCopy {
    // Handle null/NaN values
    if (value === null || value === undefined || isNaN(value)) {
      return this.getNoDataInterpretation();
    }

    const interpretation = this.getInterpretation(value, ctx);
    const confidence = calcConfidence(ctx);
    const dataNote = makeDataNote(ctx);

    return {
      headline: interpretation.headline || 'Sin dato concluyente',
      summary: interpretation.summary || 'No hay datos suficientes para interpretar esta métrica.',
      why: interpretation.why || 'Los datos son necesarios para un análisis preciso.',
      watch: interpretation.watch,
      risk: interpretation.risk || RISK_LEVELS.NEUTRAL,
      confidence,
      dataNote,
      icon: interpretation.icon || ICONS.NA,
      color: interpretation.color || COLORS.GRAY
    };
  }

  protected getNoDataInterpretation(): HumanCopy {
    return {
      headline: 'Sin dato concluyente',
      summary: 'No hay datos suficientes para interpretar esta métrica.',
      why: 'Los datos son necesarios para un análisis preciso.',
      risk: RISK_LEVELS.NEUTRAL,
      confidence: CONFIDENCE_LEVELS.BAJA,
      dataNote: 'Dato faltante o inválido; verificar fuentes.',
      icon: ICONS.NA,
      color: COLORS.GRAY
    };
  }

  protected createInterpretation(
    headline: string,
    summary: string,
    why: string,
    risk: keyof typeof RISK_LEVELS,
    value: number,
    watch?: string
  ): Partial<HumanCopy> {
    return {
      headline,
      summary,
      why,
      watch,
      risk: RISK_LEVELS[risk],
      icon: getRiskIcon(RISK_LEVELS[risk], value),
      color: getRiskColor(RISK_LEVELS[risk])
    };
  }
}
