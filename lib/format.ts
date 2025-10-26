/**
 * Value formatting utilities
 */

/**
 * Format numeric value with appropriate units and separators
 */
export function formatValue(value: number | null, unit?: string): string {
  if (value === null || isNaN(value)) {
    return "N/A";
  }

  // Handle percentage values
  if (unit === "percent" || unit?.includes("%")) {
    return `${value.toFixed(1)}%`;
  }

  // Handle million ARS values
  if (unit === "million_ARS" || unit?.includes("million")) {
    return `${(value / 1000000).toFixed(1)}M ARS`;
  }

  // Handle billion ARS values
  if (unit?.includes("billion")) {
    return `${(value / 1000000000).toFixed(1)}B ARS`;
  }

  // Handle USD values
  if (unit?.includes("USD") || unit?.includes("usd")) {
    return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  // Default formatting with thousands separator
  return value.toLocaleString("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

/**
 * Format large numbers with appropriate suffixes
 */
export function formatLargeNumber(value: number): string {
  if (Math.abs(value) >= 1e9) {
    return `${(value / 1e9).toFixed(1)}B`;
  } else if (Math.abs(value) >= 1e6) {
    return `${(value / 1e6).toFixed(1)}M`;
  } else if (Math.abs(value) >= 1e3) {
    return `${(value / 1e3).toFixed(1)}K`;
  } else {
    return value.toFixed(1);
  }
}

/**
 * Format percentage change
 */
export function formatPercentageChange(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}
