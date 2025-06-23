
import Fastify from 'fastify';
import rateLimit from '@fastify/rate-limit';

import mongoPlugin from './plugins/db.js';
// import auth from './plugins/auth.js';
import userRoutes from './routes/users.js';
import productRoutes from './routes/products.js';
import dashboardRoutes from './routes/dashboard.js';
import apiKeyRoutes from './routes/apiKeys.js';


const app = Fastify({ logger: true });
// Global rate limiting
app.register(rateLimit, {
  max: 100,
  timeWindow: '10 minutes',
  addHeaders: {
    'x-ratelimit-limit': true,
    'x-ratelimit-remaining': true,
    'x-ratelimit-reset': true
  }
});

//  app.register(auth);

app.register(mongoPlugin)
app.register(userRoutes);
app.register(productRoutes);
app.register(dashboardRoutes);
app.register(apiKeyRoutes);


export default app;
