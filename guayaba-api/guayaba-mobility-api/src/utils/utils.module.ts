import { Global, Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { MailtrapService } from './mailtrap.service';

@Global()
@Module({
  providers: [JwtService, MailtrapService],
  exports: [JwtService, MailtrapService],
})
export class UtilsModule { }
