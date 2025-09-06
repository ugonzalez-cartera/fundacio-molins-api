import { Patron } from '../../../domain/entities/patron/patron.entity.js'
import { IPatronRepository } from '../../../domain/repositories/patron/patron.repository.js'
import { PatronDto } from '../../dtos/patron/patron.dto.js'
import { GetPatronQuery } from '../../dtos/patron/get-patron.query.js'
import { NotFoundError } from '../../../infrastructure/common/error-utils.js'

export class GetPatronUseCase {
  constructor(private readonly patronRepository: IPatronRepository) {}

  async execute(query: GetPatronQuery): Promise<PatronDto> {
    const patron = await this.patronRepository.findOne({ id: query.id })

    if (!patron) {
      throw new NotFoundError(`Patron with id ${query.id} not found`)
    }

    return this.toDto(patron)
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
