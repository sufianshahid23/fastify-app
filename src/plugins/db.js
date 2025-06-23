import fp from 'fastify-plugin';
import { MongoClient } from 'mongodb';

const MONGO_URL = 'mongodb://localhost:27017';
const DB_NAME = 'fastify_app';

async function dbConnector(fastify, options) {
	const client = new MongoClient(MONGO_URL);
	await client.connect();
	fastify.log.info('MongoDB connected');

	const db = client.db(DB_NAME);
	fastify.decorate('mongo',{
		client,
		db,
		users: db.collection('users'),
		products: db.collection('products'),
		dashboard: db.collection('dashboard'),
		apiKeys: db.collection('apiKeys')
	})
}

export default fp(dbConnector);
