import { Module } from '@nestjs/common';
import { PaymentGateway } from './payment.gateway.js';
import { Trip } from '../trip/entities/trip.entity.js';
import { PaymentTripController } from "./controllers/payment.trip.controller.js";
import { UserModule } from '../user/user.module.js';
import { TripModule } from '../trip/trip.module.js';
import { WalletModule } from '../wallet/wallet.module.js';
import { TransactionModule } from '../transaction/transaction.module.js';

@Module({
  imports: [TripModule, UserModule, WalletModule, TransactionModule],
  controllers: [PaymentTripController],
  providers: [PaymentGateway],
  exports: [PaymentGateway],
})

export class PaymentModule { }

