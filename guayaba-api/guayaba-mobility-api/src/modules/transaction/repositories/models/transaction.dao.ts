import { TransactionType } from '../../entities/transaction.entity.js';

export interface TransactionDao {
  id: number;
  uuid: string;
  reference: string | null;
  amount: number;
  tax: number | null;
  fromId: number | null;
  toId: number | null;
  type: TransactionType;
  fromBank: string | null;
  extras: string | null;
  createdAt: Date;
  updatedAt: Date;
}
