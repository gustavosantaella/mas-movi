import { Injectable } from '@nestjs/common';
import { WalletRepository } from '../repositories/wallet.repository.js';
import { WalletDao } from '../repositories/models/wallet.dao.js';

@Injectable()
export class WalletService {
  constructor(private readonly walletRepository: WalletRepository) { }

  async findByUserId(userId: number): Promise<WalletDao | null> {
    return this.walletRepository.findByUserId(userId);
  }

  async findByPassengerUuid(uuid: string): Promise<WalletDao | null> {
    return this.walletRepository.findByPassengerUuid(uuid);
  }

  async findByDriverUuid(uuid: string): Promise<WalletDao | null> {
    return this.walletRepository.findByDriverUuid(uuid);
  }

  async updateBalance(userId: number, amount: number): Promise<void> {
    return this.walletRepository.updateBalance(userId, amount);
  }
}
