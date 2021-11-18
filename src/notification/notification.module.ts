import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { PrismaService } from 'src/prisma.service'
import { UserModule } from 'src/user/user.module'
import { NotificationController } from './notification.controller'
import { NotificationService } from './notification.service'

@Module({
  imports: [ConfigModule, UserModule],
  controllers: [NotificationController],
  providers: [NotificationService, PrismaService]
})
export class NotificationModule {}
