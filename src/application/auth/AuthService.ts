import argon2 from 'argon2';
import { userRepository } from '@/infrastructure/database/repositories/UserRepository.js';
import { jwtService } from '@/shared/utils/jwtService.js';
import type { IUser } from '@/domain/entities/User.js';

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

class AuthService {
  private static instance: AuthService;

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await argon2.hash(data.password);

    // Create user
    const user = await userRepository.create({
      email: data.email.toLowerCase(),
      password: hashedPassword,
      name: data.name,
    });

    // Generate token pair
    const tokens = await jwtService.generateTokenPair({
      userId: user._id.toString(),
      email: user.email
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
    };
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    // Find user by email
    const user = await userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if user has password (not OAuth user)
    if (!user.password) {
      throw new Error('Please use Google sign-in for this account');
    }

    // Verify password
    const isValidPassword = await argon2.verify(user.password, data.password);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Generate token pair
    const tokens = await jwtService.generateTokenPair({
      userId: user._id.toString(),
      email: user.email
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
    };
  }
}

export const authService = AuthService.getInstance();
