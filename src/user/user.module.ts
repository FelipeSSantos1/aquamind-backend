import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { PrismaService } from '../prisma.service'
import { MailService } from '../mail/mail.service'

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, MailService],
  exports: [UserService],
})
export class UserModule {}
