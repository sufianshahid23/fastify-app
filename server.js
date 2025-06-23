import 'dotenv/config'
import app from './src/app.js';


const start = async () => {
  try {
    await app.listen({ port: process.env.PORT });
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
