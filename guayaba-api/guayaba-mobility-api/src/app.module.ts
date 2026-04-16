import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { PsqlModule } from '@/core/database/psql/psql.module';
import { PaymentModule } from '@/modules/payment/payment.module';
import { DriverModule } from '@/modules/driver/driver.module';
import { UtilsModule } from '@/utils/utils.module';
import { UserModule } from '@/modules/user/user.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { WalletModule } from '@/modules/wallet/wallet.module';
import { TripModule } from '@/modules/trip/trip.module';
import { TransactionModule } from '@/modules/transaction/transaction.module';
import { AffiliateModule } from '@/modules/affiliate/affiliate.module';

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
export class AppModule { }



