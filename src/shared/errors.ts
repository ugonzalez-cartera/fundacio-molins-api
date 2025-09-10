import { FastifyReply } from 'fastify'

export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message)
    this.name = 'DomainError'
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR')
    this.name = 'ValidationError'
  }
}

export class BusinessRuleError extends DomainError {
  constructor(message: string) {
    super(message, 'BUSINESS_RULE_ERROR')
    this.name = 'BusinessRuleError'
  }
}

// Context-specific domain errors
export class PatronDomainError extends DomainError {
  constructor(message: string, code: string) {
    super(`[Patron Context] ${message}`, code)
    this.name = 'PatronDomainError'
  }
}

// Specific business rule violations

export class InvalidEmailDomainError extends ValidationError {
  constructor(email: string) {
    super(`Invalid email format: ${email}`)
    this.name = 'InvalidEmailDomainError'
  }
}

export class InvalidRoleError extends ValidationError {
  constructor(role: string) {
    super(`Invalid role: ${role}`)
    this.name = 'InvalidRoleError'
  }
}

// Infrastructure Errors (with HTTP status codes for infrastructure layer)
export class DatabaseError extends Error {
  constructor(message: string, originalError?: Error) {
    super(message)
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
    super(message, 'NOT_FOUND')
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends DomainError {
  constructor(message: string) {
    super(message, 'CONFLICT')
    this.name = 'ConflictError'
  }
}

// HTTP Status Code Mapping for Infrastructure Layer
export const ErrorHttpStatusMap = {
  VALIDATION_ERROR: 400,
  BUSINESS_RULE_ERROR: 400,
  PATRON_RENEWAL_ERROR: 400,
  NOT_FOUND: 404,
  CONFLICT: 409,
  DATABASE_ERROR: 500,
} as const

export function getHttpStatusForError(error: Error): number {
  if (isDomainError(error)) {
    return ErrorHttpStatusMap[error.code as keyof typeof ErrorHttpStatusMap] || 400
  }
  if (isInfrastructureError(error)) {
    return 500
  }
  return 500
}

// Additional utility for error classification
export function isDomainError(error: unknown): error is DomainError {
  return error instanceof DomainError
}

export function isInfrastructureError(error: unknown): error is DatabaseError {
  return error instanceof DatabaseError
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


// ...existing code...

// HTTP Error Handler for Controllers
export interface ErrorResponse {
  success: false
  error: string
  code: string
  timestamp: string
  path: string
  method: string
}

export function handleHttpError(
  error: unknown,
  reply: FastifyReply,
  context: string,
  controllerName?: string,
): void {
  const logPrefix = controllerName ? `[${controllerName}]` : '[Controller]'

  // Log error with context for debugging
  console.error(`${logPrefix} ${context}:`, error)

  let statusCode = 500
  let errorMessage = 'Internal server error'
  let errorCode = 'INTERNAL_ERROR'

  if (isDomainError(error)) {
    // Handle domain errors with proper HTTP status mapping
    statusCode = getHttpStatusForError(error)
    errorMessage = error.message
    errorCode = error.code

    // Log domain errors as warnings (not critical system errors)
    console.warn(`${logPrefix} Domain Error - ${context}:`, {
      code: error.code,
      message: error.message,
      name: error.name,
    })
  } else if (isInfrastructureError(error)) {
    // Handle infrastructure errors (database, external services)
    statusCode = getHttpStatusForError(error)
    errorMessage = error.message
    errorCode = 'DATABASE_ERROR'

    // Log infrastructure errors as errors (system issues)
    console.error(`${logPrefix} Infrastructure Error - ${context}:`, {
      message: error.message,
      name: error.name,
      stack: error.stack,
    })
  } else {
    // Handle unexpected errors
    errorMessage = getErrorMessage(error)

    // Log unexpected errors as critical errors
    console.error(`${logPrefix} Unexpected Error - ${context}:`, {
      error,
      message: errorMessage,
      type: typeof error,
    })
  }

  // Send consistent error response
  const errorResponse: ErrorResponse = {
    success: false,
    error: errorMessage,
    code: errorCode,
    timestamp: new Date().toISOString(),
    path: reply.request.url,
    method: reply.request.method,
  }

  reply.code(statusCode).send(errorResponse)
}
