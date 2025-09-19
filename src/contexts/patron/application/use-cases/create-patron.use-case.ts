import type { IPatronRepository } from '@/contexts/patron/domain/patron.repository.js'
import { Patron } from '@/contexts/patron/domain/patron.entity.js'
import type {  PatronDto } from '@/contexts/patron/application/dtos/patron.dto.js'
import type { CreatePatronCommand } from '@/contexts/patron/application/dtos/create-patron.command.js'
import { ConflictError } from '@/shared/errors.js'

import { container } from '@/contexts/patron/infrastructure/di/patron.container.js'
export class CreatePatronUseCase {
  private patronRepository = container.resolve<IPatronRepository>('patronRepository')

  async execute(command: CreatePatronCommand): Promise<PatronDto> {
    // Create domain entity with business logic validation
    const patron = Patron.create({
      id: command.email,
      email: command.email,
      givenName: command.givenName,
      familyName: command.familyName,
      role: command.role,
      position: command.position,
      renovationDate: command.renovationDate,
      endingDate: command.endingDate,
    })

    // Check if patron with email already exists
    const existingPatron = await this.patronRepository.findByEmail(command.email)
    if (existingPatron) {
      throw new ConflictError('Patron with this email already exists')
    }

    // Save to repository
    const savedPatron = await this.patronRepository.create(patron)

    // Return DTO
    return this.toDto(savedPatron)
  }

  private toDto(patron: Patron): PatronDto {
    return {
      id: patron.id || '',
      position: patron.position,
      givenName: patron.givenName,
      familyName: patron.familyName,
      email: patron.email,
      role: patron.role,
      renovationDate: patron.renovationDate,
      endingDate: patron.endingDate,
    }
  }
}
