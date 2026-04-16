import { Global, Module } from '@nestjs/common';
import { JwtService } from './jwt.service.js';
import { MailtrapService } from './mailtrap.service.js';

@Global()
@Module({
  providers: [JwtService, MailtrapService],
  exports: [JwtService, MailtrapService],
})
export class UtilsModule {}
