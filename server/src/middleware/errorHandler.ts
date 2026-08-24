import type { Request, Response, NextFunction } from 'express';
import type AppError from '../utils/AppError.js';

const errorHandler = (
  error: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  error.statusCode = error.statusCode || 500;

  res.status(error.statusCode).json({ 
    statusCode: error.statusCode, 
    message: error.message 
  }); 
};

export default errorHandler;
