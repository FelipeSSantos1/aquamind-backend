import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'

import { UserController } from './user.controller'
import { UserService } from './user.service'
import { PrismaService } from '../prisma.service'
import { MailService } from '../mail/mail.service'

@Module({
  imports: [ConfigModule, JwtModule.register({})],
  controllers: [UserController],
  providers: [UserService, PrismaService, MailService],
  exports: [UserService]
})
export class UserModule {}
