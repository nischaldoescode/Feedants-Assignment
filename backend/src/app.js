// express app
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { requestUser } from './middleware/requestUser.js';
import { competitionsRouter } from './routes/competitionsRoutes.js';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.corsOrigin === '*' ? true : env.corsOrigin }));
  app.use(express.json({ limit: '80kb' }));
  app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
  app.use(requestUser);

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'feedants-competition-api' });
  });

  app.use('/api/competitions', competitionsRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
