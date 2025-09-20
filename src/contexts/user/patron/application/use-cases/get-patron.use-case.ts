import { Patron } from '@/contexts/user/patron/domain/patron.entity.js'
import { IPatronRepository } from '@/contexts/user/patron/domain/patron.repository.js'
import { PatronDto } from '@/contexts/user/patron/application/dtos/patron.dto.js'
import { GetPatronQuery } from '@/contexts/user/patron/application/dtos/get-patron.query.js'
import { NotFoundError } from '@/shared/errors.js'

export class GetPatronUseCase {
  constructor(private patronRepository: IPatronRepository) {}

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
