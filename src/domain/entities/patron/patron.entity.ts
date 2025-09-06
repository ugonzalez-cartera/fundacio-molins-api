import type { IPatron } from './patron.interface.js'

/**
 * Patron Domain Entity
 */
export class Patron implements IPatron {
  name: string
  email: string
  charge: string
  role: string
  renovationDate: Date
  endingDate: Date

  constructor(
    charge: string,
    name: string,
    email: string,
    role: string,
    renovationDate: Date,
    endingDate: Date,
  ) {
    this.name = name
    this.email = email
    this.charge = charge
    this.role = role
    this.renovationDate = renovationDate
    this.endingDate = endingDate
  }
}
