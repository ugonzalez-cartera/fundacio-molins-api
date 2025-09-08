import { Patron } from '@/domain/entities/patron/patron.entity.js'
import { IPatronRepository } from '@/domain/repositories/patron/patron.repository.js'
import { PatronDto } from '@/application/dtos/patron/patron.dto.js'
import { UpdatePatronCommand } from '@/application/dtos/patron/update-patron.command.js'
import { NotFoundError, ValidationError } from '@/infrastructure/common/error-utils.js'

export class UpdatePatronUseCase {
  constructor(private readonly patronRepository: IPatronRepository) {}

  async execute(command: UpdatePatronCommand): Promise<PatronDto> {
    if (!command.id) {
      throw new ValidationError('Patron ID is required')
    }

    const existingPatron = await this.patronRepository.findOne({ id: command.id })
    if (!existingPatron) {
      throw new NotFoundError(`Patron with id ${command.id} not found`)
    }

    // Check for email uniqueness if email is being updated
    if (command.email && command.email !== existingPatron.email) {
      const existingWithEmail = await this.patronRepository.findByEmail(command.email)
      if (existingWithEmail) {
        throw new ValidationError('Email already exists')
      }
    }

    const updatedPatron = await this.patronRepository.update(command.id, command)

    if (!updatedPatron) {
      throw new NotFoundError(`Patron with id ${command.id} not found`)
    }

    return this.toDto(updatedPatron)
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
