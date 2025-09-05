import type { Patron } from './patron.js'

export interface IPatronRepository {
  findById(id: string): Promise<Patron | null>;
  find(filter?: Record<string, any>): Promise<Patron[]>;
  findOne(filter: Record<string, any>): Promise<Patron | null>;
  create(patron: Omit<Patron, '_id'>): Promise<Patron>;
  update(id: string, patron: Partial<Patron>): Promise<Patron | null>;
  delete(id: string): Promise<boolean>;

  // Domain-specific methods
  findByEmail(email: string): Promise<Patron | null>;
  findByRole(role: string): Promise<Patron[]>;
}
