
const requestCounters = new Map();
export async function apiKeyAuth(request, reply) {
  const key = request.headers['x-api-key'];
  if (!key) return reply.code(401).send({ error: 'Missing API key' });

  const apiKey = await request.server.mongo.apiKeys.findOne({ key });
  if (!apiKey) return reply.code(403).send({ error: 'Invalid API key' });

  const now = Date.now();
  const windowKey = `${key}-${Math.floor(now / apiKey.window)}`;
  const count = requestCounters.get(windowKey) || 0;

  if (count >= apiKey.limit) {
    return reply.code(429).send({ error: 'Rate limit exceeded' });
  }

  requestCounters.set(windowKey, count + 1);
  request.apiKeyType = apiKey.type;
}

//github repo with basic setup and api rate limit in other commit
