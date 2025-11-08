import type { Request, Response, NextFunction } from 'express';
import { appLogger } from '@/shared/observability/logger/appLogger.js';
import { ApiError, InternalServerError } from '@/shared/utils/errors/ApiError.js';
import { appConfig } from '@/config/readers/appConfig.js';

export async function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (err instanceof ApiError) {
    appLogger.error('global-error', JSON.stringify({
      name: err.name,
      message: err.message,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip
    }));
    ApiError.handleError(err, res);
  } else {
    appLogger.error('global-error-unknown', JSON.stringify({
      name: err.name,
      message: err.message,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      stack: err.stack
    }));
    
    if (appConfig.app.nodeEnv === 'development') {
      res.status(500).json({
        success: false,
        message: err.message,
        data: {},
        stack: err.stack
      });
    } else {
      ApiError.handleError(new InternalServerError(), res);
    }
  }
}

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    data: {}
  });
};

// Legacy function for compatibility
export const createError = (message: string, statusCode: number = 500): Error => {
  const error = new Error(message);
  (error as any).statusCode = statusCode;
  return error;
};
