export interface UpdatePatronCommand {
  id: string
  charge?: string
  givenName?: string
  familyName?: string
  email?: string
  role?: string
  renovationDate?: Date
  endingDate?: Date
}
