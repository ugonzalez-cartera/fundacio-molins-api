import type { IUser } from '../user/user.interface.js'
export interface IPatron extends IUser {
  charge: string
  renovationDate: Date
  endingDate: Date
}
