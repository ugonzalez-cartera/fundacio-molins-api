import type { IPatron } from './patron.interface.js'
import { Charge } from './value-objects/index.js'
import { Email, GivenName, Role } from '@/contexts/user/domain/value-objects/index.js'
import { ValidationError } from '@/shared/errors.js'
import { User } from '@/contexts/user/domain/user.entity.js'

/**
 * Patron Domain Entity - Aggregate Root
 * Represents a board member or patron of the foundation
 */
export class Patron extends User implements IPatron {
  private _id?: string
  private _email: Email
  private _givenName: GivenName
  private _familyName: GivenName
  private _role: Role
  private _charge: Charge
  private _renovationDate: Date
  private _endingDate: Date

  private constructor(
    email: Email,
    givenName: GivenName,
    familyName: GivenName,
    role: Role,
    charge: Charge,
    renovationDate: Date,
    endingDate: Date,
    id?: string,
  ) {
    super(email.getValue(), givenName.getValue(), familyName.getValue(), role.getValue())
    this._id = id
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
      new GivenName(params.givenName),
      new GivenName(params.familyName),
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
      new GivenName(data.givenName),
      new GivenName(data.familyName),
      new Role(data.role),
      new Charge(data.charge),
      data.renovationDate,
      data.endingDate,
      data.id,
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
    // Can be renewed if the membership has ended
    return now > this._endingDate
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

  get id(): string | undefined {
    return this._id
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

  get givenNameVO(): GivenName {
    return this._givenName
  }

  get familyNameVO(): GivenName {
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
