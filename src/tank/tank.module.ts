import { Module } from '@nestjs/common'

import { TankService } from './tank.service'
import { TankController } from './tank.controller'
import { PrismaService } from 'src/prisma.service'
import { FilesModule } from 'src/files/files.module'

@Module({
  imports: [FilesModule],
  controllers: [TankController],
  providers: [TankService, PrismaService]
})
export class TankModule {}
