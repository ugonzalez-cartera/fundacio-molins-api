import type { IUser } from '@/shared/domain/user/user.type.js'

export type IPatron = IUser & {
  position: string
  renovationDate: Date
  endingDate: Date
}
