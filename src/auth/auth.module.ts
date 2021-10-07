import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'

import { UserModule } from 'src/user/user.module'
import { PrismaService } from 'src/prisma.service'
import { AuthService } from './auth.service'
import { LocalStrategy } from './local.strategy'
import { AuthController } from './auth.controller'
import { JwtStrategy } from './jwt.strategy'
import { JwtRefreshTokenStrategy } from './jwtrefreshtoken.strategy'

@Module({
  imports: [UserModule, PassportModule, ConfigModule, JwtModule.register({})],
  providers: [
    LocalStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    AuthService,
    PrismaService
  ],
  controllers: [AuthController]
})
export class AuthModule {}
