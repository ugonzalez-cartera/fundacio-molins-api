import { Patron } from '@/domain/entities/patron/patron.entity.js'
import { IPatronRepository } from '@/domain/repositories/patron/patron.repository.js'
import { PatronDto } from '@/application/dtos/patron/patron.dto.js'
import { GetPatronQuery } from '@/application/dtos/patron/get-patron.query.js'
import { NotFoundError } from '@/infrastructure/common/error-utils.js'

export class GetPatronUseCase {
  constructor(private readonly patronRepository: IPatronRepository) {}

  async execute(query: GetPatronQuery): Promise<PatronDto> {
    const patron = await this.patronRepository.findOne({ id: query.id })

    if (!patron) {
      throw new NotFoundError(`Patron with id ${query.id} not found`)
    }

    return this.toDto(patron)
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
