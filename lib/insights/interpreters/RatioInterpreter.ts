/**
 * Interpreter for ratio metrics
 */

import { BaseInterpreter } from './BaseInterpreter';
import { ContextData } from '../types';
import { THRESHOLDS, TEXT_TEMPLATES } from '../constants';

export class RatioInterpreter extends BaseInterpreter {
  protected getInterpretation(value: number, ctx?: ContextData) {
    if (value >= THRESHOLDS.RATIO_STRONG) {
      return this.createInterpretation(
        TEXT_TEMPLATES.HEADLINES.POSITIVE.ROBUST,
        TEXT_TEMPLATES.SUMMARIES.RATIO.STRONG(value),
        TEXT_TEMPLATES.WHY_IT_MATTERS.RATIO_STRONG,
        'POSITIVE',
        value
      );
    }
    
    if (value >= THRESHOLDS.RATIO_WEAK) {
      return this.createInterpretation(
        TEXT_TEMPLATES.HEADLINES.WARNING.MIXED,
        TEXT_TEMPLATES.SUMMARIES.RATIO.MIXED(value),
        TEXT_TEMPLATES.WHY_IT_MATTERS.RATIO_MIXED,
        'WARNING',
        value
      );
    }
    
    return this.createInterpretation(
      TEXT_TEMPLATES.HEADLINES.NEGATIVE.FRAGILE,
      TEXT_TEMPLATES.SUMMARIES.RATIO.WEAK(value),
      TEXT_TEMPLATES.WHY_IT_MATTERS.RATIO_WEAK,
      'NEGATIVE',
      value,
      TEXT_TEMPLATES.WATCH_ITEMS.RATIO_LOW
    );
  }
}
