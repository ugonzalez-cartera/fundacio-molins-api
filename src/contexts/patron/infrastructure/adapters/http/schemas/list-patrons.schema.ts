export const listPatronsSchema = {
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
                  position: { type: 'string' },
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
}
