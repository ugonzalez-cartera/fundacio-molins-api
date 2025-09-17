import { Patron } from '@/contexts/patron/domain/patron.entity.js'
import { IPatronRepository } from '@/contexts/patron/domain/patron.repository.js'
import { PatronDto } from '@/contexts/patron/application/dtos/patron.dto.js'
import { GetPatronQuery } from '@/contexts/patron/application/dtos/get-patron.query.js'
import { NotFoundError } from '@/shared/errors.js'

import { container } from '@/contexts/patron/infrastructure/di/patron.container.js'
export class GetPatronUseCase {
  private patronRepository: IPatronRepository

  constructor() {
    this.patronRepository = container.resolve('patronRepository')
  }

  async execute(query: GetPatronQuery): Promise<PatronDto> {
    const patron = await this.patronRepository.findById(query.id)
    if (!patron) {
      throw new NotFoundError(`Patron with id ${query.id} not found`)
    }

    return this.toDto(patron)
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
