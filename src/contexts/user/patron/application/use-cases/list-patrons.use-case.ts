import { Patron } from '@/contexts/user/patron/domain/patron.entity.js'
import { IPatronRepository } from '@/contexts/user/patron/domain/patron.repository.js'
import { PatronDto } from '@/contexts/user/patron/application/dtos/patron.dto.js'
import { ListPatronsQuery } from '@/contexts/user/patron/application/dtos/list-patrons.query.js'

import { container } from '@/contexts/user/patron/infrastructure/di/patron.container.js'

type ListPatronsResult = {
  patrons: PatronDto[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export class ListPatronsUseCase {
  private patronRepository = container.resolve<IPatronRepository>('patronRepository')

  async execute(query: ListPatronsQuery): Promise<ListPatronsResult> {
    const page = query.page || 1
    const limit = query.limit || 10

    const options = {
      filter: { role: query.role  },
      page,
      limit,
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
