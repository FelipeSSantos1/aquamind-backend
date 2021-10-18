import { Module } from '@nestjs/common'

import { FertilizerService } from './fertilizer.service'
import { FertilizerController } from './fertilizer.controller'
import { PrismaService } from 'src/prisma.service'

@Module({
  controllers: [FertilizerController],
  providers: [FertilizerService, PrismaService]
})
export class FertilizerModule {}
