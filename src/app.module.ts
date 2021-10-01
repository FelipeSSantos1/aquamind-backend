import { Module } from '@nestjs/common'
import { UserController } from './user/user.controller'
import { PrismaService } from './prisma.service'
import { PasswordService } from './password/password.service'
@Module({
  imports: [],
  controllers: [UserController],
  providers: [PrismaService, PasswordService],
})
export class AppModule {}
