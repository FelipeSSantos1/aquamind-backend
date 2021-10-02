import { Module } from '@nestjs/common'
import { MailModule } from '../mail/mail.module'
import { AuthService } from './auth.service'

@Module({
  imports: [MailModule],
  providers: [AuthService],
})
export class AuthModule {}
