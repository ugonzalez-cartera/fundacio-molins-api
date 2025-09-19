import type { IPatron } from '@/contexts/patron/domain/patron.type.js'
import { Position } from '@/contexts/patron/domain/value-objects/position.js'
import { User } from '@/shared/domain/user/user.entity.js'

export class Patron extends User implements IPatron {
  private _position: Position
  private _renovationDate: Date
  private _endingDate: Date

  private constructor(
    id: string,
    givenName: string,
    familyName: string,
    email: string,
    role: string,
    position: string,
    renovationDate: Date,
    endingDate: Date,
  ) {
    super(id, givenName, familyName, email, role)
    this._position = new Position(position)
    this._renovationDate = renovationDate
    this._endingDate = endingDate
  }

  static create(params: {
    id: string,
    givenName: string,
    familyName: string,
    email: string,
    role: string,
    position: string,
    renovationDate: Date,
    endingDate: Date,
  }): Patron {
    return new Patron(
      params.id,
      params.givenName,
      params.familyName,
      params.email,
      params.role,
      params.position,
      params.renovationDate,
      params.endingDate,
    )
  }

  get position(): string {
    return this._position.getValue()
  }

  set position(value: string) {
    this._position = new Position(value)
  }

  get renovationDate(): Date {
    return new Date(this._renovationDate)
  }

  set renovationDate(value: Date) {
    this._renovationDate = value
  }

  get endingDate(): Date {
    return new Date(this._endingDate)
  }

  set endingDate(value: Date) {
    this._endingDate = value
  }

  toPrimitives(): {
    id: string,
    email: string
    givenName: string
    familyName: string
    role: string
    position: string
    renovationDate: Date
    endingDate: Date
    } {
    return {
      id: this.id,
      email: this.email,
      givenName: this.givenName,
      familyName: this.familyName,
      role: this.role,
      position: this.position,
      renovationDate: this.renovationDate,
      endingDate: this.endingDate,
    }
  }
}
