import type { 
  MetricDefinition, 
  LatestItem, 
  Interpretation, 
  InterpretationTone 
} from "@/types/metrics";
import { normalizeValue } from "./selectors";

/**
 * Didactic interpretation system for metrics
 */

/**
 * Generate interpretation for a metric based on its value and metadata
 */
export function interpret(
  metricId: string,
  data: {
    value: number | string;
    metadata?: unknown;
    def?: MetricDefinition;
  }
): Interpretation {
  const value = normalizeValue(data.value);
  
  if (value === null) {
    return {
      tone: "neutral",
      text: "Sin datos disponibles",
    };
  }

  // Extract metadata for context
  const metadata = data.metadata as Record<string, any> || {};
  const current = metadata.current || value;
  const reference = metadata.reference;
  const unit = metadata.units || data.def?.unit;

  // Delta metrics (7d, 30d changes)
  if (metricId.startsWith("delta.reserves_7d.pct")) {
    return interpretReservesChange(value, "7 días");
  }
  
  if (metricId.startsWith("delta.base_7d.pct")) {
    return interpretBaseChange(value, "7 días");
  }
  
  if (metricId.startsWith("delta.base_30d.pct")) {
    return interpretBaseChange(value, "30 días");
  }

  // Ratio metrics
  if (metricId.startsWith("ratio.reserves_to_base")) {
    return interpretReservesToBaseRatio(value);
  }

  // FX volatility
  if (metricId.startsWith("fx.vol_7d.usd")) {
    return interpretFXVolatility(value, metadata);
  }

  // FX trend
  if (metricId.startsWith("fx.trend_14v30.usd")) {
    return interpretFXTrend(value);
  }

  // Data freshness
  if (metricId.startsWith("data.freshness")) {
    return interpretDataFreshness(value, metadata);
  }

  // Default interpretation
  return {
    tone: "neutral",
    text: "Métrica en observación",
  };
}

/**
 * Interpret reserves change percentage
 */
function interpretReservesChange(value: number, period: string): Interpretation {
  if (value < -3) {
    return {
      tone: "negativo",
      text: `Las reservas cayeron fuertemente en ${period}`,
    };
  } else if (value < -1) {
    return {
      tone: "negativo", 
      text: `Las reservas bajaron en ${period}`,
    };
  } else if (value < 1) {
    return {
      tone: "neutral",
      text: `Las reservas se mantuvieron estables en ${period}`,
    };
  } else if (value < 3) {
    return {
      tone: "positivo",
      text: `Las reservas subieron moderadamente en ${period}`,
    };
  } else {
    return {
      tone: "positivo",
      text: `Las reservas tuvieron un salto alcista en ${period}`,
    };
  }
}

/**
 * Interpret base monetary change percentage
 */
function interpretBaseChange(value: number, period: string): Interpretation {
  if (value > 8) {
    return {
      tone: "negativo",
      text: `Expansión elevada de pesos en ${period} (más presión cambiaria)`,
    };
  } else if (value > 3) {
    return {
      tone: "negativo",
      text: `Crecimiento moderado de la base monetaria en ${period}`,
    };
  } else if (value < -3) {
    return {
      tone: "positivo",
      text: `Contracción de la base monetaria en ${period}`,
    };
  } else {
    return {
      tone: "neutral",
      text: `Base monetaria estable en ${period}`,
    };
  }
}

/**
 * Interpret reserves to base ratio
 */
function interpretReservesToBaseRatio(value: number): Interpretation {
  if (value < 0.2) {
    return {
      tone: "negativo",
      text: "Respaldo del peso en USD es críticamente bajo",
    };
  } else if (value < 0.4) {
    return {
      tone: "negativo",
      text: "Respaldo del peso en USD es bajo",
    };
  } else if (value < 0.6) {
    return {
      tone: "neutral",
      text: "Respaldo del peso en USD es moderado",
    };
  } else {
    return {
      tone: "positivo",
      text: "Respaldo del peso en USD es sólido",
    };
  }
}

/**
 * Interpret FX volatility
 */
function interpretFXVolatility(value: number, metadata: Record<string, any>): Interpretation {
  const ma30 = metadata.ma30;
  
  if (ma30 && value > ma30 * 1.2) {
    return {
      tone: "negativo",
      text: "Volatilidad del dólar acelerando",
    };
  } else if (value > 0.05) {
    return {
      tone: "negativo",
      text: "Alta volatilidad en el mercado cambiario",
    };
  } else {
    return {
      tone: "neutral",
      text: "Volatilidad cambiaria normal",
    };
  }
}

/**
 * Interpret FX trend
 */
function interpretFXTrend(value: number): Interpretation {
  if (value > 0.02) {
    return {
      tone: "negativo",
      text: "Tendencia alcista del dólar acelerando",
    };
  } else if (value < -0.02) {
    return {
      tone: "positivo",
      text: "Tendencia bajista del dólar",
    };
  } else {
    return {
      tone: "neutral",
      text: "Tendencia del dólar estable",
    };
  }
}

/**
 * Interpret data freshness
 */
function interpretDataFreshness(value: number, metadata: Record<string, any>): Interpretation {
  const hoursAgo = value;
  
  if (hoursAgo > 24) {
    return {
      tone: "negativo",
      text: "Datos desactualizados",
    };
  } else if (hoursAgo > 6) {
    return {
      tone: "negativo",
      text: "Datos con retraso",
    };
  } else {
    return {
      tone: "positivo",
      text: "Datos actualizados",
    };
  }
}
