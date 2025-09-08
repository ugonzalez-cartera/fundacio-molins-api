import { ValidationError } from '../../../common/errors.js'

const EMAIL_REGEX = new RegExp([
  '^[a-zA-Z0-9.!#$%&\'*+/=?^_`{|}~-]+@',
  '[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?',
  '(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$',
].join(''))

export class Email {
  private readonly value: string

  constructor(value: string) {
    this.validateEmail(value)
    this.value = this.normalize(value)
  }

  private validateEmail(value: string): void {
    if (!value || typeof value !== 'string') {
      throw new ValidationError('Email cannot be empty')
    }

    const trimmed = value.trim()
    if (trimmed.length === 0) {
      throw new ValidationError('Email cannot be only whitespace')
    }

    if (trimmed.length > 254) {
      throw new ValidationError('Email cannot exceed 254 characters')
    }

    // RFC 5322 compliant email regex (simplified but robust)
    if (!EMAIL_REGEX.test(trimmed)) {
      throw new ValidationError('Invalid email format')
    }

    // Check for consecutive dots
    if (trimmed.includes('..')) {
      throw new ValidationError('Email cannot contain consecutive dots')
    }

    // Check for valid domain
    const [, domain] = trimmed.split('@')
    if (!domain || domain.length < 2) {
      throw new ValidationError('Email must have a valid domain')
    }
  }

  private normalize(value: string): string {
    return value.trim().toLowerCase()
  }

  getValue(): string {
    return this.value
  }

  getDomain(): string {
    return this.value.split('@')[1]
  }

  getLocalPart(): string {
    return this.value.split('@')[0]
  }

  equals(other: Email): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}
