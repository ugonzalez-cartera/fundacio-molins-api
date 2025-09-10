import { FastifyInstance } from 'fastify'
import { PatronController } from '@/contexts/patron/infrastructure/adapters/http/patron.controller.js'
import * as patronSchemas from '@/contexts/patron/infrastructure/adapters/http/schemas/index.js'

export default async function patronRoutes(fastify: FastifyInstance) {
  const patronController = new PatronController()

  // POST /patrons - Create a new patron
  fastify.post('/patrons', {
    schema: patronSchemas.createPatronSchema,
  }, patronController.create.bind(patronController))

  // GET /patrons - Get all patrons
  fastify.get('/patrons', {
    schema: patronSchemas.listPatronsSchema,
  }, patronController.getAll.bind(patronController))

  // GET /patrons/:id - Get patron by ID
  fastify.get('/patrons/:id', {
    schema: patronSchemas.getPatronSchema,
  }, patronController.getById.bind(patronController))

  // PUT /patrons/:id - Update patron
  fastify.put('/patrons/:id', {
    schema: patronSchemas.getPatronSchema,
  }, patronController.update.bind(patronController))

  // DELETE /patrons/:id - Delete patron
  fastify.delete('/patrons/:id', {
    schema: patronSchemas.deletePatronSchema,
  }, patronController.delete.bind(patronController))
}
