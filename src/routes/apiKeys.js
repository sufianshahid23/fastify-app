import { randomUUID } from 'crypto';

export default async function (fastify) {
	// This route handles API key management
  const collection = () => fastify.mongo.apiKeys;

  fastify.get('/api-keys', async () => {
    return await collection().find().toArray();
  });

  fastify.post('/api-keys', async (request, reply) => {
    const { type } = request.body;

		// Define rate limit rules based on type
    const rules = {
      admin: { limit: 1000, window: 60 * 60 * 1000 },
      user: { limit: 100, window: 15 * 60 * 1000 },
      guest: { limit: 10, window: 5 * 60 * 1000 },
    };

    if (!rules[type]) return reply.code(400).send({ error: 'Invalid type' });

		// Create a new API key object 
    const newKey = {
      id: randomUUID(),
      key: randomUUID(),
      type,
      limit: rules[type].limit,
      window: rules[type].window,
      createdAt: new Date(),
    };

    await collection().insertOne(newKey);
    return newKey;
  });

  fastify.delete('/api-keys/:id', async (request, reply) => {
    const result = await collection().deleteOne({ id: request.params.id });
    if (result.deletedCount === 0) {
      return reply.code(404).send({ error: 'API key not found' });
    }
    return { message: 'Deleted successfully' };
  });
}
