import { Module } from '@nestjs/common'

import { PostService } from './post.service'
import { PostController } from './post.controller'
import { PrismaService } from 'src/prisma.service'
import { FilesModule } from 'src/files/files.module'

@Module({
  imports: [FilesModule],
  controllers: [PostController],
  providers: [PostService, PrismaService]
})
export class PostModule {}
