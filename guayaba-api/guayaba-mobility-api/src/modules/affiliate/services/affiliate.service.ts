import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '@/modules/user/services/user.service';
import { AffiliatedRecipient } from '../entities/affiliated-recipient.entity.js';

@Injectable()
export class AffiliateService {
  constructor(
    @InjectRepository(AffiliatedRecipient)
    private readonly affiliatedRecipientRepository: Repository<AffiliatedRecipient>,
    private readonly userService: UserService,
  ) { }

  /**
   * Affiliate a recipient for future ease of use.
   */
  async affiliate(ownerId: number, identifier: string, alias?: string, searchBy: 'email' | 'phone' = 'email'): Promise<AffiliatedRecipient> {
    const recipient = searchBy === 'email'
      ? await this.userService.findByEmail(identifier)
      : await this.userService.findByPhone(identifier);

    if (!recipient) {
      throw new NotFoundException('Usuario no encontrado para afiliar.');
    }

    if (recipient.id === ownerId) {
      throw new BadRequestException('No puedes afiliarte a ti mismo.');
    }

    // Check if already affiliated
    const existing = await this.affiliatedRecipientRepository.findOne({
      where: { ownerId, recipientId: recipient.id },
    });

    if (existing) {
      if (alias) {
        existing.alias = alias;
        return this.affiliatedRecipientRepository.save(existing);
      }
      return existing;
    }

    const newAffiliation = this.affiliatedRecipientRepository.create({
      ownerId,
      recipientId: recipient.id,
      alias: alias || `${recipient.firstName} ${recipient.lastName}`.trim(),
    });

    return this.affiliatedRecipientRepository.save(newAffiliation);
  }

  /**
   * Get all affiliated recipients for a user.
   */
  async getAffiliates(userId: number) {
    return this.affiliatedRecipientRepository.createQueryBuilder('ar')
      .leftJoinAndSelect('users', 'u', 'u.id = ar.recipientId')
      .select([
        'ar.id as id',
        'ar.alias as alias',
        'u.email as email',
        'u.phoneNumber as phone',
        'u.firstName as firstName',
        'u.lastName as lastName',
      ])
      .where('ar.ownerId = :userId', { userId })
      .getRawMany();
  }

  /**
   * Remove an affiliated recipient.
   */
  async deleteAffiliate(ownerId: number, id: number): Promise<void> {
    const affiliate = await this.affiliatedRecipientRepository.findOne({
      where: { id, ownerId },
    });

    if (!affiliate) {
      throw new NotFoundException('Afiliado no encontrado.');
    }

    await this.affiliatedRecipientRepository.delete(id);
  }
}
