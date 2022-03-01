import { Module } from '@nestjs/common'

import { WoodController } from './wood.controller'
import { WoodService } from './wood.service'
import { PrismaService } from 'src/prisma.service'

@Module({
  controllers: [WoodController],
  providers: [WoodService, PrismaService]
})
export class WoodModule {}
