import type { IPatronRepository } from '@/domain/repositories/patron/patron.repository.js'
import { Patron } from '@/domain/entities/patron/patron.entity.js'
import type {  PatronDto } from '@/application/dtos/patron/patron.dto.js'
import type { CreatePatronCommand } from '@/application/dtos/patron/create-patron.command.js'

export class CreatePatronUseCase {
  constructor(private patronRepository: IPatronRepository) {}

  async execute(command: CreatePatronCommand): Promise<PatronDto> {
    // Create domain entity with business logic validation
    const patron = Patron.create({
      email: command.email,
      givenName: command.givenName,
      familyName: command.familyName,
      role: command.role,
      charge: command.charge,
      renovationDate: command.renovationDate,
      endingDate: command.endingDate,
    })

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

  private toDto(patron: Patron): PatronDto {
    return {
      id: patron.id || '',
      charge: patron.charge,
      givenName: patron.givenName,
      familyName: patron.familyName,
      email: patron.email,
      role: patron.role,
      renovationDate: patron.renovationDate,
      endingDate: patron.endingDate,
    }
  }
}
