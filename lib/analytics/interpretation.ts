/**
 * Human-friendly metric interpretation system
 * Designed for people without economics background
 */

export type InterpretationTone = 'positive' | 'neutral' | 'warning' | 'negative';

export interface Interpretation {
  title: string;           // headline summary easy to grasp
  explanation: string;     // what's happening, in simple terms
  why_it_matters: string; // consequences, practical effects
  what_to_watch: string;  // what could happen next
  tone: InterpretationTone;
}

/**
 * Get human-friendly interpretation for any metric
 */
export function getInterpretation(metricId: string, value: number, metadata?: any): Interpretation {
  // Handle null/undefined values
  if (value === null || value === undefined || isNaN(value)) {
    return {
      title: "Sin información disponible",
      explanation: "No tenemos datos suficientes para analizar esta métrica.",
      why_it_matters: "Sin datos, no podemos saber si la situación está mejorando o empeorando.",
      what_to_watch: "Esperar a que lleguen nuevos datos para poder evaluar la situación.",
      tone: "neutral"
    };
  }

  // Route to specific metric interpreters
  if (metricId.startsWith('delta.reserves_7d.pct')) {
    return interpretReservesChange(value);
  }
  
  if (metricId.startsWith('delta.base_7d.pct') || metricId.startsWith('delta.base_30d.pct')) {
    return interpretBaseMonetaryChange(value, metricId);
  }
  
  if (metricId.startsWith('ratio.reserves_to_base')) {
    return interpretReservesRatio(value);
  }
  
  if (metricId.startsWith('fx.vol_7d.usd')) {
    return interpretVolatility(value);
  }
  
  if (metricId.startsWith('fx.trend_14v30.usd')) {
    return interpretTrend(value);
  }
  
  if (metricId.startsWith('data.freshness') || metricId.startsWith('data.coverage')) {
    return interpretDataHealth(value, metricId);
  }

  // Default fallback
  return {
    title: "Información técnica",
    explanation: "Esta métrica requiere análisis especializado.",
    why_it_matters: "Los expertos pueden interpretar mejor estos datos complejos.",
    what_to_watch: "Seguir las noticias económicas para entender mejor la situación.",
    tone: "neutral"
  };
}

/**
 * Interpret changes in international reserves
 */
function interpretReservesChange(value: number): Interpretation {
  const absValue = Math.abs(value);
  
  if (value > 2) {
    return {
      title: "Las reservas subieron mucho",
      explanation: `El país ganó ${value.toFixed(1)}% más dólares esta semana.`,
      why_it_matters: "Más reservas significa que el país tiene más capacidad para mantener estable el precio del dólar.",
      what_to_watch: "Si esta tendencia continúa, el dólar podría estabilizarse o incluso bajar un poco.",
      tone: "positive"
    };
  }
  
  if (value > 0.5) {
    return {
      title: "Las reservas subieron un poco",
      explanation: `El país ganó ${value.toFixed(1)}% más dólares esta semana.`,
      why_it_matters: "Cada dólar que entra ayuda a mantener la estabilidad del tipo de cambio.",
      what_to_watch: "Ver si esta mejora se mantiene en las próximas semanas.",
      tone: "positive"
    };
  }
  
  if (value > -0.5) {
    return {
      title: "Las reservas se mantuvieron estables",
      explanation: "Los dólares disponibles cambiaron muy poco esta semana.",
      why_it_matters: "La estabilidad en las reservas ayuda a mantener la confianza en el peso.",
      what_to_watch: "Observar si esta estabilidad se mantiene o si empieza a cambiar.",
      tone: "neutral"
    };
  }
  
  if (value > -2) {
    return {
      title: "Las reservas bajaron un poco",
      explanation: `El país usó ${Math.abs(value).toFixed(1)}% de sus dólares esta semana.`,
      why_it_matters: "Cuando se usan reservas, el país tiene menos capacidad para controlar el precio del dólar.",
      what_to_watch: "Si esta caída continúa, podría haber más presión para que el dólar suba.",
      tone: "warning"
    };
  }
  
  return {
    title: "Las reservas bajaron mucho",
    explanation: `El país usó ${Math.abs(value).toFixed(1)}% de sus dólares esta semana.`,
    why_it_matters: "Con menos reservas, es más difícil mantener estable el precio del dólar.",
    what_to_watch: "Si esta tendencia continúa, el dólar podría subir más rápido.",
    tone: "negative"
  };
}

