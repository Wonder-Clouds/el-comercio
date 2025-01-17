import { format } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Formats a date to "Lunes, 17 de enero del 2025" style.
 * @param {string | Date} date - The date to format, can be a string or a Date object.
 * @returns {string} - The formatted date.
 */
const formatSpanishDate = (date: string | Date): string => {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  return format(parsedDate, "EEEE, d 'de' MMMM 'del' yyyy", { locale: es });
};

export default formatSpanishDate;
