export interface CreatePatronCommand {
  givenName: string
  familyName: string
  email: string
  role: string
  position: string
  renovationDate: Date
  endingDate: Date
}
