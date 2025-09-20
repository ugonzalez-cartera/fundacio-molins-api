import { ValidationError } from '@/shared/errors.js'

export class Position {
  private readonly value: string

  constructor(value: string) {
    this.validateCharge(value)
    this.value = value.trim()
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

  getValue(): string {
    return this.value
  }
}
