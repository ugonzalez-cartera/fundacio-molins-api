import { IUser } from '@/shared/domain/user/user.interface.js'
import { Email, GivenName, Role } from '@/shared/domain/user/value-objects/index.js'

export abstract class User implements IUser {
  private _role: Role
  private _email: Email
  private _givenName: GivenName
  private _familyName: GivenName

  constructor(
    givenName: string,
    familyName: string,
    email: string,
    role: string,
  ) {
    this._role = new Role(role)
    this._email = new Email(email)
    this._givenName = new GivenName(givenName)
    this._familyName = new GivenName(familyName)
  }
  get role(): string {
    return this._role.getValue()
  }

  set role(value: string) {
    this._role = new Role(value)
  }

  get email(): string {
    return this._email.getValue()
  }

  set email(value: string) {
    this._email = new Email(value)
  }

  get givenName(): string {
    return this._givenName.getValue()
  }

  set givenName(value: string) {
    this._givenName = new GivenName(value)
  }

  get familyName(): string {
    return this._familyName.getValue()
  }

  set familyName(value: string) {
    this._familyName = new GivenName(value)
  }
}
