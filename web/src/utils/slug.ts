/**
 * Converts a string (name, title) to a URL-safe slug.
 */
export function slugFromString(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9а-яё-]/gi, '')
}
