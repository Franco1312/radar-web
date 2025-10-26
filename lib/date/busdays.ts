/**
 * Business days utilities
 */

/**
 * Check if a date is a business day (Monday to Friday)
 */
export function isBusinessDay(date: Date): boolean {
  const day = date.getDay();
  return day >= 1 && day <= 5; // Monday = 1, Friday = 5
}

/**
 * Get the previous business day
 */
export function getPreviousBusinessDay(date: Date): Date {
  const prevDay = new Date(date);
  prevDay.setDate(date.getDate() - 1);
  
  while (!isBusinessDay(prevDay)) {
    prevDay.setDate(prevDay.getDate() - 1);
  }
  
  return prevDay;
}

/**
 * Get the next business day
 */
export function getNextBusinessDay(date: Date): Date {
  const nextDay = new Date(date);
  nextDay.setDate(date.getDate() + 1);
  
  while (!isBusinessDay(nextDay)) {
    nextDay.setDate(nextDay.getDate() + 1);
  }
  
  return nextDay;
}

/**
 * Count business days between two dates (exclusive)
 */
export function countBusinessDays(start: Date, end: Date): number {
  let count = 0;
  const current = new Date(start);
  
  while (current < end) {
    if (isBusinessDay(current)) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
}

/**
 * Get business days ago from a given date
 */
export function getBusinessDaysAgo(date: Date, days: number): Date {
  let current = new Date(date);
  let remainingDays = days;
  
  while (remainingDays > 0) {
    current = getPreviousBusinessDay(current);
    remainingDays--;
  }
  
  return current;
}

/**
 * Format business days text
 */
export function formatBusinessDays(days: number): string {
  if (days === 1) return "1 día hábil";
  return `${days} días hábiles`;
}

/**
 * Get date range for business days
 */
export function getBusinessDaysRange(days: number): { from: string; to: string } {
  const to = new Date();
  const from = getBusinessDaysAgo(to, days);
  
  return {
    from: from.toISOString(),
    to: to.toISOString(),
  };
}
