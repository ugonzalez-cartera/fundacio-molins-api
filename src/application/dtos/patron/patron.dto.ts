export interface PatronDto {
  id: string
  charge: string
  givenName: string
  familyName: string
  email: string
  role: string
  renovationDate: Date
  endingDate: Date
  createdAt?: Date
  updatedAt?: Date
}
