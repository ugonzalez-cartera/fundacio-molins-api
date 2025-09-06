import { ValidationError } from '../../../../infrastructure/common/error-utils.js'

export class PatronId {
  private readonly value: string

  constructor(value: string) {
    this.validateId(value)
    this.value = value
  }

  private validateId(value: string): void {
    if (!value || typeof value !== 'string') {
      throw new ValidationError('PatronId cannot be empty')
    }

    if (value.trim().length === 0) {
      throw new ValidationError('PatronId cannot be only whitespace')
    }

    // MongoDB ObjectId validation (24 hex characters)
    if (value.length === 24 && /^[a-fA-F0-9]{24}$/.test(value)) {
      return
    }

    // UUID validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (uuidRegex.test(value)) {
      return
    }

    throw new ValidationError('PatronId must be a valid ObjectId or UUID')
  }

  getValue(): string {
    return this.value
  }

  equals(other: PatronId): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}
