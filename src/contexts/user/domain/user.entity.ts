import { IUser } from '@/contexts/user/domain/user.interface.js'

export abstract class User implements IUser {
  constructor(
    public email: string,
    public givenName: string,
    public familyName: string,
    public role: string,
  ) {}
}
