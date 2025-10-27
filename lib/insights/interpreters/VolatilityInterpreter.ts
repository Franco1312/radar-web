/**
 * Interpreter for volatility metrics
 */

import { BaseInterpreter } from './BaseInterpreter';
import { ContextData } from '../types';
import { TEXT_TEMPLATES } from '../constants';

export class VolatilityInterpreter extends BaseInterpreter {
  protected getInterpretation(value: number, ctx?: ContextData) {
    // Use percentiles if available, otherwise use fixed thresholds
    const isLowVol = ctx?.p30 ? value < ctx.p30 : value < 0.5;
    const isHighVol = ctx?.p70 ? value > ctx.p70 : value > 2;
    
    if (isLowVol) {
      return this.createInterpretation(
        TEXT_TEMPLATES.HEADLINES.POSITIVE.CALM,
        TEXT_TEMPLATES.SUMMARIES.VOLATILITY.LOW,
        TEXT_TEMPLATES.WHY_IT_MATTERS.VOLATILITY_LOW,
        'POSITIVE',
        value
      );
    }
    
    if (isHighVol) {
      return this.createInterpretation(
        TEXT_TEMPLATES.HEADLINES.NEGATIVE.VOLATILE,
        TEXT_TEMPLATES.SUMMARIES.VOLATILITY.HIGH,
        TEXT_TEMPLATES.WHY_IT_MATTERS.VOLATILITY,
        'NEGATIVE',
        value,
        TEXT_TEMPLATES.WATCH_ITEMS.VOLATILITY_HIGH
      );
    }
    
    return this.createInterpretation(
      TEXT_TEMPLATES.HEADLINES.NEUTRAL.NORMAL,
      TEXT_TEMPLATES.SUMMARIES.VOLATILITY.NORMAL,
      TEXT_TEMPLATES.WHY_IT_MATTERS.VOLATILITY,
      'NEUTRAL',
      value
    );
  }
}
