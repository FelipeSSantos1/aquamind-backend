import { Module } from '@nestjs/common'

import { CommentService } from './comment.service'
import { NotificationModule } from '../notification/notification.module'
import { CommentController } from './comment.controller'
import { PrismaService } from 'src/prisma.service'

@Module({
  imports: [NotificationModule],
  controllers: [CommentController],
  providers: [CommentService, PrismaService]
})
export class CommentModule {}
