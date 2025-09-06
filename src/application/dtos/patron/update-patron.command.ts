export interface UpdatePatronCommand {
  id: string
  charge?: string
  name?: string
  email?: string
  role?: string
  renovationDate?: Date
  endingDate?: Date
}
