/**
 * Constants for human copy interpretation system
 */

export const RISK_LEVELS = {
  POSITIVE: 'positive',
  WARNING: 'warning', 
  NEGATIVE: 'negative',
  NEUTRAL: 'neutral'
} as const;

export const CONFIDENCE_LEVELS = {
  ALTA: 'alta',
  MEDIA: 'media',
  BAJA: 'baja'
} as const;

export const ICONS = {
  UP: 'up',
  DOWN: 'down',
  FLAT: 'flat',
  NA: 'na'
} as const;

export const COLORS = {
  GREEN: 'green',
  AMBER: 'amber',
  RED: 'red',
  GRAY: 'gray'
} as const;

export const THRESHOLDS = {
  // Reservas 7d
  RESERVES_STRONG_POSITIVE: 2,
  RESERVES_MILD_POSITIVE: 0.5,
  RESERVES_NEUTRAL: -0.5,
  RESERVES_MILD_NEGATIVE: -2,
  
  // Base 7d
  BASE_STRONG_POSITIVE: -2,
  BASE_MILD_POSITIVE: -0.5,
  BASE_NEUTRAL: 0.5,
  BASE_MILD_NEGATIVE: 2,
  
  // Base 30d
  BASE_30_STRONG_POSITIVE: -5,
  BASE_30_MILD_POSITIVE: -1,
  BASE_30_NEUTRAL: 1,
  BASE_30_MILD_NEGATIVE: 5,
  
  // Ratio
  RATIO_STRONG: 0.8,
  RATIO_WEAK: 0.6,
  
  // Trend
  TREND_THRESHOLD: 0.02,
  
  // Data quality
  FRESHNESS_EXCELLENT: 24,
  FRESHNESS_GOOD: 48,
  FRESHNESS_POOR: 72,
  COVERAGE_EXCELLENT: 80,
  COVERAGE_GOOD: 60,
  COVERAGE_POOR: 60
} as const;

