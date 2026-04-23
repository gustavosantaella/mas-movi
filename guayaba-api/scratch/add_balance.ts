import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WalletService } from './modules/wallet/services/wallet.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const walletService = app.get(WalletService);

  const userId = 3;
  const amount = 500;
  
  console.log(`Adding ${amount} to user ${userId}...`);
  await walletService.updateBalance(userId, amount);
  console.log('Done!');
  
  await app.close();
}
bootstrap();
