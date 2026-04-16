import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service.js';
import { PsqlModule } from '@/core/database/psql/psql.module.js';
import { PaymentModule } from '@/modules/payment/payment.module.js';
import { DriverModule } from '@/modules/driver/driver.module.js';
import { UtilsModule } from '@/utils/utils.module.js';
import { UserModule } from '@/modules/user/user.module.js';
import { AuthModule } from '@/modules/auth/auth.module.js';
import { WalletModule } from '@/modules/wallet/wallet.module.js';
import { TripModule } from '@/modules/trip/trip.module.js';
import { TransactionModule } from '@/modules/transaction/transaction.module.js';
import { AffiliateModule } from '@/modules/affiliate/affiliate.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UtilsModule,
    PsqlModule,
    AuthModule,
    PaymentModule,
    DriverModule, 
    UserModule,
    WalletModule,
    TripModule,
    TransactionModule,
    AffiliateModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}



