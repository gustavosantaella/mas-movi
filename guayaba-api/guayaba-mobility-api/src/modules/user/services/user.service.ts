import { Injectable } from '@nestjs/common';
import { UserRepository } from '@/modules/user/repositories/user.repository.js';
import { UserDao } from '@/modules/user/repositories/models/user.dao.js';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findById(id: number): Promise<UserDao | null> {
    return this.userRepository.findById(id) as Promise<UserDao | null>;
  }

  async findByEmail(email: string): Promise<UserDao | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) return null;
    const { password, ...rest } = user;
    return rest as unknown as UserDao;
  }

  async findByPhone(phone: string): Promise<UserDao | null> {
    const user = await this.userRepository.findByPhone(phone);
    if (!user) return null;
    const { password, ...rest } = user;
    return rest as unknown as UserDao;
  }

  async confirmEmail(userId: number): Promise<void> {
    await this.userRepository.confirmEmail(userId);
  }

  async updateProfile(
    userId: number,
    fields: { firstName?: string; lastName?: string; dateOfBirth?: string },
  ): Promise<UserDao | null> {
    return this.userRepository.updateProfile(userId, fields) as Promise<UserDao | null>;
  }

  async confirmEntity(
    userId: number,
    ocrData?: { dni?: string; firstName?: string; lastName?: string; dateOfBirth?: string; sex?: string },
  ): Promise<void> {
    await this.userRepository.confirmEntity(userId, ocrData);
  }
}
