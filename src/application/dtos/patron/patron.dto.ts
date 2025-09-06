// Command DTOs (Input)
export interface CreatePatronCommand {
  charge: string
  name: string
  email: string
  role: string
  renovationDate: Date
  endingDate: Date
}

export interface UpdatePatronCommand {
  charge?: string
  name?: string
  email?: string
  role?: string
  renovationDate?: Date
  endingDate?: Date
}

// Query DTOs (Output)
export interface PatronDto {
  id: string
  charge: string
  name: string
  email: string
  role: string
  renovationDate: Date
  endingDate: Date
  createdAt?: Date
  updatedAt?: Date
}

// Query Filters
export interface PatronFilterDto {
  role?: string
  isExpired?: boolean
  needsRenewal?: boolean
  expiresBefore?: Date
  expiresAfter?: Date
}
