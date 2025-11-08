import { User, type IUser } from '@/domain/entities/User.js';
import type { IUserRepository } from '@/domain/interfaces/IUserRepository.js';

export class UserRepository implements IUserRepository {
  async create(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return await user.save();
  }

  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id).exec();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email: email.toLowerCase() }).exec();
  }



  async update(id: string, userData: Partial<IUser>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      id, 
      { $set: userData }, 
      { new: true, runValidators: true }
    ).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await User.findByIdAndDelete(id).exec();
    return result !== null;
  }
}

export const userRepository = new UserRepository();
