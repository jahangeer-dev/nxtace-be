import type { IUser } from "../entities/User.js";

export interface IUserRepository {
  create(userData: Partial<IUser>): Promise<IUser>;
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  update(id: string, userData: Partial<IUser>): Promise<IUser | null>;
  delete(id: string): Promise<boolean>;
}
