import { patronParamsSchema } from '@/contexts/user/patron/infrastructure/adapters/http/schemas/patron-params.schema.js'

export const deletePatronSchema = {
  params: patronParamsSchema,
  response: {
    204: { type: 'null' },
  },
}
