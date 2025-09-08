import { Patron } from '@/domain/entities/patron/patron.entity.js'
import { IPatronRepository } from '@/domain/repositories/patron/patron.repository.js'
import { PatronDto } from '@/application/dtos/patron/patron.dto.js'
import { ListPatronsQuery } from '@/application/dtos/patron/list-patrons.query.js'

export interface ListPatronsResult {
  patrons: PatronDto[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export class ListPatronsUseCase {
  constructor(private readonly patronRepository: IPatronRepository) {}

  async execute(query: ListPatronsQuery): Promise<ListPatronsResult> {
    const page = query.page || 1
    const limit = query.limit || 10

    const options = {
      page,
      limit,
      role: query.role,
    }

    const patrons = await this.patronRepository.find(options)

    return {
      patrons: patrons.map((patron : Patron) => this.toDto(patron)),
      total: patrons.length,
      page,
      limit,
      totalPages: Math.ceil(patrons.length / limit),
    }
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
