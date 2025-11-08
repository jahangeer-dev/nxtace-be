import jwt from 'jsonwebtoken';
import { appConfig } from '@/config/readers/appConfig.js';
import { appLogger } from '@/shared/observability/logger/appLogger.js';

export interface TokenPayload {
  userId: string;
  email: string;
}

class JwtService {
  private static instance: JwtService;

  public static getInstance(): JwtService {
    if (!JwtService.instance) {
      JwtService.instance = new JwtService();
    }
    return JwtService.instance;
  }

  public generateAccessToken(payload: TokenPayload): string {
    try {
      return jwt.sign(
        {
          userId: payload.userId,
          email: payload.email,
          type: 'access'
        },
        appConfig.auth.jwtSecret,
        {
          expiresIn: appConfig.auth.jwtAccessExpiresIn,
          issuer: 'template-store-api',
          audience: 'template-store-client'
        }
      );
    } catch (error) {
      appLogger.error('jwt-service', `Error generating access token: ${error}`);
      throw new Error('Failed to generate access token');
    }
  }

  public verifyAccessToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, appConfig.auth.jwtSecret, {
        issuer: 'template-store-api',
        audience: 'template-store-client'
      }) as any;

      if (decoded.type !== 'access') {
        return null;
      }

      return {
        userId: decoded.userId,
        email: decoded.email
      };
    } catch (error) {
      appLogger.error('jwt-service', `Error verifying access token: ${error}`);
      return null;
    }
  }
}

export const jwtService = JwtService.getInstance();
