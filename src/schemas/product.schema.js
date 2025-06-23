export const createProductSchema = {
  body: {
    type: 'object',
    required: ['name', 'price'],
    properties: {
      name: { type: 'string', minLength: 1 },
      price: { type: 'number' },
    },
  },
	response: {
		201: {
			type: 'object',
				properties: {
        message: { type: 'string' },
        product: {
          type: 'object',
          required: ['id', 'name', 'price', 'createdAt'],
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            price: { type: 'number' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        }
			},
			required: ['message', 'product']
		}
	}
};
