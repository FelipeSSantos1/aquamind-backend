import { Module } from '@nestjs/common'

import { StoneController } from './stone.controller'
import { StoneService } from './stone.service'
import { PrismaService } from 'src/prisma.service'

@Module({
  controllers: [StoneController],
  providers: [StoneService, PrismaService]
})
export class StoneModule {}
