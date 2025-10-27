/**
 * Interpreter for trend metrics
 */

import { BaseInterpreter } from './BaseInterpreter';
import { ContextData } from '../types';
import { THRESHOLDS, TEXT_TEMPLATES } from '../constants';

export class TrendInterpreter extends BaseInterpreter {
  protected getInterpretation(value: number, ctx?: ContextData) {
    if (Math.abs(value) < 0.001) {
      return this.createInterpretation(
        TEXT_TEMPLATES.HEADLINES.NEUTRAL.NO_TREND,
        TEXT_TEMPLATES.SUMMARIES.TREND.STABLE,
        TEXT_TEMPLATES.WHY_IT_MATTERS.TREND,
        'NEUTRAL',
        value
      );
    }
    
    if (value > THRESHOLDS.TREND_THRESHOLD) {
      return this.createInterpretation(
        TEXT_TEMPLATES.HEADLINES.NEGATIVE.BULLISH,
        TEXT_TEMPLATES.SUMMARIES.TREND.BULLISH,
        TEXT_TEMPLATES.WHY_IT_MATTERS.TREND,
        'NEGATIVE',
        value
      );
    }
    
    if (value < -THRESHOLDS.TREND_THRESHOLD) {
      return this.createInterpretation(
        TEXT_TEMPLATES.HEADLINES.POSITIVE.COOLING,
        TEXT_TEMPLATES.SUMMARIES.TREND.BEARISH,
        TEXT_TEMPLATES.WHY_IT_MATTERS.TREND,
        'POSITIVE',
        value
      );
    }
    
    return this.createInterpretation(
      TEXT_TEMPLATES.HEADLINES.NEUTRAL.NO_TREND,
      TEXT_TEMPLATES.SUMMARIES.TREND.STABLE,
      TEXT_TEMPLATES.WHY_IT_MATTERS.TREND,
      'NEUTRAL',
      value
    );
  }
}
