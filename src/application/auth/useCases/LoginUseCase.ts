import argon2 from 'argon2';
import { userRepository } from '@/infrastructure/database/repositories/UserRepository.js';
import { jwtService } from '@/shared/utils/jwtService.js';
import { AuthFailureError } from '@/shared/utils/errors/ApiError.js';
import type { LoginCommand } from '../commands/AuthCommands.js';
import type { AuthResponseDTO, UserResponseDTO } from '../dtos/AuthDTOs.js';
import type { IUser } from '@/domain/entities/User.js';

export class LoginUseCase {
  async execute(command: LoginCommand): Promise<AuthResponseDTO> {
    const user = await userRepository.findByEmail(command.email);
    if (!user) {
      throw new AuthFailureError('Invalid email or password');
    }

    if (!user.password) {
      throw new AuthFailureError('Invalid account type');
    }

    // Verify password
    const isValidPassword = await argon2.verify(user.password, command.password);
    if (!isValidPassword) {
      throw new AuthFailureError('Invalid email or password');
    }

    // Generate access token only
    const accessToken = jwtService.generateAccessToken({
      userId: user._id.toString(),
      email: user.email
    });

    return {
      accessToken,
      user: this.mapUserToDTO(user)
    };
  }

  private mapUserToDTO(user: IUser): UserResponseDTO {
    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}
