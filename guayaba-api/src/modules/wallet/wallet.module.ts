import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity.js';
import { WalletRepository } from './repositories/wallet.repository.js';
import { WalletService } from './services/wallet.service.js';
import { WalletController } from './controllers/wallet.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet])],
  controllers: [WalletController],
  providers: [WalletRepository, WalletService],
  exports: [WalletService, WalletRepository],
})
export class WalletModule { }
