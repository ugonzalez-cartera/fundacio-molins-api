import { ValidationError } from '../../../common/errors.js'

export class Charge {
  private readonly value: string

  constructor(value: string) {
    this.validateInput(value)
    const normalizedValue = this.preNormalize(value)
    this.validateCharge(normalizedValue)
    this.value = this.normalize(normalizedValue)
  }

  private validateInput(value: string): void {
    if (!value || typeof value !== 'string') {
      throw new ValidationError('Charge cannot be empty')
    }

    const trimmed = value.trim()
    if (trimmed.length === 0) {
      throw new ValidationError('Charge cannot be only whitespace')
    }

    // Check for consecutive special characters (check on trimmed value)
    if (/--+|''+|\.\.+|\s{2,}/.test(trimmed)) {
      throw new ValidationError('Charge cannot contain consecutive special characters')
    }

    // Check for starting/ending with special chars (check original value)
    if (/^[\s.'-]|[\s.'-]$/.test(value)) {
      throw new ValidationError('Charge cannot start or end with spaces or special characters')
    }
  }

  private preNormalize(value: string): string {
    return value.trim().replace(/\s+/g, ' ')
  }

  private validateCharge(value: string): void {
    if (!value || value.length === 0) {
      throw new ValidationError('Charge cannot be empty')
    }

    if (value.length < 2) {
      throw new ValidationError('Charge must be at least 2 characters long')
    }

    if (value.length > 100) {
      throw new ValidationError('Charge cannot exceed 100 characters')
    }

    // Check for invalid characters first (no @, #, $, &, etc.)
    const invalidCharRegex = /[@#$%^&*+=|\\<>{}[\]]/
    if (invalidCharRegex.test(value)) {
      throw new ValidationError('Charge contains invalid characters')
    }

    // Check for consecutive special characters (spaces normalized separately)
    if (/--+|''+|\.\.+/.test(value)) {
      throw new ValidationError('Charge cannot contain consecutive special characters')
    }

    // Charge cannot start or end with hyphens or apostrophes (dots are ok for abbreviations)
    if (/^[-']|[-']$/.test(value)) {
      throw new ValidationError('Charge cannot start or end with spaces or special characters')
    }
  }

  private normalize(value: string): string {
    return value
      .trim()
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .split(' ')
      .map((word, index) => {
        // Handle words in parentheses - keep them lowercase except first letter
        if (word.startsWith('(') && word.endsWith(')')) {
          return `(${word.slice(1, -1).toLowerCase()})`
        }
        if (word.startsWith('(')) {
          return `(${word.slice(1).charAt(0).toUpperCase()}${word.slice(2).toLowerCase()}`
        }
        if (word.endsWith(')')) {
          return `${word.slice(0, -1).toLowerCase()})`
        }

        // Don't capitalize certain prepositions/articles unless they're the first word
        const lowercaseWords = ['of', 'the', 'and', 'or', 'de', 'del', 'la', 'el', 'y', 'e', 'o', 'u', 'en', 'con', 'por', 'para']
        if (index > 0 && lowercaseWords.includes(word.toLowerCase())) {
          return word.toLowerCase()
        }

        // Capitalize the first letter, lowercase the rest
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      })
      .join(' ')
  }

  getValue(): string {
    return this.value
  }

  getAbbreviation(): string {
    // Create abbreviation from first letters of significant words
    // Exclude prepositions and words in parentheses
    const excludeWords = ['of', 'the', 'and', 'or', 'de', 'del', 'la', 'el', 'y', 'e', 'o', 'u', 'en', 'con', 'por', 'para', 'finanzas']
    return this.value
      .split(' ')
      .filter(word => {
        const cleanWord = word.replace(/[()]/g, '').toLowerCase()
        return word.length > 1 && !excludeWords.includes(cleanWord)
      })
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
