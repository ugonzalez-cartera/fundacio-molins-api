import { ValidationError } from '@/shared/errors.js'

export class Role {
  private role: string
  constructor(role: string) {
    this.validateRole(role)
    this.role = role
  }

  private validateRole(role: string): void {
    type Role = 'admin' | 'patron'
    const validRoles: Role[] = ['admin', 'patron']
    if (!validRoles.includes(role as Role)) {
      throw new ValidationError(`Invalid role: ${role}`)
    }
  }

  getValue(): string {
    return this.role
  }
}
