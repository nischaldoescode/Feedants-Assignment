// error response
import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError.js';

// unknown routes should still use the api error shape
export function notFoundHandler(req, _res, next) {
  next(new ApiError(404, 'route_not_found', `No route found for ${req.method} ${req.originalUrl}`));
}

// keep response errors stable for the app
export function errorHandler(error, _req, res, _next) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      ok: false,
      error: {
        code: 'validation_failed',
        message: 'Some fields need a closer look.',
        details: error.flatten()
      }
    });
  }

  const statusCode = error.statusCode ?? 500;
  const code = error.code ?? 'internal_error';
  const message = statusCode === 500 ? 'Something went wrong.' : error.message;

  return res.status(statusCode).json({
    ok: false,
    error: {
      code,
      message,
      details: error.details
    }
  });
}
