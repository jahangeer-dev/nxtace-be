import { userRepository } from '@/infrastructure/database/repositories/UserRepository.js';
import { jwtService } from '@/shared/utils/jwtService.js';
import { User } from '@/domain/entities/User.js';
import type { GoogleAuthCommand } from '../commands/AuthCommands.js';
import type { TokenPairDTO, UserResponseDTO } from '../dtos/AuthDTOs.js';
import type { IUser } from '@/domain/entities/User.js';

export class GoogleAuthUseCase {
  async execute(command: GoogleAuthCommand): Promise<TokenPairDTO> {
    const profile = command.profile;
    
    // Check if user already exists with this Google ID
    let existingUser = await userRepository.findByGoogleId(profile.id);
    
    if (existingUser) {
      return this.generateTokensForUser(existingUser);
    }

    // Check if user exists with the same email
    const email = profile.emails?.[0]?.value;
    if (email) {
      existingUser = await userRepository.findByEmail(email);
      
      if (existingUser) {
        // Link Google account to existing user
        existingUser.googleId = profile.id;
        const updatedUser = await userRepository.update(existingUser._id.toString(), {
          googleId: profile.id
        });
        return this.generateTokensForUser(updatedUser!);
      }
    }

    // Create new user
    const newUser = await userRepository.create({
      email: email || `${profile.id}@google.oauth`,
      name: profile.displayName || profile.name?.givenName || 'Google User',
      googleId: profile.id,
      // No password for OAuth users
    });
    
    return this.generateTokensForUser(newUser);
  }

  private async generateTokensForUser(user: IUser): Promise<TokenPairDTO> {
    const tokens = await jwtService.generateTokenPair({
      userId: user._id.toString(),
      email: user.email
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: this.mapUserToDTO(user)
    };
  }

  private mapUserToDTO(user: IUser): UserResponseDTO {
    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      googleId: user.googleId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}
