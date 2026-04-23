import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller.js';
import { UserModule } from '../user/user.module';
import { WalletModule } from '../wallet/wallet.module';
import { OcrController } from './controllers/ocr.controller.js';
import { OcrService } from './services/ocr.service';

@Module({
  imports: [UserModule, WalletModule],
  controllers: [AuthController, OcrController],
  providers: [AuthService, OcrService],
})
export class AuthModule { }

