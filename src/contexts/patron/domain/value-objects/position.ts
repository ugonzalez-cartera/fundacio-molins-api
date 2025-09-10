import { ValidationError } from '@/shared/errors.js'

export class Position {
  private readonly value: string

  constructor(value: string) {
    this.validateCharge(value)
    this.value = this.normalize(value)
  }

  private validateCharge(value: string): void {
    if (!value || typeof value !== 'string') {
      throw new ValidationError('Position cannot be empty')
    }

    const trimmed = value.trim()
    if (trimmed.length === 0) {
      throw new ValidationError('Position cannot be only whitespace')
    }

    if (trimmed.length < 2) {
      throw new ValidationError('Position must be at least 2 characters long')
    }

    if (trimmed.length > 100) {
      throw new ValidationError('Position cannot exceed 100 characters')
    }

    // Foundation-specific position validation
    const invalidCharRegex = /[@#$%^&*+=|\\<>{}[\]]/
    if (invalidCharRegex.test(trimmed)) {
      throw new ValidationError('Position contains invalid characters')
    }
  }

  private normalize(value: string): string {
    return value
      .trim()
      .replace(/\s+/g, ' ')
      .split(' ')
      .map((word, index) => {
        // Don't capitalize certain prepositions unless they're the first word
        const lowercaseWords = ['of', 'the', 'and', 'or', 'de', 'del', 'la', 'el', 'y', 'e', 'o', 'u', 'en', 'con', 'por', 'para']
        if (index > 0 && lowercaseWords.includes(word.toLowerCase())) {
          return word.toLowerCase()
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      })
      .join(' ')
  }

  getValue(): string {
    return this.value
  }

  equals(other: Position): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }

  // Foundation-specific business logic
  getAbbreviation(): string {
    const excludeWords = ['of', 'the', 'and', 'or', 'de', 'del', 'la', 'el', 'y', 'e', 'o', 'u', 'en', 'con', 'por', 'para']
    return this.value
      .split(' ')
      .filter(word => {
        const cleanWord = word.replace(/[()]/g, '').toLowerCase()
        return word.length > 2 && !excludeWords.includes(cleanWord)
      })
      .map(word => word.charAt(0).toUpperCase())
      .join('')
  }
}
