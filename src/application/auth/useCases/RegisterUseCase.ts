import argon2 from 'argon2';
import { userRepository } from '@/infrastructure/database/repositories/UserRepository.js';
import { jwtService } from '@/shared/utils/jwtService.js';
import { ConflictError } from '@/shared/utils/errors/ApiError.js';
import type { RegisterCommand } from '../commands/AuthCommands.js';
import type { AuthResponseDTO, UserResponseDTO } from '../dtos/AuthDTOs.js';
import type { IUser } from '@/domain/entities/User.js';

export class RegisterUseCase {
  async execute(command: RegisterCommand): Promise<AuthResponseDTO> {
    const existingUser = await userRepository.findByEmail(command.email);
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    const hashedPassword = await argon2.hash(command.password);

    const user = await userRepository.create({
      email: command.email.toLowerCase(),
      password: hashedPassword,
      name: command.name,
    });

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
