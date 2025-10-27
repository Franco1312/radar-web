/**
 * Interpreter for base monetary metrics
 */

import { BaseInterpreter } from './BaseInterpreter';
import { ContextData } from '../types';
import { THRESHOLDS, TEXT_TEMPLATES } from '../constants';

export class BaseMonetaryInterpreter extends BaseInterpreter {
  private readonly is30Day: boolean;

  constructor(is30Day = false) {
    super();
    this.is30Day = is30Day;
  }

  protected getInterpretation(value: number, ctx?: ContextData) {
    if (this.is30Day) {
      return this.interpret30Day(value);
    }
    return this.interpret7Day(value);
  }

  private interpret7Day(value: number) {
    if (value <= THRESHOLDS.BASE_STRONG_POSITIVE) {
      return this.createInterpretation(
        TEXT_TEMPLATES.HEADLINES.POSITIVE.CONTRACTION,
        TEXT_TEMPLATES.SUMMARIES.BASE_7D.STRONG_DOWN(value),
        TEXT_TEMPLATES.WHY_IT_MATTERS.BASE_LESS,
        'POSITIVE',
        value
      );
    }
    
    if (value <= THRESHOLDS.BASE_MILD_POSITIVE) {
      return this.createInterpretation(
        TEXT_TEMPLATES.HEADLINES.POSITIVE.REDUCTION,
        TEXT_TEMPLATES.SUMMARIES.BASE_7D.MILD_DOWN(value),
        TEXT_TEMPLATES.WHY_IT_MATTERS.BASE_LESS,
        'POSITIVE',
        value
      );
    }
    
    if (value <= THRESHOLDS.BASE_NEUTRAL) {
      return this.createInterpretation(
        TEXT_TEMPLATES.HEADLINES.NEUTRAL.NO_CHANGES,
        TEXT_TEMPLATES.SUMMARIES.BASE_7D.STABLE,
        TEXT_TEMPLATES.WHY_IT_MATTERS.BASE_MORE,
        'NEUTRAL',
        value
      );
    }
    
    if (value <= THRESHOLDS.BASE_MILD_NEGATIVE) {
      return this.createInterpretation(
        TEXT_TEMPLATES.HEADLINES.WARNING.ATTENTION_INCREASE,
        TEXT_TEMPLATES.SUMMARIES.BASE_7D.MILD_UP(value),
        TEXT_TEMPLATES.WHY_IT_MATTERS.BASE_PRESSURE,
        'WARNING',
        value,
        TEXT_TEMPLATES.WATCH_ITEMS.BASE_UP_7D
      );
    }
    
    return this.createInterpretation(
      TEXT_TEMPLATES.HEADLINES.NEGATIVE.MORE_MONEY,
      TEXT_TEMPLATES.SUMMARIES.BASE_7D.STRONG_UP(value),
      TEXT_TEMPLATES.WHY_IT_MATTERS.BASE_PRESSURE,
      'NEGATIVE',
      value,
      TEXT_TEMPLATES.WATCH_ITEMS.BASE_UP_7D
    );
  }

  private interpret30Day(value: number) {
    if (value <= THRESHOLDS.BASE_30_STRONG_POSITIVE) {
      return this.createInterpretation(
        TEXT_TEMPLATES.HEADLINES.POSITIVE.CONTRACTION,
        TEXT_TEMPLATES.SUMMARIES.BASE_30D.STRONG_DOWN(value),
        TEXT_TEMPLATES.WHY_IT_MATTERS.BASE_LESS,
        'POSITIVE',
        value
      );
    }
    
    if (value <= THRESHOLDS.BASE_30_MILD_POSITIVE) {
      return this.createInterpretation(
        TEXT_TEMPLATES.HEADLINES.POSITIVE.REDUCTION,
        TEXT_TEMPLATES.SUMMARIES.BASE_30D.MILD_DOWN(value),
        TEXT_TEMPLATES.WHY_IT_MATTERS.BASE_LESS,
        'POSITIVE',
        value
      );
    }
    
    if (value <= THRESHOLDS.BASE_30_NEUTRAL) {
      return this.createInterpretation(
        TEXT_TEMPLATES.HEADLINES.NEUTRAL.NO_CHANGES,
        TEXT_TEMPLATES.SUMMARIES.BASE_30D.STABLE,
        TEXT_TEMPLATES.WHY_IT_MATTERS.BASE_MORE,
        'NEUTRAL',
        value
      );
    }
    
    if (value <= THRESHOLDS.BASE_30_MILD_NEGATIVE) {
      return this.createInterpretation(
        TEXT_TEMPLATES.HEADLINES.WARNING.MODERATE_EXPANSION,
        TEXT_TEMPLATES.SUMMARIES.BASE_30D.MILD_UP(value),
        TEXT_TEMPLATES.WHY_IT_MATTERS.BASE_PRESSURE,
        'WARNING',
        value,
        TEXT_TEMPLATES.WATCH_ITEMS.BASE_UP_30D
      );
    }
    
    return this.createInterpretation(
      TEXT_TEMPLATES.HEADLINES.NEGATIVE.EXPANSION,
      TEXT_TEMPLATES.SUMMARIES.BASE_30D.STRONG_UP(value),
      TEXT_TEMPLATES.WHY_IT_MATTERS.BASE_PRESSURE,
      'NEGATIVE',
      value,
      TEXT_TEMPLATES.WATCH_ITEMS.BASE_UP_30D
    );
  }
}
