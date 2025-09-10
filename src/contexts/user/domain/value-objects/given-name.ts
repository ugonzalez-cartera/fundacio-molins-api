import { ValidationError } from '@/shared/errors.js'

export class GivenName {
  private value: string

  constructor(value: string) {
    this.validateName(value)
    this.value = this.normalize(value)
  }

  private validateName(value: string): void {
    if (!value || typeof value !== 'string') {
      throw new ValidationError('Name cannot be empty')
    }

    const trimmed = value.trim()
    if (trimmed.length === 0) {
      throw new ValidationError('Name cannot be only whitespace')
    }

    if (trimmed.length < 2) {
      throw new ValidationError('Name must be at least 2 characters long')
    }

    if (trimmed.length > 100) {
      throw new ValidationError('Name cannot exceed 100 characters')
    }

    // Allow letters, spaces, hyphens, apostrophes, and dots (for international names)
    const nameRegex = /^[a-zA-ZÀ-ÿĀ-žА-я\s.'-]+$/
    if (!nameRegex.test(trimmed)) {
      throw new ValidationError('Name contains invalid characters')
    }

    // Prevent consecutive spaces, dots, or hyphens
    if (/[\s.'-]{2,}/.test(trimmed)) {
      throw new ValidationError('Name cannot contain consecutive special characters')
    }

    // Name cannot start or end with special characters
    if (/^[\s.'-]|[\s.'-]$/.test(trimmed)) {
      throw new ValidationError('Name cannot start or end with special characters')
    }
  }

  private normalize(value: string): string {
    return value
      .trim()
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  getValue(): string {
    return this.value
  }

  getFirstName(): string {
    return this.value.split(' ')[0]
  }

  getLastName(): string {
    const parts = this.value.split(' ')
    return parts.length > 1 ? parts[parts.length - 1] : ''
  }

  getInitials(): string {
    return this.value
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
  }

  equals(other: GivenName): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}
