import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from '@/modules/wallet/entities/wallet.entity.js';
import { WalletDao } from '@/modules/wallet/repositories/models/wallet.dao.js';

@Injectable()
export class WalletRepository {
  constructor(
    @InjectRepository(Wallet)
    private readonly repo: Repository<Wallet>,
  ) {}

  async findByUserId(userId: number): Promise<WalletDao | null> {
    const wallet = await this.repo.findOne({ where: { userId } });
    return wallet ? this.toDao(wallet) : null;
  }

  async findByPassengerUuid(passengerUuid: string): Promise<WalletDao | null> {
    const wallet = await this.repo.findOne({ where: { passengerUuid } });
    return wallet ? this.toDao(wallet) : null;
  }

  async findByDriverUuid(driverUuid: string): Promise<WalletDao | null> {
    const wallet = await this.repo.findOne({ where: { driverUuid } });
    return wallet ? this.toDao(wallet) : null;
  }

  async create(data: Partial<Wallet>): Promise<WalletDao> {
    const wallet = this.repo.create(data);
    const savedWallet = await this.repo.save(wallet);
    return this.toDao(savedWallet);
  }

  async updateBalance(userId: number, amount: number): Promise<void> {
    const wallet = await this.repo.findOne({ where: { userId } });
    if (!wallet) {
      // If no wallet exists, we create one. 
      // We might need to fetch the user to get their UUIDs, 
      // but for a simple increment we can just start with the amount.
      await this.repo.save({ userId, balance: amount });
    } else {
      await this.repo.increment({ userId }, 'balance', amount);
    }
  }

  async updateLockedBalance(userId: number, amount: number): Promise<void> {
    await this.repo.increment({ userId }, 'balanceLocked', amount);
  }

  private toDao(wallet: Wallet): WalletDao {
    const { ...dao } = wallet;
    return dao as WalletDao;
  }
}
