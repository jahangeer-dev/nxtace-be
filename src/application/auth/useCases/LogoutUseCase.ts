import { jwtService } from '@/shared/utils/jwtService.js';
import type { LogoutCommand } from '../commands/AuthCommands.js';

export class LogoutUseCase {
  async execute(command: LogoutCommand): Promise<void> {
    // Revoke all user tokens from Redis
    await jwtService.revokeAllUserTokens(command.userId);
  }
}
