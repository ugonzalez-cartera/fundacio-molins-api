import { Patron } from '../../domain/patron/patron.js'
import type { IPatronRepository } from '../../domain/patron/patron.repository.js'

export class PatronService {
  private patronRepository: IPatronRepository

  constructor(patronRepository: IPatronRepository) {
    this.patronRepository = patronRepository
  }

  async createPatron(patronData: {
    charge: string;
    name: string;
    email: string;
    role: string;
    renovationDate: Date;
    endingDate: Date;
  }): Promise<Patron> {
    // Create domain entity
    const patron = new Patron(
      patronData.charge,
      patronData.name,
      patronData.email,
      patronData.role,
      patronData.renovationDate,
      patronData.endingDate,
    )

    // Save using repository
    return await this.patronRepository.create(patron)
  }

  async getPatronById(id: string): Promise<Patron | null> {
    return await this.patronRepository.findById(id)
  }

  async getAllPatrons(): Promise<Patron[]> {
    return await this.patronRepository.find()
  }

  async updatePatron(id: string, updates: Partial<Patron>): Promise<Patron | null> {
    return await this.patronRepository.update(id, updates)
  }

  async deletePatron(id: string): Promise<boolean> {
    return await this.patronRepository.delete(id)
  }
}
