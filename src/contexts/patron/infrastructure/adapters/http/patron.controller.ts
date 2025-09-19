import { FastifyRequest, FastifyReply } from 'fastify'
import { CreatePatronUseCase } from '@/contexts/patron/application/use-cases/create-patron.use-case.js'
import { GetPatronUseCase } from '@/contexts/patron/application/use-cases/get-patron.use-case.js'
import { UpdatePatronUseCase } from '@/contexts/patron/application/use-cases/update-patron.use-case.js'
import { DeletePatronUseCase } from '@/contexts/patron/application/use-cases/delete-patron.use-case.js'
import { ListPatronsUseCase } from '@/contexts/patron/application/use-cases/list-patrons.use-case.js'
import { handleHttpError } from '@/shared/errors.js'
import { container } from '@/contexts/patron/infrastructure/di/patron.container.js'
import { PatronDto } from '@/contexts/patron/application/dtos/patron.dto'

// DTOs for HTTP layer
interface CreatePatronRequest {
  position: string
  givenName: string
  familyName: string
  email: string
  role: string
  renovationDate: string // Will be converted to Date
  endingDate: string // Will be converted to Date
}

interface PatronParams {
  id: string
}

interface ListPatronsQuerystring {
  page?: string
  limit?: string
  role?: string
}

export class PatronController {
  private createPatronUseCase: CreatePatronUseCase
  private getPatronUseCase: GetPatronUseCase
  private updatePatronUseCase: UpdatePatronUseCase
  private deletePatronUseCase: DeletePatronUseCase
  private listPatronsUseCase: ListPatronsUseCase

  constructor() {
    this.createPatronUseCase = container.resolve('createPatronUseCase')
    this.getPatronUseCase = container.resolve('getPatronUseCase')
    this.updatePatronUseCase = container.resolve('updatePatronUseCase')
    this.deletePatronUseCase = container.resolve('deletePatronUseCase')
    this.listPatronsUseCase = container.resolve('listPatronsUseCase')
  }

  // Create patron
  async create(request: FastifyRequest<{ Body: CreatePatronRequest }>, reply: FastifyReply) {
    try {
      const {
        givenName,
        familyName,
        email,
        role,
        position,
        renovationDate,
        endingDate,
      } = request.body

      const patron = await this.createPatronUseCase.execute({
        givenName,
        familyName,
        email,
        role,
        position,
        renovationDate: new Date(renovationDate),
        endingDate: new Date(endingDate),
      })

      reply.code(201).send({
        success: true,
        data: patron,
        message: 'Patron created successfully',
      })
    } catch (error) {
      handleHttpError(error, reply, 'Error creating patron')
    }
  }

  // Get patron by ID
  async getById(request: FastifyRequest<{ Params: PatronParams }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      const patron: PatronDto = await this.getPatronUseCase.execute({ id })

      reply.code(200).send({
        success: true,
        data: patron,
      })
    } catch (error) {
      handleHttpError(error, reply, `Error retrieving patron with id: ${request.params.id}`)
    }
  }

  // Get all patrons with filtering and pagination
  async getAll(
    request: FastifyRequest<{ Querystring: ListPatronsQuerystring }>,
    reply: FastifyReply,
  ) {
    try {
      const { page, limit, role } = request.query

      const result = await this.listPatronsUseCase.execute({
        page: page ? parseInt(page, 10) : undefined,
        limit: limit ? parseInt(limit, 10) : undefined,
        role,
      })

      reply.code(200).send({
        success: true,
        data: result,
      })
    } catch (error) {
      handleHttpError(error, reply, 'Error retrieving patrons list')
    }
  }

  // Update patron
  async update(
    request: FastifyRequest<{ Params: PatronParams; Body: Partial<CreatePatronRequest> }>,
    reply: FastifyReply,
  ) {
    try {
      const { id } = request.params
      const updates = request.body

      // Convert date strings to Date objects if present
      const processedUpdates: Record<string, unknown> = { ...updates }
      if (updates.renovationDate) {
        processedUpdates.renovationDate = new Date(updates.renovationDate)
      }
      if (updates.endingDate) {
        processedUpdates.endingDate = new Date(updates.endingDate)
      }

      const patron = await this.updatePatronUseCase.execute({
        id,
        ...processedUpdates,
      })

      reply.code(200).send({
        success: true,
        data: patron,
        message: 'Patron updated successfully',
      })
    } catch (error) {
      handleHttpError(error, reply, `Error updating patron with id: ${request.params.id}`)
    }
  }

  // Delete patron
  async delete(request: FastifyRequest<{ Params: PatronParams }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      const result = await this.deletePatronUseCase.execute({ id })

      reply.code(200).send({
        success: true,
        data: result,
        message: 'Patron deleted successfully',
      })
    } catch (error) {
      handleHttpError(error, reply, `Error deleting patron with id: ${request.params.id}`)
    }
  }
}
