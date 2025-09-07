import type { IPatron } from './patron.interface.js'
import { User } from '../user/user.entity.js'

// Patron Domain Entity
export class Patron extends User implements IPatron {
  givenName: string
  familyName: string
  email: string
  charge: string
  role: string
  renovationDate: Date
  endingDate: Date

  constructor(
    charge: string,
    givenName: string,
    familyName: string,
    email: string,
    role: string,
    renovationDate: Date,
    endingDate: Date,
  ) {
    super(email, givenName, familyName, role)
    this.familyName = familyName
    this.givenName = givenName
    this.email = email
    this.charge = charge
    this.role = role
    this.renovationDate = renovationDate
    this.endingDate = endingDate
  }
}
