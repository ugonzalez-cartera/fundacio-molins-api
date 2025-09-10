export const createPatronSchema = {
  body: {
    type: 'object',
    required: ['position', 'givenName', 'familyName', 'email', 'role', 'renovationDate', 'endingDate'],
    properties: {
      givenName: { type: 'string', minLength: 1 },
      familyName: { type: 'string', minLength: 1 },
      email: { type: 'string', format: 'email' },
      role: { type: 'string', minLength: 1 },
      position: { type: 'string', minLength: 1 },
      renovationDate: { type: 'string', format: 'date' },
      endingDate: { type: 'string', format: 'date' },
    },
  },
  response: {
    201: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: { type: 'object' },
      },
    },
  },
}

export const patronParamsSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string', minLength: 1 },
  },
}
