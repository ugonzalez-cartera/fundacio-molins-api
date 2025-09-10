import { IUser } from '@/shared/domain/user/user.interface.js'

export interface IPatron extends IUser {
  position: string
  renovationDate: Date
  endingDate: Date
}
