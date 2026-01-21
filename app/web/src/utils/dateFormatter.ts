/**
 * Date formatting utilities for the finance behavioral system
 */

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
] as const;

/**
 * Transforms a date string from "M/D/YYYY" format to "MMM D, YYYY" format
 * 
 * @param dateString - Date string in "M/D/YYYY" format (e.g., "1/1/2001")
 * @returns Formatted date string in "MMM D, YYYY" format (e.g., "Jan 1, 2001")
 * @throws Error if the date string is invalid or cannot be parsed
 * 
 * @example
 * ```ts
 * formatDate("1/1/2001") // Returns "Jan 1, 2001"
 * formatDate("12/25/2023") // Returns "Dec 25, 2023"
 * ```
 */
export function formatDate(dateString: string): string {
  if (!dateString || typeof dateString !== 'string') {
    throw new Error('Invalid date string: must be a non-empty string');
  }

  const parts = dateString.trim().split('/');
  
  if (parts.length !== 3) {
    throw new Error(`Invalid date format: expected "M/D/YYYY", got "${dateString}"`);
  }

  const monthStr = parts[0];
  const dayStr = parts[1];
  const yearStr = parts[2];

  if (!monthStr || !dayStr || !yearStr) {
    throw new Error(`Invalid date format: expected "M/D/YYYY", got "${dateString}"`);
  }
  
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);
  const year = parseInt(yearStr, 10);

  // Validate month
  if (isNaN(month) || month < 1 || month > 12) {
    throw new Error(`Invalid month: ${monthStr}. Must be between 1 and 12`);
  }

  // Validate day
  if (isNaN(day) || day < 1 || day > 31) {
    throw new Error(`Invalid day: ${dayStr}. Must be between 1 and 31`);
  }

  // Validate year
  if (isNaN(year) || yearStr.length !== 4) {
    throw new Error(`Invalid year: ${yearStr}. Must be a 4-digit year`);
  }

  // Additional validation: check if the date is valid (e.g., not Feb 30)
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    throw new Error(`Invalid date: ${dateString} does not represent a valid calendar date`);
  }

  const monthName = MONTH_NAMES[month - 1];
  return `${monthName} ${day}, ${year}`;
}

/**
 * Transforms a date string from "M/D/YYYY" format to "MMM D, YYYY" format
 * Returns null if the date string is invalid instead of throwing an error
 * 
 * @param dateString - Date string in "M/D/YYYY" format (e.g., "1/1/2001")
 * @returns Formatted date string in "MMM D, YYYY" format, or null if invalid
 * 
 * @example
 * ```ts
 * formatDateSafe("1/1/2001") // Returns "Jan 1, 2001"
 * formatDateSafe("invalid") // Returns null
 * ```
 */
export function formatDateSafe(dateString: string): string | null {
  try {
    return formatDate(dateString);
  } catch {
    return null;
  }
}
