import { FastifyInstance } from 'fastify'
import * as patronSchemas from '@/contexts/patron/infrastructure/adapters/http/schemas/index.js'

import { container } from '@/contexts/patron/infrastructure/di/patron.container.js'

export default async function patronRoutes(fastify: FastifyInstance) {
  // POST /patrons - Create a new patron
  fastify.post('/patrons', {
    schema: patronSchemas.createPatronSchema,
  }, container.resolve('patronController').create.bind(container.resolve('patronController')))

  // GET /patrons - Get all patrons
  fastify.get('/patrons', {
    schema: patronSchemas.listPatronsSchema,
  }, container.resolve('patronController').getAll.bind(container.resolve('patronController')))

  // GET /patrons/:id - Get patron by ID
  fastify.get('/patrons/:id', {
    schema: patronSchemas.getPatronSchema,
  }, container.resolve('patronController').getById.bind(container.resolve('patronController')))

  // PUT /patrons/:id - Update patron
  fastify.put('/patrons/:id', {
    schema: patronSchemas.getPatronSchema,
  }, container.resolve('patronController').update.bind(container.resolve('patronController')))

  // DELETE /patrons/:id - Delete patron
  fastify.delete('/patrons/:id', {
    schema: patronSchemas.deletePatronSchema,
  }, container.resolve('patronController').delete.bind(container.resolve('patronController')))
}
