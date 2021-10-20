import { Module } from '@nestjs/common'

import { TankService } from './tank.service'
import { TankController } from './tank.controller'
import { PrismaService } from 'src/prisma.service'

@Module({
  controllers: [TankController],
  providers: [TankService, PrismaService]
})
export class TankModule {}
