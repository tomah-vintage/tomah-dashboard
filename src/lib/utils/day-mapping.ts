/**
 * Day mapping utilities for consistent day-of-week handling
 * Uses ISO 8601 standard: Monday = 1, Sunday = 7
 */

export const DAY_MAPPING: { [key: string]: number } = {
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  sunday: 7,
};

export const REVERSE_DAY_MAPPING: { [key: number]: string } = {
  1: "monday",
  2: "tuesday", 
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
  7: "sunday",
};

export const DAY_NAMES_MN: { [key: string]: string } = {
  monday: "Даваа",
  tuesday: "Мягмар",
  wednesday: "Лхагва", 
  thursday: "Пүрэв",
  friday: "Баасан",
  saturday: "Бямба",
  sunday: "Ням"
};

/**
 * Convert day ID to day number (ISO 8601)
 * @param dayId - Day identifier (e.g., "monday")
 * @returns Day number (1-7) or undefined if invalid
 */
export function dayIdToNumber(dayId: string): number | undefined {
  return DAY_MAPPING[dayId];
}

/**
 * Convert day number to day ID
 * @param dayNumber - Day number (1-7) 
 * @returns Day identifier (e.g., "monday") or undefined if invalid
 */
export function dayNumberToId(dayNumber: number): string | undefined {
  return REVERSE_DAY_MAPPING[dayNumber];
}

/**
 * Get Mongolian day name
 * @param dayId - Day identifier (e.g., "monday")
 * @returns Mongolian day name or undefined if invalid
 */
export function getMongolianDayName(dayId: string): string | undefined {
  return DAY_NAMES_MN[dayId];
}