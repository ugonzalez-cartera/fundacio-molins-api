import type { IPatron } from './patron.interface.js'
import { Email, PatronName, Charge } from './value-objects/index.js'
import { Role } from '../user/value-objects/role.js'
import { ValidationError } from '../../../infrastructure/common/error-utils.js'

/**
 * Patron Domain Entity - Aggregate Root
 * Represents a board member or patron of the foundation
 */
export class Patron implements IPatron {
  private _email: Email
  private _givenName: PatronName
  private _familyName: PatronName
  private _role: Role
  private _charge: Charge
  private _renovationDate: Date
  private _endingDate: Date

  private constructor(
    email: Email,
    givenName: PatronName,
    familyName: PatronName,
    role: Role,
    charge: Charge,
    renovationDate: Date,
    endingDate: Date,
  ) {
    this._email = email
    this._givenName = givenName
    this._familyName = familyName
    this._role = role
    this._charge = charge
    this._renovationDate = renovationDate
    this._endingDate = endingDate
    this.validateDates(renovationDate, endingDate)
  }

  static create(params: {
    email: string
    givenName: string
    familyName: string
    role: string
    charge: string
    renovationDate: Date
    endingDate: Date
  }): Patron {
    return new Patron(
      new Email(params.email),
      new PatronName(params.givenName),
      new PatronName(params.familyName),
      new Role(params.role),
      new Charge(params.charge),
      params.renovationDate,
      params.endingDate,
    )
  }

  static fromPrimitives(data: {
    id?: string
    email: string
    givenName: string
    familyName: string
    role: string
    charge: string
    renovationDate: Date
    endingDate: Date
  }): Patron {
    return new Patron(
      new Email(data.email),
      new PatronName(data.givenName),
      new PatronName(data.familyName),
      new Role(data.role),
      new Charge(data.charge),
      data.renovationDate,
      data.endingDate,
    )
  }

  // Business logic methods
  private validateDates(renovationDate: Date, endingDate: Date): void {
    if (renovationDate >= endingDate) {
      // Decide business logic
    }
  }

  isActive(): boolean {
    const now = new Date()
    return now >= this._renovationDate && now <= this._endingDate
  }

  canBeRenewed(): boolean {
    const now = new Date()
    const renewalPeriod = new Date(this._endingDate)
    renewalPeriod.setFullYear(renewalPeriod.getFullYear() - 4) // Max 4 years
    return now >= renewalPeriod
  }

  renew(newEndingDate: Date): Patron {
    if (!this.canBeRenewed()) {
      throw new ValidationError('Patron cannot be renewed yet')
    }

    return new Patron(
      this._email,
      this._givenName,
      this._familyName,
      this._role,
      this._charge,
      new Date(), // New renovation date is today
      newEndingDate,
    )
  }

  // Getters for all fields

  get email(): string {
    return this._email.getValue()
  }

  get givenName(): string {
    return this._givenName.getValue()
  }

  get familyName(): string {
    return this._familyName.getValue()
  }

  get role(): string {
    return this._role.getValue()
  }

  get charge(): string {
    return this._charge.getValue()
  }

  get renovationDate(): Date {
    return new Date(this._renovationDate)
  }

  get endingDate(): Date {
    return new Date(this._endingDate)
  }

  // Setters for editable fields (all except id)
  set email(value: string) {
    this._email = new Email(value)
  }

  set givenName(value: string) {
    this._givenName = new PatronName(value)
  }

  set familyName(value: string) {
    this._familyName = new PatronName(value)
  }

  set role(value: string) {
    this._role = value
  }

  set charge(value: string) {
    this._charge = new Charge(value)
  }

  set renovationDate(value: Date) {
    this.validateDates(value, this._endingDate)
    this._renovationDate = value
  }

  set endingDate(value: Date) {
    this.validateDates(this._renovationDate, value)
    this._endingDate = value
  }

  // Value object getters for rich domain behavior
  get emailVO(): Email {
    return this._email
  }

  get givenNameVO(): PatronName {
    return this._givenName
  }

  get familyNameVO(): PatronName {
    return this._familyName
  }

  get chargeVO(): Charge {
    return this._charge
  }

  // Convert to primitives for persistence
  toPrimitives(): {
    email: string
    givenName: string
    familyName: string
    role: string
    charge: string
    renovationDate: Date
    endingDate: Date
    } {
    return {
      email: this.email,
      givenName: this.givenName,
      familyName: this.familyName,
      role: this.role,
      charge: this.charge,
      renovationDate: this.renovationDate,
      endingDate: this.endingDate,
    }
  }

  equals(other: Patron): boolean {
    return (
      this.email === other.email &&
      this.givenName === other.givenName &&
      this.familyName === other.familyName
    )
  }
}
