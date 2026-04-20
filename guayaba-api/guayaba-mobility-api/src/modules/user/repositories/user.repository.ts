import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../modules/user/entities/user.entity.js';
import { RegisterDto } from '../../../modules/auth/controllers/models/register.dto.js';
import { UserDao } from './models/user.dao.js';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) { }

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  async findByPhone(phoneNumber: string): Promise<User | null> {
    return this.repo.findOne({ where: { phoneNumber } });
  }

  async findById(id: number): Promise<Omit<User, 'password'> | null> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) return null;
    const { password, ...rest } = user;
    return rest;
  }

  async findByIdWithPassword(id: number): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  async newUser(dto: RegisterDto, hashedPassword: string): Promise<User> {
    const user = new User();
    user.email = dto.email;
    user.password = hashedPassword;
    user.userType = [dto.userType];
    user.dni = dto.dni?.split(".").join("");
    user.firstName = dto.firstName ?? '';
    user.lastName = dto.lastName ?? '';
    user.dateOfBirth = dto.dateOfBirth ?? '';
    user.sex = dto.sex ?? '';
    return this.repo.save(user);
  }

  async confirmEmail(userId: number): Promise<void> {
    await this.repo.update(userId, { emailConfirmed: true });
  }

  async updatePassword(userId: number, hashedPassword: string): Promise<void> {
    await this.repo.update(userId, { password: hashedPassword });
  }

  async updateProfile(
    userId: number,
    fields: { firstName?: string; lastName?: string; dateOfBirth?: string },
  ): Promise<Omit<User, 'password'> | null> {
    const updateData: Partial<User> = {};
    if (fields.firstName !== undefined) updateData.firstName = fields.firstName;
    if (fields.lastName !== undefined) updateData.lastName = fields.lastName;
    if (fields.dateOfBirth !== undefined) updateData.dateOfBirth = fields.dateOfBirth;

    await this.repo.update(userId, updateData);
    return this.findById(userId);
  }

  async confirmEntity(
    userId: number,
    ocrData?: { dni?: string; firstName?: string; lastName?: string; dateOfBirth?: string; sex?: string },
  ): Promise<void> {
    const updateData: Partial<User> = { entityConfirmed: true };
    if (ocrData?.dni) updateData.dni = ocrData.dni;
    if (ocrData?.firstName) updateData.firstName = ocrData.firstName;
    if (ocrData?.lastName) updateData.lastName = ocrData.lastName;
    if (ocrData?.dateOfBirth) updateData.dateOfBirth = ocrData.dateOfBirth;
    if (ocrData?.sex) updateData.sex = ocrData.sex;
    await this.repo.update(userId, updateData);
  }
}
