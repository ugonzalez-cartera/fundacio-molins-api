import { Roles } from '@/shared/enums/roles.enum.js'
export class Role {
  private role: Roles
  constructor(role: string) {
    this.role = role as Roles
    this.validateRole()
  }

  validateRole(): void {
    const validRoles = Object.values(Roles)
    if (!Object.values(validRoles).includes(this.role)) {
      throw new Error(`Invalid role: ${this.role}`)
    }
  }

  getValue(): string {
    return this.role
  }
}
