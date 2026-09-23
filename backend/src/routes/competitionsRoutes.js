// competition routes
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  cancel,
  register,
  showCompetition,
  submit
} from '../controllers/competitionsController.js';

const writeLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 40,
  standardHeaders: true,
  legacyHeaders: false
});

export const competitionsRouter = Router();

competitionsRouter.get('/:key', asyncHandler(showCompetition));
competitionsRouter.post('/:key/register', writeLimiter, asyncHandler(register));
competitionsRouter.delete('/:key/register', writeLimiter, asyncHandler(cancel));
competitionsRouter.post('/:key/submission', writeLimiter, asyncHandler(submit));
