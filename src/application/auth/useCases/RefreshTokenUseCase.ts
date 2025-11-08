import { jwtService } from '@/shared/utils/jwtService.js';
import { userRepository } from '@/infrastructure/database/repositories/UserRepository.js';
import { UnauthorizedError } from '@/shared/utils/errors/ApiError.js';
import type { RefreshTokenCommand } from '../commands/AuthCommands.js';

export class RefreshTokenUseCase {
  async execute(command: RefreshTokenCommand): Promise<{ accessToken: string }> {
    // Verify refresh token
    const isValid = await jwtService.verifyRefreshToken(command.refreshToken, command.userId);
    
    if (!isValid) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    // Get user to create new access token
    const user = await userRepository.findById(command.userId);
    
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    // Generate new access token
    const accessToken = jwtService.generateAccessToken({
      userId: user._id.toString(),
      email: user.email
    });

    return { accessToken };
  }
}
