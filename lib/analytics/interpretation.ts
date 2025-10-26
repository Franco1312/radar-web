/**
 * Analytics interpretation rules for microcopy
 */

export type InterpretationTone = 'positive' | 'negative' | 'warning' | 'neutral';

export interface Interpretation {
  tone: InterpretationTone;
  text: string;
}

/**
 * Interpret delta reserves percentage
 */
export function interpretDeltaReserves(value: number): Interpretation {
  const absValue = Math.abs(value);
  
  if (value < -5) {
    return {
      tone: 'negative',
      text: 'Las reservas cayeron fuertemente esta semana; el mercado percibe mayor presión cambiaria.'
    };
  } else if (value < -2) {
    return {
      tone: 'negative',
      text: 'Las reservas bajaron moderadamente; se observa cierta presión sobre el tipo de cambio.'
    };
  } else if (value < -0.5) {
    return {
      tone: 'warning',
      text: 'Las reservas tuvieron una leve caída; situación dentro de parámetros normales.'
    };
  } else if (value < 0.5) {
    return {
      tone: 'neutral',
      text: 'Las reservas se mantuvieron estables; sin cambios significativos en el corto plazo.'
    };
  } else if (value < 2) {
    return {
      tone: 'positive',
      text: 'Las reservas subieron levemente; mejora en la posición externa del país.'
    };
  } else {
    return {
      tone: 'positive',
      text: 'Las reservas tuvieron un crecimiento significativo; fortalecimiento de la posición externa.'
    };
  }
}

/**
 * Interpret delta base monetaria percentage
 */
export function interpretDeltaBase(value: number): Interpretation {
  const absValue = Math.abs(value);
  
  if (value > 5) {
    return {
      tone: 'negative',
      text: 'La base monetaria creció fuertemente; mayor presión sobre el tipo de cambio.'
    };
  } else if (value > 2) {
    return {
      tone: 'negative',
      text: 'La base monetaria subió moderadamente; se observa presión alcista sobre el dólar.'
    };
  } else if (value > 0.5) {
    return {
      tone: 'warning',
      text: 'La base monetaria tuvo un leve crecimiento; situación dentro de parámetros normales.'
    };
  } else if (value < -0.5) {
    return {
      tone: 'positive',
      text: 'La base monetaria se contrajo; menor presión sobre el tipo de cambio.'
    };
  } else {
    return {
      tone: 'neutral',
      text: 'La base monetaria se mantiene estable; sin cambios significativos en la liquidez.'
    };
  }
}

/**
 * Interpret reserves to base ratio
 */
export function interpretReservesToBase(value: number): Interpretation {
  if (value < 0.2) {
    return {
      tone: 'negative',
      text: 'El respaldo del peso en USD es críticamente bajo; alta vulnerabilidad cambiaria.'
    };
  } else if (value < 0.4) {
    return {
      tone: 'negative',
      text: 'El respaldo del peso en USD es bajo; situación de fragilidad cambiaria.'
    };
  } else if (value < 0.6) {
    return {
      tone: 'warning',
      text: 'El respaldo del peso en USD es mixto; situación intermedia con cierta vulnerabilidad.'
    };
  } else if (value < 0.8) {
    return {
      tone: 'positive',
      text: 'El respaldo del peso en USD es sólido; buena cobertura cambiaria.'
    };
  } else {
    return {
      tone: 'positive',
      text: 'El respaldo del peso en USD es muy sólido; excelente cobertura cambiaria.'
    };
  }
}

/**
 * Interpret FX volatility
 */
export function interpretFXVolatility(value: number, ma30?: number): Interpretation {
  const isHighVol = ma30 ? value > ma30 * 1.2 : value > 0.05;
  const isLowVol = ma30 ? value < ma30 * 0.8 : value < 0.02;
  
  if (isHighVol) {
    return {
      tone: 'negative',
      text: 'La volatilidad del USD está alta; mayor incertidumbre en el mercado cambiario.'
    };
  } else if (isLowVol) {
    return {
      tone: 'positive',
      text: 'La volatilidad del USD está baja; mayor estabilidad en el mercado cambiario.'
    };
  } else {
    return {
      tone: 'neutral',
      text: 'La volatilidad del USD está en niveles normales; comportamiento esperado del mercado.'
    };
  }
}

/**
 * Interpret data freshness
 */
export function interpretDataFreshness(hoursAgo: number): Interpretation {
  if (hoursAgo > 48) {
    return {
      tone: 'negative',
      text: 'Los datos están desactualizados; puede haber retrasos en la información.'
    };
  } else if (hoursAgo > 24) {
    return {
      tone: 'warning',
      text: 'Los datos tienen cierto retraso; información parcialmente actualizada.'
    };
  } else if (hoursAgo > 6) {
    return {
      tone: 'warning',
      text: 'Los datos están actualizados; información reciente disponible.'
    };
  } else {
    return {
      tone: 'positive',
      text: 'Los datos están muy actualizados; información en tiempo real.'
    };
  }
}

/**
 * Interpret FX trend (14v30)
 */
export function interpretFXTrend(value: number): Interpretation {
  if (value > 0.02) {
    return {
      tone: 'negative',
      text: 'La tendencia del USD es alcista; presión alcista en el corto plazo.'
    };
  } else if (value < -0.02) {
    return {
      tone: 'positive',
      text: 'La tendencia del USD es bajista; alivio en la presión cambiaria.'
    };
  } else {
    return {
      tone: 'neutral',
      text: 'La tendencia del USD es estable; sin cambios significativos en el corto plazo.'
    };
  }
}

/**
 * Get interpretation for a specific metric
 */
export function getInterpretation(metricId: string, value: number, metadata?: any): Interpretation {
  if (metricId.startsWith('delta.reserves_7d.pct')) {
    return interpretDeltaReserves(value);
  }
  
  if (metricId.startsWith('delta.base_7d.pct') || metricId.startsWith('delta.base_30d.pct')) {
    return interpretDeltaBase(value);
  }
  
  if (metricId.startsWith('ratio.reserves_to_base')) {
    return interpretReservesToBase(value);
  }
  
  if (metricId.startsWith('fx.vol_7d.usd')) {
    return interpretFXVolatility(value, metadata?.ma30);
  }
  
  if (metricId.startsWith('fx.trend_14v30.usd')) {
    return interpretFXTrend(value);
  }
  
  if (metricId.startsWith('data.freshness')) {
    return interpretDataFreshness(value);
  }
  
  // Default interpretation
  return {
    tone: 'neutral',
    text: 'Métrica en observación; sin cambios significativos detectados.'
  };
}
