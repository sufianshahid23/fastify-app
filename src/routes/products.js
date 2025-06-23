import { apiKeyAuth } from '../plugins/auth.js';
import { createProductSchema } from '../schemas/product.schema.js';

export default async function (fastify) {
	const collection = () => fastify.mongo.products;
	fastify.get('/products', { preHandler: apiKeyAuth }, async () => {
		const products = await collection().find().toArray();
		return products;
		});

		fastify.post('/products', { preHandler: apiKeyAuth, schema: createProductSchema }, async (req, reply) => {
		const { name, price } = req.body;
		if (!name || !price) {
			return reply.code(400).send({ error: 'Name and price are required' });
		}

		// const exits = await collection.findOne({name})
		// if(exits) {
		// 	return reply.code(400).send({ error: 'Product with this name already exists' });
		// }

		const product = {
			id: crypto.randomUUID(),
			name,
			price,
			createdAt: new Date(),
		};

		await collection().insertOne(product);
		return { message: `Product ${name} added`, product };
	})

	fastify.put('/products/:id', {preHandler: apiKeyAuth}, async (req, reply) => {
		const {id} = req.params;
		const {name, price } = req.body;
		if (!name && !price) {
			return reply.code(400).send({ error: 'Provide at least one field to update' });
		}
		const updateProduct = {}
		if (name) updateProduct.name = name;
		if (price) updateProduct.price = price;

		const result = await collection().updateOne(
			{ id },
			{ $set: updateProduct }
		);
		if (result.matchedCount === 0) {
			return reply.code(404).send({ error: 'Product not found' });
		}
		return { message: `Product with ID ${req.body.id} updated` };
	});

	fastify.delete('/products/:id', {preHandler: apiKeyAuth}, async (req, reply) => {
		const {id } = req.params;
		const result = await collection().deleteOne({ id });
		if(result .deletedCount === 0 ) {
			return reply.code(404).send({ error: 'Product not found' });
		}
		return { message: `Product with ID ${id} deleted.` };
	});
}
