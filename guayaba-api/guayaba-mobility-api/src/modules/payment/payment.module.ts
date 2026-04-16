import { Module } from '@nestjs/common';
import { PaymentGateway } from './payment.gateway.js';
import { Trip } from "@/modules/trip/entities/trip.entity.js";
import { PaymentTripController } from "./controllers/payment.trip.controller.js";
import { UserModule } from "@/modules/user/user.module.js";
import { TripModule } from "@/modules/trip/trip.module.js";
import { WalletModule } from "@/modules/wallet/wallet.module.js";

@Module({
  imports: [TripModule, UserModule, WalletModule],
  controllers: [PaymentTripController],
  providers: [PaymentGateway],
  exports: [PaymentGateway],
})

export class PaymentModule {}

