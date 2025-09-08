import { FastifyInstance } from 'fastify'
import { PatronController } from '../patron.controller.js'

export default async function patronRoutes(fastify: FastifyInstance) {
  const patronController = new PatronController()

  // Define schemas for validation
  const createPatronSchema = {
    type: 'object',
    required: ['charge', 'givenName', 'familyName', 'email', 'role', 'renovationDate', 'endingDate'],
    properties: {
      charge: { type: 'string', minLength: 1 },
      givenName: { type: 'string', minLength: 1 },
      familyName: { type: 'string', minLength: 1 },
      email: { type: 'string', format: 'email' },
      role: { type: 'string', minLength: 1 },
      renovationDate: { type: 'string', format: 'date' },
      endingDate: { type: 'string', format: 'date' },
    },
  }

  const patronParamsSchema = {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string', minLength: 1 },
    },
  }

  // POST /patrons - Create a new patron
  fastify.post('/patrons', {
    schema: {
      body: createPatronSchema,
      response: {
        201: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' },
          },
        },
      },
    },
  }, patronController.create.bind(patronController))

  // GET /patrons - Get all patrons
  fastify.get('/patrons', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'string' },
          limit: { type: 'string' },
          role: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                patrons: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      email: { type: 'string' },
                      givenName: { type: 'string' },
                      familyName: { type: 'string' },
                      role: { type: 'string' },
                      charge: { type: 'string' },
                      renovationDate: { type: 'string', format: 'date-time' },
                      endingDate: { type: 'string', format: 'date-time' },
                    },
                  },
                },
                total: { type: 'number' },
                page: { type: 'number' },
                limit: { type: 'number' },
                totalPages: { type: 'number' },
              },
            },
          },
        },
      },
    },
  }, patronController.getAll.bind(patronController))

  // GET /patrons/:id - Get patron by ID
  fastify.get('/patrons/:id', {
    schema: {
      params: patronParamsSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' },
          },
        },
      },
    },
  }, patronController.getById.bind(patronController))

  // PUT /patrons/:id - Update patron
  fastify.put('/patrons/:id', {
    schema: {
      params: patronParamsSchema,
      body: {
        type: 'object',
        properties: {
          charge: { type: 'string' },
          givenName: { type: 'string' },
          familyName: { type: 'string' },
          email: { type: 'string', format: 'email' },
          role: { type: 'string' },
          renovationDate: { type: 'string', format: 'date' },
          endingDate: { type: 'string', format: 'date' },
        },
      },
    },
  }, patronController.update.bind(patronController))

  // DELETE /patrons/:id - Delete patron
  fastify.delete('/patrons/:id', {
    schema: {
      params: patronParamsSchema,
      response: {
        204: { type: 'null' },
      },
    },
  }, patronController.delete.bind(patronController))
}
