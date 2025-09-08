import { ValidationError } from '../../../common/errors.js'


export class Role {
  private readonly role: string
  constructor(role: string) {
    this.validateRole(role)
    this.role = role
  }

  private validateRole(role: string): void {
    enum RoleEnum {
      ADMIN = 'admin',
      PATRON = 'patron',
    }
    const validRoles = [RoleEnum.ADMIN, RoleEnum.PATRON]
    if (!validRoles.includes(role as RoleEnum)) {
      throw new ValidationError(`Invalid role: ${role}`)
    }
  }

  getValue(): string {
    return this.role
  }
}
