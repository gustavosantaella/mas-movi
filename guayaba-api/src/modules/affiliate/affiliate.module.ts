import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AffiliatedRecipient } from './entities/affiliated-recipient.entity.js';
import { AffiliateService } from './services/affiliate.service.js';
import { AffiliateController } from './controllers/affiliate.controller.js';
import { UserModule } from '../user/user.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([AffiliatedRecipient]),
    UserModule,
  ],
  controllers: [AffiliateController],
  providers: [AffiliateService],
  exports: [AffiliateService],
})
export class AffiliateModule { }
