import { ValidationError } from '../../../../infrastructure/common/error-utils.js'

export enum PatronRoleType {
  PRESIDENT = 'president',
  VICE_PRESIDENT = 'vice_president',
  SECRETARY = 'secretary',
  TREASURER = 'treasurer',
  VOCAL = 'vocal',
  HONORARY_PRESIDENT = 'honorary_president',
  FOUNDING_MEMBER = 'founding_member',
  REGULAR_MEMBER = 'regular_member',
}

export class PatronRole {
  private readonly value: PatronRoleType

  constructor(value: string | PatronRoleType) {
    this.validateRole(value)
    this.value = this.normalizeRole(value)
  }

  private validateRole(value: string | PatronRoleType): void {
    if (!value) {
      throw new ValidationError('Patron role cannot be empty')
    }

    const stringValue = typeof value === 'string' ? value : String(value)
    const normalizedValue = stringValue.toLowerCase().trim()

    const validRoles = Object.values(PatronRoleType)
    if (!validRoles.includes(normalizedValue as PatronRoleType)) {
      throw new ValidationError(`Invalid patron role: ${value}. Valid roles are: ${validRoles.join(', ')}`)
    }
  }

  private normalizeRole(value: string | PatronRoleType): PatronRoleType {
    const stringValue = typeof value === 'string' ? value : String(value)
    return stringValue.toLowerCase().trim() as PatronRoleType
  }

  getValue(): PatronRoleType {
    return this.value
  }

  getDisplayName(): string {
    const roleNames = {
      [PatronRoleType.PRESIDENT]: 'President',
      [PatronRoleType.VICE_PRESIDENT]: 'Vice President',
      [PatronRoleType.SECRETARY]: 'Secretary',
      [PatronRoleType.TREASURER]: 'Treasurer',
      [PatronRoleType.VOCAL]: 'Vocal',
      [PatronRoleType.HONORARY_PRESIDENT]: 'Honorary President',
      [PatronRoleType.FOUNDING_MEMBER]: 'Founding Member',
      [PatronRoleType.REGULAR_MEMBER]: 'Regular Member',
    }
    return roleNames[this.value]
  }

  isExecutive(): boolean {
    const executiveRoles = [
      PatronRoleType.PRESIDENT,
      PatronRoleType.VICE_PRESIDENT,
      PatronRoleType.SECRETARY,
      PatronRoleType.TREASURER,
    ]
    return executiveRoles.includes(this.value)
  }

  isHonorary(): boolean {
    const honoraryRoles = [
      PatronRoleType.HONORARY_PRESIDENT,
      PatronRoleType.FOUNDING_MEMBER,
    ]
    return honoraryRoles.includes(this.value)
  }

  hasVotingRights(): boolean {
    // All roles except honorary have voting rights
    return !this.isHonorary()
  }

  canSignDocuments(): boolean {
    const signingRoles = [
      PatronRoleType.PRESIDENT,
      PatronRoleType.VICE_PRESIDENT,
      PatronRoleType.SECRETARY,
    ]
    return signingRoles.includes(this.value)
  }

  equals(other: PatronRole): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}
