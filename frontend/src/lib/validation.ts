/**
 * SMART JABAR — Input Validation & Sanitization Helpers
 * 
 * Provides client-side input sanitization and validation utilities
 * to enhance user experience and maintain data cleanliness before sending requests.
 */

/**
 * Sanitizes generic user text input by trimming whitespace
 * and stripping potentially malicious HTML tags or script injection patterns.
 */
export function sanitizeString(input: string | undefined | null): string {
  if (!input) return ''
  return input
    .trim()
    .replace(/[<>]/g, '') // Strip angle brackets to prevent unescaped HTML injection
}

/**
 * Validates Indonesian ASN NIP format (18 numeric digits, e.g. 198503152010011002)
 * or general numeric identifier.
 */
export function isValidNip(nip: string): boolean {
  const clean = nip.trim()
  return /^\d{18}$/.test(clean) || /^\d{8,18}$/.test(clean)
}

/**
 * Validates URLs ensuring strict http or https protocols.
 * Rejects javascript:, data:, or malformed protocols.
 */
export function isValidUrl(url: string, allowRelative = false): boolean {
  if (!url || typeof url !== 'string') return false
  const trimmed = url.trim()

  if (allowRelative && trimmed.startsWith('/')) {
    return true
  }

  try {
    const parsed = new URL(trimmed)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Validates email format.
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

/**
 * Checks string length limits.
 */
export function isWithinLength(str: string, min = 0, max = 255): boolean {
  const len = (str || '').trim().length
  return len >= min && len <= max
}