/**
 * Interpret changes in monetary base
 */
function interpretBaseMonetaryChange(value: number, metricId: string): Interpretation {
  const period = metricId.includes('30d') ? 'este mes' : 'esta semana';
  const absValue = Math.abs(value);
  
  if (value > 3) {
    return {
      title: "Entraron muchos pesos nuevos a la economía",
      explanation: `El Banco Central emitió ${value.toFixed(1)}% más pesos ${period}.`,
      why_it_matters: "Más pesos circulando pueden hacer que los precios suban más rápido.",
      what_to_watch: "Si esta emisión continúa, podría aumentar la inflación en los próximos meses.",
      tone: "negative"
    };
  }
  
  if (value > 1) {
    return {
      title: "Entraron más pesos a la economía",
      explanation: `El Banco Central emitió ${value.toFixed(1)}% más pesos ${period}.`,
      why_it_matters: "Más pesos en circulación pueden presionar los precios hacia arriba.",
      what_to_watch: "Observar si este aumento se mantiene y cómo afecta los precios.",
      tone: "warning"
    };
  }
  
  if (value > -1) {
    return {
      title: "La cantidad de pesos se mantuvo estable",
      explanation: `La emisión de pesos cambió muy poco ${period}.`,
      why_it_matters: "La estabilidad en la cantidad de dinero ayuda a mantener los precios más estables.",
      what_to_watch: "Ver si esta estabilidad se mantiene en el tiempo.",
      tone: "neutral"
    };
  }
  
  if (value > -3) {
    return {
      title: "Salieron pesos de la economía",
      explanation: `La cantidad de pesos en circulación bajó ${Math.abs(value).toFixed(1)}% ${period}.`,
      why_it_matters: "Menos pesos circulando puede ayudar a frenar el aumento de precios.",
      what_to_watch: "Si esta reducción continúa, podría ayudar a controlar la inflación.",
      tone: "positive"
    };
  }
  
  return {
    title: "Salieron muchos pesos de la economía",
    explanation: `La cantidad de pesos en circulación bajó ${Math.abs(value).toFixed(1)}% ${period}.`,
    why_it_matters: "Esta reducción significativa puede ayudar a frenar el aumento de precios.",
    what_to_watch: "Si esta tendencia continúa, podría haber una desaceleración en la inflación.",
    tone: "positive"
  };
}

/**
 * Interpret reserves to base ratio
 */
function interpretReservesRatio(value: number): Interpretation {
  // Normalize value if it's in centavos (very large)
  const normalizedValue = value > 100 ? value / 100 : value;
  const formattedValue = normalizedValue.toFixed(3);
  
  if (normalizedValue >= 0.80) {
    return {
      title: "Respaldo del Peso en Reservas",
      explanation: `Respaldo sólido: las reservas cubren la mayor parte del dinero emitido. Por cada $1 en la economía, hay ${formattedValue} en reservas.`,
      why_it_matters: "Cuanto mayor el respaldo, más fácil es para el Banco Central sostener la estabilidad del dólar sin medidas adicionales.",
      what_to_watch: "Si este ratio se mantiene alto, el dólar debería mantenerse más estable.",
      tone: "positive"
    };
  }
  
  if (normalizedValue >= 0.50) {
    return {
      title: "Respaldo del Peso en Reservas",
      explanation: `Respaldo moderado: la estabilidad depende de las condiciones del mercado. Por cada $1 en la economía, hay ${formattedValue} en reservas.`,
      why_it_matters: "Cuanto menor el respaldo, más difícil es para el Banco Central sostener la estabilidad del dólar sin medidas adicionales.",
      what_to_watch: "Si este ratio sigue bajando, pueden aumentar los movimientos del dólar o anuncios de política monetaria.",
      tone: "warning"
    };
  }
  
  return {
    title: "Respaldo del Peso en Reservas",
    explanation: `Respaldo bajo: hay pocas reservas para sostener el valor del peso. Por cada $1 en la economía, hay ${formattedValue} en reservas.`,
    why_it_matters: "Cuanto menor el respaldo, más difícil es para el Banco Central sostener la estabilidad del dólar sin medidas adicionales.",
    what_to_watch: "Si este ratio sigue bajando, pueden aumentar los movimientos del dólar o anuncios de política monetaria.",
    tone: "negative"
  };
}

