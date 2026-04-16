import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity.js';
import { TransactionRepository } from './repositories/transaction.repository.js';
import { TransactionService } from './services/transaction.service';
import { TransactionController } from './controllers/transaction.controller.js';
import { UserModule } from '../user/user.module';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    UserModule,
    WalletModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionRepository, TransactionService],
  exports: [TransactionService, TransactionRepository],
})
export class TransactionModule { }
