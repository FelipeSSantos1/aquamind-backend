import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'

import { PlantController } from './plant.controller'
import { PlantService } from './plant.service'
import { PrismaService } from 'src/prisma.service'
import { MailService } from 'src/mail/mail.service'

@Module({
  imports: [ConfigModule, JwtModule.register({})],
  controllers: [PlantController],
  providers: [PlantService, PrismaService, MailService],
  exports: [PlantService]
})
export class PlantModule {}
