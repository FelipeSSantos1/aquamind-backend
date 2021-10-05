import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { PrismaService } from './prisma.service'
import { MailModule } from './mail/mail.module'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailModule,
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
