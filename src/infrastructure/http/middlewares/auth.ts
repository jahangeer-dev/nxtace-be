import type { Request, Response, NextFunction } from 'express';
import { jwtService } from '@/shared/utils/jwtService.js';
import { userRepository } from '@/infrastructure/database/repositories/UserRepository.js';
import { UnauthorizedError, AuthFailureError } from '@/shared/utils/errors/ApiError.js';

export const authenticateJWT = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Access token is required');
    }

    const token = authHeader.substring(7);
    const payload = jwtService.verifyAccessToken(token);

    if (!payload) {
      throw new UnauthorizedError('Invalid or expired access token');
    }

    // Get user from database
    const user = await userRepository.findById(payload.userId);
    if (!user) {
      throw new AuthFailureError('User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof AuthFailureError) {
      throw error;
    }
    throw new AuthFailureError('Authentication failed');
  }
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7);
    const payload = jwtService.verifyAccessToken(token);

    if (payload) {
      const user = await userRepository.findById(payload.userId);
      if (user) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Silent fail for optional auth
    next();
  }
};
