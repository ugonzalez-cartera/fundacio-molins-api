import { FastifyRequest, FastifyReply } from 'fastify'
import { PatronService } from '../../../application/services/patron.service.js'
import { MongoosePatronRepository } from '../../repositories/patron.repository.js'
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

export class PatronController {
  private patronService: PatronService

  constructor() {
    const patronRepository = new MongoosePatronRepository()
    this.patronService = new PatronService(patronRepository)
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

      // Validate and convert dates
      const patron = await this.patronService.createPatron({
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
      const patron = await this.patronService.getPatronById(id)

      if (!patron) {
        return reply.code(404).send({
          success: false,
          error: 'Patron not found',
        })
      }

      return reply.send({
        success: true,
        data: patron,
      })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  // Get all patrons
  async getAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      const patrons = await this.patronService.getAllPatrons()

      return reply.send({
        success: true,
        data: patrons,
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

      const patron = await this.patronService.updatePatron(id, processedUpdates)

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
      await this.patronService.deletePatron(id)

      return reply.code(204).send()
    } catch (error) {
      return this.handleError(error, reply)
    }
  }
}
