export interface CreatePatronCommand {
  charge: string
  name: string
  email: string
  role: string
  renovationDate: Date
  endingDate: Date
}
