/**
 * Interpreter for reserves metrics
 */

import { BaseInterpreter } from './BaseInterpreter';
import { ContextData } from '../types';
import { THRESHOLDS, TEXT_TEMPLATES } from '../constants';

export class ReservesInterpreter extends BaseInterpreter {
  protected getInterpretation(value: number, ctx?: ContextData) {
    if (value >= THRESHOLDS.RESERVES_STRONG_POSITIVE) {
      return this.createInterpretation(
        TEXT_TEMPLATES.HEADLINES.POSITIVE.STRONG,
        TEXT_TEMPLATES.SUMMARIES.RESERVES.STRONG_UP(value),
        TEXT_TEMPLATES.WHY_IT_MATTERS.RESERVES_MORE,
        'POSITIVE',
        value
      );
    }
    
    if (value >= THRESHOLDS.RESERVES_MILD_POSITIVE) {
      return this.createInterpretation(
        TEXT_TEMPLATES.HEADLINES.POSITIVE.MILD,
        TEXT_TEMPLATES.SUMMARIES.RESERVES.MILD_UP(value),
        TEXT_TEMPLATES.WHY_IT_MATTERS.RESERVES_MORE,
        'POSITIVE',
        value
      );
    }
    
    if (value >= THRESHOLDS.RESERVES_NEUTRAL) {
      return this.createInterpretation(
        TEXT_TEMPLATES.HEADLINES.NEUTRAL.NO_CHANGES,
        TEXT_TEMPLATES.SUMMARIES.RESERVES.STABLE,
        TEXT_TEMPLATES.WHY_IT_MATTERS.RESERVES,
        'NEUTRAL',
        value
      );
    }
    
    if (value >= THRESHOLDS.RESERVES_MILD_NEGATIVE) {
      return this.createInterpretation(
        TEXT_TEMPLATES.HEADLINES.WARNING.ATTENTION_MILD,
        TEXT_TEMPLATES.SUMMARIES.RESERVES.MILD_DOWN(value),
        TEXT_TEMPLATES.WHY_IT_MATTERS.RESERVES,
        'WARNING',
        value,
        TEXT_TEMPLATES.WATCH_ITEMS.RESERVES_DOWN
      );
    }
    
    return this.createInterpretation(
      TEXT_TEMPLATES.HEADLINES.NEGATIVE.PRESSURE,
      TEXT_TEMPLATES.SUMMARIES.RESERVES.STRONG_DOWN(value),
      TEXT_TEMPLATES.WHY_IT_MATTERS.RESERVES_LESS,
      'NEGATIVE',
      value,
      TEXT_TEMPLATES.WATCH_ITEMS.RESERVES_DOWN
    );
  }
}
