import type { Request, Response } from 'express';
import { AsyncHandler } from '@/infrastructure/http/middlewares/asyncHandler.js';
import { SuccessResponse, CreatedResponse } from '@/infrastructure/http/responses/ApiResponse.js';
import { BadRequestError, ValidationError } from '@/shared/utils/errors/ApiError.js';
import { appLogger } from '@/shared/observability/logger/appLogger.js';

// Import Use Cases
import { LoginUseCase } from '@/application/auth/useCases/LoginUseCase.js';
import { RegisterUseCase } from '@/application/auth/useCases/RegisterUseCase.js';
import { LogoutUseCase } from '@/application/auth/useCases/LogoutUseCase.js';

// Import Commands
import { 
  LoginCommand, 
  RegisterCommand, 
  LogoutCommand
} from '@/application/auth/commands/AuthCommands.js';

export class AuthController {
  private readonly loginUseCase = new LoginUseCase();
  private readonly registerUseCase = new RegisterUseCase();
  private readonly logoutUseCase = new LogoutUseCase();

  public register = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, name } = req.body;

      if (!email || !password) {
        throw new BadRequestError('Email and password are required');
      }

      if (password.length < 6) {
        throw new ValidationError('Password must be at least 6 characters long');
      }

      const command = new RegisterCommand(email, password, name);
      const authResult = await this.registerUseCase.execute(command);

      new CreatedResponse('User created successfully', {
        user: authResult.user,
        accessToken: authResult.accessToken
      }).send(res);
    } catch (error) {
      appLogger.error('auth-controller', `Registration error: ${error}`);
      throw error;
    }
  });

  public login = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new BadRequestError('Email and password are required');
      }

      const command = new LoginCommand(email, password);
      const authResult = await this.loginUseCase.execute(command);

      new SuccessResponse('Login successful', {
        user: authResult.user,
        accessToken: authResult.accessToken
      }).send(res);
    } catch (error) {
      appLogger.error('auth-controller', `Login error: ${error}`);
      throw error;
    }
  });

  public logout = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user as any;
      
      const command = new LogoutCommand(user._id.toString());
      await this.logoutUseCase.execute(command);

      new SuccessResponse('Logout successful').send(res);
    } catch (error) {
      appLogger.error('auth-controller', `Logout error: ${error}`);
      throw error;
    }
  });

  // Get current user profile
  public me = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const user = req.user as any;
    
    new SuccessResponse('User profile retrieved successfully', {
      id: user._id.toString(),
      email: user.email,
      name: user.name
    }).send(res);
  });
}
