
import { patronParamsSchema } from '@/contexts/user/patron/infrastructure/adapters/http/schemas/patron-params.schema.js'

export const getPatronSchema = {
  params: patronParamsSchema,
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            position: { type: 'string' },
            givenName: { type: 'string' },
            familyName: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string' },
            renovationDate: { type: 'string' },
            endingDate: { type: 'string' },
          },
        },
      },
    },
  },
}
