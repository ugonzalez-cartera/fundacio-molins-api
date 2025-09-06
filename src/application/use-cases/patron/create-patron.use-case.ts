import type { IPatronRepository } from '../../../domain/repositories/patron/patron.repository.js'
import { Patron } from '../../../domain/entities/patron/patron.entity.js'
import type { CreatePatronCommand, PatronDto } from '../../dtos/patron/patron.dto.js'

export class CreatePatronUseCase {
  constructor(private patronRepository: IPatronRepository) {}

  async execute(command: CreatePatronCommand): Promise<PatronDto> {
    // Create domain entity with business logic validation
    const patron = new Patron(
      command.charge,
      command.name,
      command.email,
      command.role,
      command.renovationDate,
      command.endingDate,
    )

    // Check if patron with email already exists
    const existingPatron = await this.patronRepository.findByEmail(command.email)
    if (existingPatron) {
      throw new Error('Patron with this email already exists')
    }

    // Save to repository
    const savedPatron = await this.patronRepository.create(patron)

    // Return DTO
    return this.toDto(savedPatron)
  }

  private toDto(patron: Patron & { _id?: string; id?: string }): PatronDto {
    return {
      id: patron._id || patron.id || '',
      charge: patron.charge,
      name: patron.name,
      email: patron.email,
      role: patron.role,
      renovationDate: patron.renovationDate,
      endingDate: patron.endingDate,
    }
  }
}
