import { apiKeyAuth } from '../plugins/auth.js';
import { createUserSchema } from '../schemas/user.schema.js';

export default async function (fastify) {
	const collection = () => fastify.mongo.users;
  fastify.get('/users', { preHandler: apiKeyAuth }, async () => {
    const users = await collection().find().toArray();
		return users;
  });

  fastify.post('/users', { preHandler: apiKeyAuth, schema: createUserSchema }, async (request, reply) => {
		const { name, email } = request.body;
    if (!name || !email) {
      return reply.code(400).send({ error: 'Name and email are required' });
    }

		const exits = await collection.findOne({name})
		if(exits) {
			return reply.code(400).send({ error: 'User with this name already exists' });
		}

    const user = {
      id: crypto.randomUUID(),
      name,
      email,
      createdAt: new Date(),
    };

    await collection().insertOne(user);
		return { message: `User ${name} ${email} added`, user };
  });

	fastify.put('/users', { preHandler: apiKeyAuth }, async (request) => {
		const { id } = request.params;
		const { name, email } = request.body;
    if (!name && !email) {
      return reply.code(400).send({ error: 'Provide at least one field to update' });
    }
		const updateUsers = {};
		if (name) updateUsers.name = name;
		if (email) updateUsers.email = email;

		//update the matching user by ID
		const result = await collection().updateOne(
			{ id },
			{ $set: updateUsers }
		);
		// Check if the user found or not
		if (result.matchedCount === 0) {
			return reply.code(404).send({ error: 'User not found' });
		}
		return { message: `User with ID ${id} updated`};
  });

	// DELETE: delete user by ID
  fastify.delete('/users/:id', { preHandler: apiKeyAuth }, async (request, reply) => {
    const { id } = request.params;

    const result = await collection().deleteOne({ id });

    if (result.deletedCount === 0) {
      return reply.code(404).send({ error: 'User not found' });
    }

    return { message: `User with ID ${id} deleted.` };
  });
}