/**
 * Interpret USD volatility
 */
function interpretVolatility(value: number): Interpretation {
  // Convert to percentage
  const percentage = value * 100;
  
  if (percentage < 1) {
    return {
      title: "El dólar está muy tranquilo",
      explanation: `La variación del dólar fue de solo ${percentage.toFixed(1)}% esta semana.`,
      why_it_matters: "Cuando el dólar se mueve poco, es más fácil planificar gastos y ahorros.",
      what_to_watch: "Si esta calma se mantiene, el dólar debería seguir estable.",
      tone: "positive"
    };
  }
  
  if (percentage < 3) {
    return {
      title: "El dólar se movió moderadamente",
      explanation: `La variación del dólar fue de ${percentage.toFixed(1)}% esta semana.`,
      why_it_matters: "Movimientos moderados son normales y no generan mucha incertidumbre.",
      what_to_watch: "Observar si estos movimientos se mantienen dentro de este rango.",
      tone: "neutral"
    };
  }
  
  if (percentage < 6) {
    return {
      title: "El dólar se movió bastante",
      explanation: `La variación del dólar fue de ${percentage.toFixed(1)}% esta semana.`,
      why_it_matters: "Movimientos grandes pueden generar incertidumbre sobre el precio futuro del dólar.",
      what_to_watch: "Si esta volatilidad continúa, podría haber más incertidumbre en el mercado.",
      tone: "warning"
    };
  }
  
  return {
    title: "El dólar se movió mucho",
    explanation: `La variación del dólar fue de ${percentage.toFixed(1)}% esta semana.`,
    why_it_matters: "Movimientos muy grandes generan mucha incertidumbre y dificultan la planificación.",
    what_to_watch: "Si esta alta volatilidad continúa, podría haber más turbulencia en el mercado.",
    tone: "negative"
  };
}

/**
 * Interpret trend comparison (14d vs 30d)
 */
function interpretTrend(value: number): Interpretation {
  if (value > 0.5) {
    return {
      title: "La tendencia se está acelerando",
      explanation: "Los cambios recientes son más intensos que el promedio del mes.",
      why_it_matters: "Una aceleración puede indicar que la situación está cambiando más rápido de lo normal.",
      what_to_watch: "Si esta aceleración continúa, podríamos ver cambios más bruscos en los próximos días.",
      tone: "warning"
    };
  }
  
  if (value > 0.1) {
    return {
      title: "La tendencia se está intensificando",
      explanation: "Los cambios recientes son un poco más fuertes que el promedio del mes.",
      why_it_matters: "Una intensificación moderada puede indicar un cambio en la dinámica.",
      what_to_watch: "Observar si esta intensificación se mantiene o se normaliza.",
      tone: "neutral"
    };
  }
  
  if (value > -0.1) {
    return {
      title: "La tendencia se mantiene estable",
      explanation: "Los cambios recientes son similares al promedio del mes.",
      why_it_matters: "La estabilidad en las tendencias ayuda a mantener la previsibilidad.",
      what_to_watch: "Ver si esta estabilidad se mantiene en el tiempo.",
      tone: "neutral"
    };
  }
  
  if (value > -0.5) {
    return {
      title: "La tendencia se está moderando",
      explanation: "Los cambios recientes son un poco más suaves que el promedio del mes.",
      why_it_matters: "Una moderación puede indicar que la situación se está estabilizando.",
      what_to_watch: "Si esta moderación continúa, podríamos ver más estabilidad.",
      tone: "positive"
    };
  }
  
  return {
    title: "La tendencia se está desacelerando",
    explanation: "Los cambios recientes son mucho más suaves que el promedio del mes.",
    why_it_matters: "Una desaceleración puede indicar que la situación se está calmando.",
    what_to_watch: "Si esta desaceleración continúa, podríamos ver más estabilidad en el futuro.",
    tone: "positive"
  };
}

