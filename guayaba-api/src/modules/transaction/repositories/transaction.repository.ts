import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity.js';
import { TransactionDao } from './models/transaction.dao.js';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private readonly repo: Repository<Transaction>,
  ) {}

  async findAllByUserId(userId: number): Promise<TransactionDao[]> {
    const transactions = await this.repo.find({
      where: [
        { fromId: userId },
        { toId: userId },
      ],
      order: { createdAt: 'DESC' },
    });
    return transactions.map(t => this.toDao(t));
  }

  async findById(id: number): Promise<TransactionDao | null> {
    const transaction = await this.repo.findOne({ where: { id } });
    return transaction ? this.toDao(transaction) : null;
  }

  async create(data: Partial<Transaction>): Promise<TransactionDao> {
    const transaction = this.repo.create(data);
    const saved = await this.repo.save(transaction);
    return this.toDao(saved);
  }

  private toDao(transaction: Transaction): TransactionDao {
    const { ...dao } = transaction;
    return dao as TransactionDao;
  }
}
