export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode = 400,
  ) {
    super(message)
    this.name = 'DomainError'
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400)
    this.name = 'ValidationError'
  }
}

export class BusinessRuleError extends DomainError {
  constructor(message: string) {
    super(message, 'BUSINESS_RULE_ERROR', 400)
    this.name = 'BusinessRuleError'
  }
}

export class DatabaseError extends DomainError {
  constructor(message: string, originalError?: Error) {
    super(message, 'DATABASE_ERROR', 500)
    this.name = 'DatabaseError'
    if (originalError) {
      this.stack = originalError.stack
    }
  }
}

export class NotFoundError extends DomainError {
  constructor(resource: string, id?: string) {
    const message = id
      ? `${resource} with id '${id}' not found`
      : `${resource} not found`
    super(message, 'NOT_FOUND', 404)
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends DomainError {
  constructor(message: string) {
    super(message, 'CONFLICT', 409)
    this.name = 'ConflictError'
  }
}

// Utility function to safely extract error message from unknown error
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }

  return 'An unknown error occurred'
}

// Type guard to check if error is an Error instance
export function isError(error: unknown): error is Error {
  return error instanceof Error
}
