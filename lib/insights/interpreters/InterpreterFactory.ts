/**
 * Factory for creating metric interpreters
 */

import { BaseInterpreter } from './BaseInterpreter';
import { ReservesInterpreter } from './ReservesInterpreter';
import { BaseMonetaryInterpreter } from './BaseMonetaryInterpreter';
import { RatioInterpreter } from './RatioInterpreter';
import { VolatilityInterpreter } from './VolatilityInterpreter';
import { TrendInterpreter } from './TrendInterpreter';
import { DefaultInterpreter } from './DefaultInterpreter';

export class InterpreterFactory {
  private static interpreters = new Map<string, BaseInterpreter>();

  static getInterpreter(metricId: string): BaseInterpreter {
    if (this.interpreters.has(metricId)) {
      return this.interpreters.get(metricId)!;
    }

    let interpreter: BaseInterpreter;

    if (metricId.startsWith('delta.reserves_7d.pct')) {
      interpreter = new ReservesInterpreter();
    } else if (metricId.startsWith('delta.base_7d.pct')) {
      interpreter = new BaseMonetaryInterpreter(false);
    } else if (metricId.startsWith('delta.base_30d.pct')) {
      interpreter = new BaseMonetaryInterpreter(true);
    } else if (metricId.startsWith('ratio.reserves_to_base')) {
      interpreter = new RatioInterpreter();
    } else if (metricId.startsWith('fx.vol_7d.usd')) {
      interpreter = new VolatilityInterpreter();
    } else if (metricId.startsWith('fx.trend_14v30.usd')) {
      interpreter = new TrendInterpreter();
    } else {
      // Default interpreter for unknown metrics
      interpreter = new DefaultInterpreter();
    }

    this.interpreters.set(metricId, interpreter);
    return interpreter;
  }

  static clearCache(): void {
    this.interpreters.clear();
  }
}
