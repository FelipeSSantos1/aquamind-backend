import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { PrismaService } from './prisma.service'
import { UserController } from './user/user.controller'
import { PasswordService } from './password/password.service'
import { AuthService } from './auth/auth.service'
import { MailModule } from './mail/mail.module'
import { AuthModule } from './auth/auth.module'
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailModule,
    AuthModule,
  ],
  controllers: [UserController],
  providers: [PrismaService, PasswordService, AuthService],
})
export class AppModule {}
