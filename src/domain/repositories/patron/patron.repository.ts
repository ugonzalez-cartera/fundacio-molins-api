import { Patron } from '@/domain/entities/patron/patron.entity.js'

export interface IPatronRepository {
  find(filter: unknown): Promise<Patron[]>
  findOne({ id }: { id: string }): Promise<Patron | null>
  findByEmail(email: string): Promise<Patron | null>
  create(patron: Patron): Promise<Patron>
  update(id: string, patron: Partial<Patron>): Promise<Patron | null>
  delete(id: string): Promise<boolean>
}
