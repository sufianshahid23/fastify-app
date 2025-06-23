export default async function (fastify) {
	const users = () => fastify.mongo.users;
	const products = () => fastify.mongo.products;
  fastify.get('/dashboard', async () => {
    const totalUsers = await users().countDocuments();
		const totalProducts = await products().countDocuments();
		return {
			message: "Dashboard Summary",
			totalUsers,
			totalProducts,
		}
  });
};
