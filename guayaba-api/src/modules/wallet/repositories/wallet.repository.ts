import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from '../entities/wallet.entity.js';
import { WalletDao } from './models/wallet.dao.js';

@Injectable()
export class WalletRepository {
  constructor(
    @InjectRepository(Wallet)
    private readonly repo: Repository<Wallet>,
  ) { }

  async findByUserId(userId: number): Promise<WalletDao | null> {
    const wallet = await this.repo.findOne({ where: { userId } });
    return wallet ? this.toDao(wallet) : null;
  }

  async findByPassengerUuid(passengerUuid: string): Promise<WalletDao | null> {
    console.log(`🔍 [WalletRepo] Finding wallet for passengerUuid: ${passengerUuid}`);
    const wallet = await this.repo.findOne({ where: { passengerUuid } });
    return wallet ? this.toDao(wallet) : null;
  }

  async findByDriverUuid(driverUuid: string): Promise<WalletDao | null> {
    console.log(`🔍 [WalletRepo] Finding wallet for driverUuid: ${driverUuid}`);
    const wallet = await this.repo.findOne({ where: { driverUuid } });
    return wallet ? this.toDao(wallet) : null;
  }

  async create(data: Partial<Wallet>): Promise<WalletDao> {
    const wallet = this.repo.create(data);
    const savedWallet = await this.repo.save(wallet);
    return this.toDao(savedWallet);
  }

  async updateBalance(userId: number, amount: number): Promise<void> {
    console.log(`💰 [WalletRepo] Updating balance for userId: ${userId}, Amount: ${amount}`);
    const wallet = await this.repo.findOne({ where: { userId } });
    if (!wallet) {
      console.log(`➕ [WalletRepo] No wallet found for userId ${userId}, creating one...`);
      await this.repo.save({ userId, balance: amount });
    } else {
      console.log(`📈 [WalletRepo] Existing balance for userId ${userId}: ${wallet.balance}. Incrementing by ${amount}`);
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
