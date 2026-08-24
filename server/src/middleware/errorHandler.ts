import type { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError.js';

const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      statusCode: error.statusCode,
      message: error.message,
    });
  }

  return res.status(500).json({
    statusCode: 500,
    message: 'Internal server error',
  });
};

export default errorHandler;
