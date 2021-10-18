import { Module } from '@nestjs/common'

import { PlantController } from './plant.controller'
import { PlantService } from './plant.service'
import { PrismaService } from 'src/prisma.service'

@Module({
  controllers: [PlantController],
  providers: [PlantService, PrismaService]
})
export class PlantModule {}
