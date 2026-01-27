/**
 * Date and time utilities for Finnish locale
 * All operations use Europe/Helsinki timezone
 */

const TIMEZONE = 'Europe/Helsinki';

/**
 * Get current date in Helsinki timezone
 */
export function getCurrentHelsinkiDate(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: TIMEZONE }));
}

/**
 * Format date as Finnish full date string
 * Example: "Tiistai 27. tammikuuta 2026"
 */
export function formatFinnishDate(date: Date): string {
  const weekdays = [
    'Sunnuntai', 'Maanantai', 'Tiistai', 'Keskiviikko',
    'Torstai', 'Perjantai', 'Lauantai'
  ];
  
  const months = [
    'tammikuuta', 'helmikuuta', 'maaliskuuta', 'huhtikuuta',
    'toukokuuta', 'kesäkuuta', 'heinäkuuta', 'elokuuta',
    'syyskuuta', 'lokakuuta', 'marraskuuta', 'joulukuuta'
  ];
  
  const weekday = weekdays[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${weekday} ${day}. ${month} ${year}`;
}

/**
 * Format time as HH:MM
 */
export function formatTime(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${hours}:${minutes}`;
}

/**
 * Calculate hours and minutes from total hours
 */
export function formatDuration(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  
  return `${h} h ${m} min`;
}

/**
 * Get date key for namedays lookup (M-D format)
 */
export function getDateKey(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}-${day}`;
}

/**
 * Calculate milliseconds until next midnight in Helsinki timezone
 */
export function getMillisecondsUntilMidnight(): number {
  const now = getCurrentHelsinkiDate();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  return tomorrow.getTime() - now.getTime();
}
