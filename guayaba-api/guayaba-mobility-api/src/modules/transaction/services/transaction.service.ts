import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionRepository } from '../repositories/transaction.repository.js';
import { UserService } from '@/modules/user/services/user.service';
import { WalletService } from '@/modules/wallet/services/wallet.service';
import { TransactionType } from '../entities/transaction.entity.js';
import { TransactionDao } from '../repositories/models/transaction.dao.js';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly userService: UserService,
    private readonly walletService: WalletService,
  ) { }

  async findAllByUserId(userId: number): Promise<TransactionDao[]> {
    return this.transactionRepository.findAllByUserId(userId);
  }


  /**
   * Transfer credits from one user to another.
   */
  async transfer(senderId: number, identifier: string, amount: number, extras?: string, searchBy: 'email' | 'phone' = 'email'): Promise<TransactionDao> {
    console.log(`💸 [Transfer] Sender: ${senderId}, Recipient: ${identifier}, Amount: ${amount}, Type: ${searchBy}`);

    if (amount <= 0) {
      throw new BadRequestException('El monto debe ser mayor a cero.');
    }

    // 1. Find recipient
    const recipient = searchBy === 'email'
      ? await this.userService.findByEmail(identifier)
      : await this.userService.findByPhone(identifier);

    if (!recipient) {
      throw new NotFoundException('El usuario destinatario no existe.');
    }

    if (recipient.id === senderId) {
      throw new BadRequestException('No puedes enviarte dinero a ti mismo.');
    }

    // 2. Check sender balance
    const senderWallet = await this.walletService.findByUserId(senderId);

    // Explicit conversion to number in case Postgres decimal returns as string
    const currentBalance = senderWallet ? Number(senderWallet.balance) : 0;
    const transferAmount = Number(amount);

    console.log(`🏦 [Transfer] Wallet Status - Exists: ${!!senderWallet}, Current Balance: ${currentBalance}, Transfer: ${transferAmount}`);

    if (!senderWallet || currentBalance < transferAmount) {
      throw new BadRequestException(`Saldo insuficiente para realizar el envío. Saldo actual: ${currentBalance}`);
    }

    // 3. Perform transfer (Debit sender, Credit recipient)
    await this.walletService.updateBalance(senderId, -transferAmount);
    await this.walletService.updateBalance(recipient.id, transferAmount);

    // 4. Record transaction
    return this.transactionRepository.create({
      fromId: senderId,
      toId: recipient.id,
      amount: transferAmount,
      type: TransactionType.TRANSFER,
      extras,
      reference: `TRANS-${Date.now()}`,
    });
  }
}
