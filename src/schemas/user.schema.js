export const createUserSchema = {
	body: {
		type: 'object',
		required: ['name', 'email'],
		properties: {
			name: { type: 'string', minLength: 1 },
			email: { type: 'string', format: 'email' }
		}
	},
	response: {
		201: {
			type: 'object',
			properties: {
        message: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
          required: ['id', 'name', 'email', 'createdAt'],
        },
      },
      required: ['message', 'user'],
		}
	}
}
