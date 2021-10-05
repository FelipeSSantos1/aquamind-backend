import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'

import { MailModule } from 'src/mail/mail.module'
import { UserModule } from 'src/user/user.module'
import { AuthService } from './auth.service'
import { LocalStrategy } from './local.strategy'
import { AuthController } from './auth.controller';

@Module({
  imports: [MailModule, UserModule, PassportModule],
  providers: [AuthService, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