/**
 * Interpret data health metrics
 */
function interpretDataHealth(value: number, metricId: string): Interpretation {
  if (metricId.includes('freshness')) {
    const hours = value;
    
    if (hours <= 24) {
      return {
        title: "Los datos están muy actualizados",
        explanation: `La información tiene menos de ${Math.round(hours)} horas de antigüedad.`,
        why_it_matters: "Datos frescos nos dan una imagen más precisa de lo que está pasando ahora.",
        what_to_watch: "Mantener esta actualización para tener información confiable.",
        tone: "positive"
      };
    }
    
    if (hours <= 48) {
      return {
        title: "Los datos están actualizados",
        explanation: `La información tiene ${Math.round(hours)} horas de antigüedad.`,
        why_it_matters: "Datos recientes nos dan una buena idea de la situación actual.",
        what_to_watch: "Los datos deberían actualizarse pronto para mantener la precisión.",
        tone: "neutral"
      };
    }
    
    if (hours <= 72) {
      return {
        title: "Los datos están un poco desactualizados",
        explanation: `La información tiene ${Math.round(hours)} horas de antigüedad.`,
        why_it_matters: "Datos con retraso pueden no reflejar la situación actual con precisión.",
        what_to_watch: "Esperar actualizaciones más frecuentes para tener información más confiable.",
        tone: "warning"
      };
    }
    
    return {
      title: "Los datos están muy desactualizados",
      explanation: `La información tiene ${Math.round(hours)} horas de antigüedad.`,
      why_it_matters: "Datos muy antiguos pueden no reflejar la realidad actual.",
      what_to_watch: "Esperar actualizaciones más frecuentes para poder confiar en la información.",
      tone: "negative"
    };
  }
  
  if (metricId.includes('coverage')) {
    const percentage = value;
    
    if (percentage >= 80) {
      return {
        title: "Los datos tienen muy buena cobertura",
        explanation: `Tenemos información del ${percentage.toFixed(0)}% de los días del mes.`,
        why_it_matters: "Buena cobertura nos da una imagen completa y confiable de la situación.",
        what_to_watch: "Mantener esta cobertura para tener información consistente.",
        tone: "positive"
      };
    }
    
    if (percentage >= 60) {
      return {
        title: "Los datos tienen buena cobertura",
        explanation: `Tenemos información del ${percentage.toFixed(0)}% de los días del mes.`,
        why_it_matters: "Cobertura moderada nos da una idea general de la situación.",
        what_to_watch: "Mejorar la cobertura para tener información más completa.",
        tone: "neutral"
      };
    }
    
    if (percentage >= 40) {
      return {
        title: "Los datos tienen cobertura limitada",
        explanation: `Tenemos información del ${percentage.toFixed(0)}% de los días del mes.`,
        why_it_matters: "Cobertura limitada puede no darnos una imagen completa de la situación.",
        what_to_watch: "Esperar mejoras en la cobertura para tener información más confiable.",
        tone: "warning"
      };
    }
    
    return {
      title: "Los datos tienen muy poca cobertura",
      explanation: `Tenemos información del ${percentage.toFixed(0)}% de los días del mes.`,
      why_it_matters: "Con tan poca cobertura, es difícil tener una imagen clara de la situación.",
      what_to_watch: "Esperar mejoras significativas en la cobertura para poder confiar en los datos.",
      tone: "negative"
    };
  }
  
  return {
    title: "Información de calidad de datos",
    explanation: "Esta métrica indica qué tan confiables son los datos que estamos viendo.",
    why_it_matters: "Datos confiables nos ayudan a tomar mejores decisiones.",
    what_to_watch: "Mantener la calidad de los datos para tener información precisa.",
    tone: "neutral"
  };
}