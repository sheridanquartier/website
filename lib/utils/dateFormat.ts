import { format, parseISO } from 'date-fns'
import { de } from 'date-fns/locale'

/**
 * Formatiert ein Datum im deutschen Format
 */
export function formatDate(date: string | Date, formatStr: string = 'dd.MM.yyyy'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatStr, { locale: de })
}

/**
 * Formatiert ein Datum mit Uhrzeit
 */
export function formatDateTime(date: string | Date): string {
  return formatDate(date, 'dd.MM.yyyy HH:mm')
}

/**
 * Formatiert nur die Uhrzeit
 */
export function formatTime(date: string | Date): string {
  return formatDate(date, 'HH:mm')
}

/**
 * Formatiert ein Datum in langer Form (z.B. "15. März 2024")
 */
export function formatDateLong(date: string | Date): string {
  return formatDate(date, 'd. MMMM yyyy')
}
