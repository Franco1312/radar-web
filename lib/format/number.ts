/**
 * Number formatting utilities
 */

export function formatPercent(value: number, decimals: number = 1): string {
  if (isNaN(value)) return "N/A";
  
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)}%`;
}

export function formatVolatility(value: number): string {
  if (isNaN(value)) return "N/A";
  
  const percentage = value * 100;
  let label = "";
  
  if (percentage < 1) {
    label = "baja";
  } else if (percentage < 3) {
    label = "normal";
  } else {
    label = "alta";
  }
  
  return `${percentage.toFixed(1)}% (${label})`;
}

export function formatMillionsARS(value: number, decimals: number = 1): string {
  if (isNaN(value)) return "N/A";
  
  const millions = value / 1_000_000;
  return `${millions.toFixed(decimals)}M ARS`;
}

export function formatMillionsUSD(value: number, decimals: number = 1): string {
  if (isNaN(value)) return "N/A";
  
  const millions = value / 1_000_000;
  return `$${millions.toFixed(decimals)}M`;
}

export function formatRatio(value: number, decimals: number = 3): string {
  if (isNaN(value)) return "N/A";
  
  // Para ratios de reservas a base, mostrar como decimal simple
  if (value < 1) {
    return `${value.toFixed(3)}`;
  } else if (value < 10) {
    return `${value.toFixed(2)}`;
  } else {
    return `${value.toFixed(1)}`;
  }
}

export function formatCurrency(value: number, currency: 'ARS' | 'USD' = 'ARS'): string {
  if (isNaN(value)) return "N/A";
  
  const formatter = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  
  return formatter.format(value);
}

export function formatLargeNumber(value: number): string {
  if (isNaN(value)) return "N/A";
  
  const absValue = Math.abs(value);
  
  if (absValue >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  } else if (absValue >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  } else if (absValue >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  } else {
    return value.toFixed(1);
  }
}

export function formatValue(value: number | null, unit?: string): string {
  if (value === null || isNaN(value)) return "N/A";
  
  switch (unit) {
    case 'percent':
    case '%':
      return formatPercent(value);
    case 'ARS':
      return formatCurrency(value, 'ARS');
    case 'USD':
      return formatCurrency(value, 'USD');
    case 'ratio':
      return formatRatio(value);
    case 'volatility':
      return formatVolatility(value);
    default:
      return value.toLocaleString('es-AR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
  }
}
