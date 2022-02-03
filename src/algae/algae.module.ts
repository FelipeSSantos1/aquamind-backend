import { Module } from '@nestjs/common'

import { AlgaeController } from './algae.controller'
import { AlgaeService } from './algae.service'
import { PrismaService } from 'src/prisma.service'

@Module({
  controllers: [AlgaeController],
  providers: [AlgaeService, PrismaService]
})
export class AlgaeModule {}
