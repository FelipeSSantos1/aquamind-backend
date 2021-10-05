import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { PrismaService } from '../prisma.service'
import { AuthService } from '../auth/auth.service'
import { MailService } from '../mail/mail.service'

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, AuthService, MailService],
  exports: [UserService],
})
export class UserModule {}
