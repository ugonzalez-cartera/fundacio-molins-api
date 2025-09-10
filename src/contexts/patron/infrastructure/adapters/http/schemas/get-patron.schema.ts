
import { patronParamsSchema } from '@/contexts/patron/infrastructure/adapters/http/schemas/patron-params.schema.js'

export const getPatronSchema = {
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
}
