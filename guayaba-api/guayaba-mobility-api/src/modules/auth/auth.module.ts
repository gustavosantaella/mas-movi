import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service.js';
import { AuthController } from './controllers/auth.controller.js';
import { UserModule } from '../user/user.module.js';
import { WalletModule } from '../wallet/wallet.module.js';
import { OcrController } from './controllers/ocr.controller.js';
import { OcrService } from './services/ocr.service.js';

@Module({
  imports: [UserModule, WalletModule],
  controllers: [AuthController, OcrController],
  providers: [AuthService, OcrService],
})
export class AuthModule {}

