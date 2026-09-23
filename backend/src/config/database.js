// database connection
import mongoose from 'mongoose';
import { env } from './env.js';

// open one mongoose connection
export async function connectDatabase() {
  mongoose.set('strictQuery', true);

  await mongoose.connect(env.mongoUri, {
    autoIndex: env.nodeEnv !== 'production'
  });
}

// used by scripts and tests
export async function closeDatabase() {
  await mongoose.connection.close();
}
