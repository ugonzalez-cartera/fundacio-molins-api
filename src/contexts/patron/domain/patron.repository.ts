import { Patron } from '@/contexts/patron/domain/patron.entity.js'

export type IPatronRepository = {
  find(options: { filter: Record<string, unknown>, limit: number, page: number }): Promise<Patron[]>
  findById(id: string): Promise<Patron | null>
  findByEmail(email: string): Promise<Patron | null>
  create(patron: Patron): Promise<Patron>
  update(id: string, patron: Partial<Patron>): Promise<Patron | null>
  delete(id: string): Promise<boolean>
}
