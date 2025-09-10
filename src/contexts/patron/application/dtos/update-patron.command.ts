export interface UpdatePatronCommand {
  id: string
  position?: string
  givenName?: string
  familyName?: string
  email?: string
  role?: string
  renovationDate?: Date
  endingDate?: Date
}
