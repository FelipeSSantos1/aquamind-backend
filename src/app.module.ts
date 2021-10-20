import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import Joi from '@hapi/joi'

import { MailModule } from './mail/mail.module'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { PlantModule } from './plant/plant.module'
import { FertilizerModule } from './fertilizer/fertilizer.module'
import { PostModule } from './post/post.module'
import { TankModule } from './tank/tank.module'
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        MAIL_FROM: Joi.string().required(),
        MAIL_API_KEY: Joi.string().required(),
        MAIL_CONFIRMATION_ENDPOINT: Joi.string().required(),
        DATABASE_URL: Joi.string().required()
      })
    }),
    MailModule,
    AuthModule,
    UserModule,
    PlantModule,
    FertilizerModule,
    PostModule,
    TankModule
  ],
  controllers: []
})
export class AppModule {}
