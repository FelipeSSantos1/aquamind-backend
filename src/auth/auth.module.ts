import { Module } from '@nestjs/common'

import { MailModule } from 'src/mail/mail.module'
import { AuthService } from './auth.service'
import { UserModule } from 'src/user/user.module'

@Module({
  imports: [MailModule, UserModule],
  providers: [AuthService],
})
export class AuthModule {}
