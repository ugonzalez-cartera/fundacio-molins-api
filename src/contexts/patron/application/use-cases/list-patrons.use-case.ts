import { Patron } from '@/contexts/patron/domain/patron.entity.js'
import { IPatronRepository } from '@/contexts/patron/domain/patron.repository.js'
import { PatronDto } from '@/contexts/patron/application/dtos/patron.dto.js'
import { ListPatronsQuery } from '@/contexts/patron/application/dtos/list-patrons.query.js'

import { container } from '@/contexts/patron/infrastructure/di/patron.container.js'

export interface ListPatronsResult {
  patrons: PatronDto[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export class ListPatronsUseCase {
  private patronRepository: IPatronRepository

  constructor() {
    this.patronRepository = container.resolve('patronRepository')
  }

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
      id: patron.id,
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
