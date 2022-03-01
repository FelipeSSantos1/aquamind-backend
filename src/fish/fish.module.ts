import { Module } from '@nestjs/common'

import { FishController } from './fish.controller'
import { FishService } from './fish.service'
import { PrismaService } from 'src/prisma.service'

@Module({
  controllers: [FishController],
  providers: [FishService, PrismaService]
})
export class FishModule {}
