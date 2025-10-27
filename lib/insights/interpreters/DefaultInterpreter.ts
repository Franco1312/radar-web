/**
 * Default interpreter for unknown metrics
 */

import { BaseInterpreter } from './BaseInterpreter';
import { ContextData } from '../types';
import { TEXT_TEMPLATES } from '../constants';

export class DefaultInterpreter extends BaseInterpreter {
  protected getInterpretation(value: number, ctx?: ContextData) {
    return this.createInterpretation(
      'Métrica en observación',
      'Esta métrica está siendo monitoreada.',
      'Todas las métricas aportan información valiosa.',
      'NEUTRAL',
      value,
      undefined
    );
  }
}
