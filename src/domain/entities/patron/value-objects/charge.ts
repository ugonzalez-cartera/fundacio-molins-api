import { ValidationError } from '@/infrastructure/common/error-utils.js'

export class Charge {
  private readonly value: string

  constructor(value: string) {
    this.validateCharge(value)
    this.value = this.normalize(value)
  }

  private validateCharge(value: string): void {
    if (!value || typeof value !== 'string') {
      throw new ValidationError('Charge cannot be empty')
    }

    const trimmed = value.trim()
    if (trimmed.length === 0) {
      throw new ValidationError('Charge cannot be only whitespace')
    }

    if (trimmed.length < 2) {
      throw new ValidationError('Charge must be at least 2 characters long')
    }

    if (trimmed.length > 100) {
      throw new ValidationError('Charge cannot exceed 100 characters')
    }

    // Allow letters, numbers, spaces, hyphens, apostrophes, dots, and parentheses
    const chargeRegex = /^[a-zA-ZÀ-ÿĀ-žА-я0-9\s.'-()]+$/
    if (!chargeRegex.test(trimmed)) {
      throw new ValidationError('Charge contains invalid characters')
    }

    // Prevent consecutive spaces or special characters
    if (/[\s.'-()]{2,}/.test(trimmed)) {
      throw new ValidationError('Charge cannot contain consecutive special characters')
    }

    // Charge cannot start or end with special characters (except parentheses)
    if (/^[\s.'-]|[\s.'-]$/.test(trimmed)) {
      throw new ValidationError('Charge cannot start or end with spaces or special characters')
    }
  }

  private normalize(value: string): string {
    return value
      .trim()
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .split(' ')
      .map(word => {
        // Don't capitalize words in parentheses or prepositions
        const lowercaseWords = ['de', 'del', 'la', 'el', 'y', 'e', 'o', 'u', 'en', 'con', 'por', 'para']
        if (lowercaseWords.includes(word.toLowerCase()) || word.startsWith('(')) {
          return word.toLowerCase()
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      })
      .join(' ')
  }

  getValue(): string {
    return this.value
  }

  getAbbreviation(): string {
    // Create abbreviation from first letters of significant words
    return this.value
      .split(' ')
      .filter(word => word.length > 2 && !word.startsWith('('))
      .map(word => word.charAt(0).toUpperCase())
      .join('')
  }

  equals(other: Charge): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}
