/**
 * Utility functions for date formatting and manipulation
 */

/**
 * Format a date to Mongolian locale
 */
export function formatMongolianDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('mn-MN');
}

/**
 * Format a date with options for Mongolian locale
 */
export function formatMongolianDateWithOptions(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {}
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('mn-MN', options);
}

/**
 * Format date for restaurant display (short format)
 */
export function formatRestaurantDate(date: string | Date): string {
  return formatMongolianDateWithOptions(date, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Get relative time (e.g., "2 days ago")
 */
export function getRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Өнөөдөр';
  if (diffInDays === 1) return 'Өчигдөр';
  if (diffInDays < 7) return `${diffInDays} хоногийн өмнө`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} долоо хоногийн өмнө`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} сарын өмнө`;
  return `${Math.floor(diffInDays / 365)} жилийн өмнө`;
}