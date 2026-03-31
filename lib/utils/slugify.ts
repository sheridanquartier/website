/**
 * Konvertiert einen Text in einen URL-freundlichen Slug
 * - Umlaute werden ersetzt (ä→ae, ö→oe, ü→ue, ß→ss)
 * - Alles wird kleingeschrieben
 * - Sonderzeichen werden entfernt
 * - Spaces werden zu Bindestrichen
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}