export const TEXT_TEMPLATES = {
  HEADLINES: {
    POSITIVE: {
      STRONG: "Señal de alivio",
      MILD: "Aumento leve", 
      REDUCTION: "Reducción leve",
      CONTRACTION: "Contracción fuerte",
      ROBUST: "Respaldo robusto",
      CALM: "Mercado calmo",
      COOLING: "Se enfría el dólar"
    },
    NEGATIVE: {
      PRESSURE: "Presión cambiaria",
      MORE_MONEY: "Más pesos en la calle",
      FRAGILE: "Respaldo frágil",
      VOLATILE: "Agitación cambiaria",
      BULLISH: "Tendencia alcista del dólar",
      EXPANSION: "Expansión fuerte"
    },
    WARNING: {
      ATTENTION_MILD: "Atención: caída leve",
      ATTENTION_INCREASE: "Atención: aumento leve",
      MIXED: "Respaldo mixto",
      MODERATE_EXPANSION: "Atención: expansión moderada"
    },
    NEUTRAL: {
      NO_CHANGES: "Sin cambios relevantes",
      NO_TREND: "Sin tendencia definida",
      NORMAL: "Volatilidad normal",
      FRESH: "Datos frescos",
      DELAY: "Leve retraso",
      OUTDATED: "Dato desactualizado",
      NO_DATA: "Sin dato concluyente"
    }
  },
  
  SUMMARIES: {
    RESERVES: {
      STRONG_UP: (val: number) => `Las reservas aumentaron con fuerza (~${val.toFixed(1)}%) esta semana.`,
      MILD_UP: (val: number) => `Las reservas subieron levemente (~${val.toFixed(1)}%) en 7 días hábiles.`,
      STABLE: "Las reservas se mantuvieron estables esta semana.",
      MILD_DOWN: (val: number) => `Las reservas bajaron levemente (~${val.toFixed(1)}%) esta semana.`,
      STRONG_DOWN: (val: number) => `Las reservas cayeron con fuerza (~${val.toFixed(1)}%) esta semana.`
    },
    BASE_7D: {
      STRONG_DOWN: (val: number) => `La base monetaria se contrajo con fuerza (~${val.toFixed(1)}%) en 7 días.`,
      MILD_DOWN: (val: number) => `La base monetaria bajó levemente (~${val.toFixed(1)}%) en 7 días hábiles.`,
      STABLE: "La base monetaria se mantuvo estable en 7 días hábiles.",
      MILD_UP: (val: number) => `La base monetaria aumentó levemente (~${val.toFixed(1)}%) en 7 días hábiles.`,
      STRONG_UP: (val: number) => `La base monetaria creció con fuerza (~${val.toFixed(1)}%) en 7 días hábiles.`
    },
    BASE_30D: {
      STRONG_DOWN: (val: number) => `La base monetaria se contrajo marcadamente (~${val.toFixed(1)}%) en el mes.`,
      MILD_DOWN: (val: number) => `La base monetaria bajó moderadamente (~${val.toFixed(1)}%) en 30 días.`,
      STABLE: "La base monetaria se mantuvo estable en 30 días.",
      MILD_UP: (val: number) => `La base monetaria creció moderadamente (~${val.toFixed(1)}%) en 30 días.`,
      STRONG_UP: (val: number) => `La base monetaria creció con fuerza (~${val.toFixed(1)}%) en 30 días.`
    },
    RATIO: {
      STRONG: (val: number) => `Las reservas cubren bien a la base monetaria (ratio ~${val.toFixed(2)}).`,
      MIXED: (val: number) => `Las reservas cubren moderadamente a la base monetaria (ratio ~${val.toFixed(2)}).`,
      WEAK: (val: number) => `Las reservas cubren poco a la base monetaria (ratio ~${val.toFixed(2)}).`
    },
    VOLATILITY: {
      LOW: "La volatilidad del USD está baja esta semana.",
      NORMAL: "La volatilidad del USD está en niveles normales.",
      HIGH: "La volatilidad del USD está alta; mayor incertidumbre."
    },
    TREND: {
      BULLISH: "El USD sube más rápido que su promedio mensual.",
      BEARISH: "El USD baja más rápido que su promedio mensual.",
      STABLE: "El USD no muestra tendencia clara en el corto plazo."
    }
  },
  
  WHY_IT_MATTERS: {
    RESERVES: "Las reservas son el 'colchón' para estabilizar el dólar.",
    RESERVES_MORE: "Más reservas = mayor capacidad de estabilizar el dólar.",
    RESERVES_LESS: "Menos reservas reduce el margen para estabilizar el dólar.",
    BASE_MORE: "Más pesos en circulación suele presionar precios y dólar.",
    BASE_LESS: "Menos pesos en circulación alivia la presión sobre precios y dólar.",
    BASE_PRESSURE: "Más pesos pueden sumar presión sobre precios y dólar.",
    RATIO_STRONG: "Más cobertura = peso más confiable.",
    RATIO_MIXED: "No es débil, pero tampoco holgado.",
    RATIO_WEAK: "Poco 'colchón' en USD para absorber shocks.",
    VOLATILITY: "Más oscilación implica mayor incertidumbre de corto plazo.",
    VOLATILITY_LOW: "Menos oscilación implica menor incertidumbre de corto plazo.",
    TREND: "La tendencia indica la dirección del dólar en el corto plazo.",
    DATA_FRESH: "Datos frescos permiten análisis más precisos."
  },
  
  WATCH_ITEMS: {
    RESERVES_DOWN: "Si la caída continúa, podrían activarse alertas por salida de divisas.",
    BASE_UP_7D: "Si supera +2% semanal, sube el riesgo de inestabilidad.",
    BASE_UP_30D: "Si supera +5% mensual, sube el riesgo inflacionario.",
    RATIO_LOW: "Si baja de 0.6, aumenta la vulnerabilidad cambiaria.",
    VOLATILITY_HIGH: "Si persiste alta por 3 días, revisar coberturas."
  },
  
  DATA_NOTES: {
    FRESHNESS_DELAY: (hours: number) => `Dato con retraso de ${Math.round(hours)}h; puede actualizarse.`,
    COVERAGE_LOW: (pct: number) => `Cobertura de ${Math.round(pct)}% en 30 días; interpretar con cautela.`,
    NO_DATA: "Dato faltante o inválido; verificar fuentes.",
    UNKNOWN_METRIC: "Métrica no reconocida; interpretar con cautela."
  }
} as const;

export type RiskLevel = typeof RISK_LEVELS[keyof typeof RISK_LEVELS];
export type ConfidenceLevel = typeof CONFIDENCE_LEVELS[keyof typeof CONFIDENCE_LEVELS];
export type IconType = typeof ICONS[keyof typeof ICONS];
export type ColorType = typeof COLORS[keyof typeof COLORS];
