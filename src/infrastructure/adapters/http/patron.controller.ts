import { FastifyRequest, FastifyReply } from 'fastify'
import { MongoosePatronRepository } from '../../repositories/patron.repository.js'
import { CreatePatronUseCase } from '../../../application/use-cases/patron/create-patron.use-case.js'
import { GetPatronUseCase } from '../../../application/use-cases/patron/get-patron.use-case.js'
import { UpdatePatronUseCase } from '../../../application/use-cases/patron/update-patron.use-case.js'
import { DeletePatronUseCase } from '../../../application/use-cases/patron/delete-patron.use-case.js'
import { ListPatronsUseCase } from '../../../application/use-cases/patron/list-patrons.use-case.js'
import {
  getErrorMessage,
  DomainError,
} from '../../common/error-utils.js'

// DTOs for HTTP layer
interface CreatePatronRequest {
  charge: string
  name: string
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
  search?: string
  role?: string
  isActive?: string
}

export class PatronController {
  private createPatronUseCase: CreatePatronUseCase
  private getPatronUseCase: GetPatronUseCase
  private updatePatronUseCase: UpdatePatronUseCase
  private deletePatronUseCase: DeletePatronUseCase
  private listPatronsUseCase: ListPatronsUseCase

  constructor() {
    const patronRepository = new MongoosePatronRepository()

    this.createPatronUseCase = new CreatePatronUseCase(patronRepository)
    this.getPatronUseCase = new GetPatronUseCase(patronRepository)
    this.updatePatronUseCase = new UpdatePatronUseCase(patronRepository)
    this.deletePatronUseCase = new DeletePatronUseCase(patronRepository)
    this.listPatronsUseCase = new ListPatronsUseCase(patronRepository)
  }

  // Helper method to handle errors consistently
  private handleError(error: unknown, reply: FastifyReply) {
    if (error instanceof DomainError) {
      return reply.code(error.statusCode).send({
        success: false,
        error: error.message,
        code: error.code,
      })
    }

    // Default to 500 for unknown errors
    return reply.code(500).send({
      success: false,
      error: getErrorMessage(error),
    })
  }

  // Create patron
  async create(request: FastifyRequest<{ Body: CreatePatronRequest }>, reply: FastifyReply) {
    try {
      const { charge, name, email, role, renovationDate, endingDate } = request.body

      const patron = await this.createPatronUseCase.execute({
        charge,
        name,
        email,
        role,
        renovationDate: new Date(renovationDate),
        endingDate: new Date(endingDate),
      })

      return reply.code(201).send({
        success: true,
        data: patron,
      })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  // Get patron by ID
  async getById(request: FastifyRequest<{ Params: PatronParams }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      const patron = await this.getPatronUseCase.execute({ id })

      return reply.send({
        success: true,
        data: patron,
      })
    } catch (error) {
      return this.handleError(error, reply)
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

      return reply.send({
        success: true,
        data: result,
      })
    } catch (error) {
      return this.handleError(error, reply)
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

      return reply.send({
        success: true,
        data: patron,
      })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  // Delete patron
  async delete(request: FastifyRequest<{ Params: PatronParams }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      await this.deletePatronUseCase.execute({ id })

      return reply.code(204).send()
    } catch (error) {
      return this.handleError(error, reply)
    }
  }
}
