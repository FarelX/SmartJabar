import { describe, it, expect } from 'vitest'
import { sanitizeString, isValidNip, isValidUrl, isValidEmail, isWithinLength } from './validation'

describe('Validation & Sanitization Helpers', () => {
  describe('sanitizeString', () => {
    it('should trim leading and trailing whitespaces', () => {
      expect(sanitizeString('  Jabar Juara  ')).toBe('Jabar Juara')
    })

    it('should strip angle brackets to prevent simple HTML/XSS injection', () => {
      expect(sanitizeString('<script>alert(1)</script>')).toBe('scriptalert(1)/script')
      expect(sanitizeString('Halo <b>ASN</b>')).toBe('Halo bASN/b')
    })

    it('should handle empty, undefined, or null input gracefully', () => {
      expect(sanitizeString('')).toBe('')
      expect(sanitizeString(null)).toBe('')
      expect(sanitizeString(undefined)).toBe('')
    })
  })

  describe('isValidNip', () => {
    it('should accept valid 18-digit ASN NIP', () => {
      expect(isValidNip('198503152010011002')).toBe(true)
      expect(isValidNip('199001012015022001')).toBe(true)
    })

    it('should accept 8-18 digit numeric identifiers', () => {
      expect(isValidNip('12345678')).toBe(true)
      expect(isValidNip('123456789012')).toBe(true)
    })

    it('should reject non-numeric characters or invalid length', () => {
      expect(isValidNip('19850315201001100A')).toBe(false)
      expect(isValidNip('12345')).toBe(false) // Too short
      expect(isValidNip('')).toBe(false)
      expect(isValidNip('abc-123')).toBe(false)
    })
  })

  describe('isValidUrl', () => {
    it('should accept valid http and https URLs', () => {
      expect(isValidUrl('https://jabarprov.go.id')).toBe(true)
      expect(isValidUrl('http://localhost:8000/api')).toBe(true)
      expect(isValidUrl('https://sidebar.jabarprov.go.id/dashboard')).toBe(true)
    })

    it('should reject dangerous javascript: or malformed protocols', () => {
      expect(isValidUrl('javascript:alert(1)')).toBe(false)
      expect(isValidUrl('data:text/html,<script>alert(1)</script>')).toBe(false)
      expect(isValidUrl('not-a-valid-url')).toBe(false)
      expect(isValidUrl('')).toBe(false)
    })

    it('should accept relative paths when allowRelative is true', () => {
      expect(isValidUrl('/logo-layanan/sidebar.webp', true)).toBe(true)
      expect(isValidUrl('/assets/icon.png', true)).toBe(true)
      expect(isValidUrl('/logo-layanan/sidebar.webp', false)).toBe(false)
    })
  })

  describe('isValidEmail', () => {
    it('should validate proper email formats', () => {
      expect(isValidEmail('asn@jabarprov.go.id')).toBe(true)
      expect(isValidEmail('diskominfo.admin@gmail.com')).toBe(true)
    })

    it('should reject invalid email formats', () => {
      expect(isValidEmail('plainaddress')).toBe(false)
      expect(isValidEmail('@missingusername.com')).toBe(false)
      expect(isValidEmail('asn@jabarprov')).toBe(false)
      expect(isValidEmail('')).toBe(false)
    })
  })

  describe('isWithinLength', () => {
    it('should check minimum and maximum string lengths correctly', () => {
      expect(isWithinLength('Smart Jabar', 1, 50)).toBe(true)
      expect(isWithinLength('', 1, 50)).toBe(false)
      expect(isWithinLength('A'.repeat(300), 1, 255)).toBe(false)
    })
  })
})
