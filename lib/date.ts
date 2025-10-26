/**
 * Date utilities for formatting and timezone handling
 */

/**
 * Format timestamp to readable date string
 */
export function formatDate(
  timestamp: string,
  timezone: string = "America/Argentina/Buenos_Aires"
): string {
  try {
    const date = new Date(timestamp);
    
    return new Intl.DateTimeFormat("es-AR", {
      timeZone: timezone,
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch (error) {
    console.warn("[radar-web] Error formatting date:", error);
    return timestamp;
  }
}

/**
 * Get relative time string (e.g., "hace 2 horas")
 */
export function getRelativeTime(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) {
      return "hace un momento";
    } else if (diffMinutes < 60) {
      return `hace ${diffMinutes} min`;
    } else if (diffHours < 24) {
      return `hace ${diffHours}h`;
    } else if (diffDays < 7) {
      return `hace ${diffDays}d`;
    } else {
      return formatDate(timestamp);
    }
  } catch (error) {
    console.warn("[radar-web] Error getting relative time:", error);
    return timestamp;
  }
}

/**
 * Get date range for historical data
 */
export function getDateRange(days: number): { from: string; to: string } {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - days);
  
  return {
    from: from.toISOString(),
    to: to.toISOString(),
  };
}
