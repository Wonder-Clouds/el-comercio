/**
 * Formats a date string from 'YYYY-MM-DD' to Spanish format
 * Example: '2025-02-03' -> 'Domingo, 3 de febrero del 2025'
 * @param dateStr Date string in 'YYYY-MM-DD' format
 * @returns Formatted date string in Spanish with full day name, day, month, and year
 */
function formatDateToSpanish(dateStr: string): string {
  // Spanish day names starting from Sunday
  const days = [
      'Domingo', 'Lunes', 'Martes', 'Miércoles',
      'Jueves', 'Viernes', 'Sábado'
  ];

  // Spanish month names starting from January
  const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];

  // Parse the date string and create a UTC date to avoid timezone issues
  const [year, month, day] = dateStr.split('-').map(num => parseInt(num, 10));
  const date = new Date(Date.UTC(year, month - 1, day));
  
  // Get date components using UTC methods to ensure consistency
  const dayName = days[date.getUTCDay()];
  const dayOfMonth = date.getUTCDate();
  const monthName = months[date.getUTCMonth()];
  const yearNum = date.getUTCFullYear();

  // Build the formatted string in Spanish format
  return `${dayName}, ${dayOfMonth} de ${monthName} del ${yearNum}`;
}

/**
* Validates if the provided string is a valid date in YYYY-MM-DD format
* @param dateStr Date string to validate
* @returns boolean indicating if the date is valid
*/
function isValidDate(dateStr: string): boolean {
  // Check if the string matches YYYY-MM-DD pattern
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return false;
  }
  
  // Parse date components and verify they're valid
  const [year, month, day] = dateStr.split('-').map(num => parseInt(num, 10));
  const date = new Date(Date.UTC(year, month - 1, day));
  
  // Ensure the date components match the input
  // This catches invalid dates like 2025-02-31
  return date.getUTCFullYear() === year &&
         date.getUTCMonth() === month - 1 &&
         date.getUTCDate() === day;
}

/**
* Safe version of formatDateToSpanish with error handling
* @param dateStr Date string in YYYY-MM-DD format
* @returns Formatted date string in Spanish
* @throws Error if the date is invalid
*/
function formatDateToSpanishSafe(dateStr: string): string {
  if (!isValidDate(dateStr)) {
      throw new Error('Invalid date. Please use YYYY-MM-DD format');
  }
  return formatDateToSpanish(dateStr);
}

function formatDateToYYYYMMDD (date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Asegura que tenga dos dígitos
  const day = String(date.getDate()).padStart(2, '0'); // Asegura que tenga dos dígitos
  return `${year}-${month}-${day}`;
};

export {formatDateToSpanishSafe, formatDateToYYYYMMDD};