import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import Joi from '@hapi/joi'

import { NotificationModule } from './notification/notification.module'
import { MailModule } from './mail/mail.module'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { PlantModule } from './plant/plant.module'
import { AlgaeModule } from './algae/algae.module'
import { StoneModule } from './stone/stone.module'
import { FertilizerModule } from './fertilizer/fertilizer.module'
import { PostModule } from './post/post.module'
import { TankModule } from './tank/tank.module'
import { FilesModule } from './files/files.module'
import { CommentModule } from './comment/comment.module'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'
@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RESET_PASSWORD_ENDPOINT: Joi.string().required(),
        JWT_FORGOT_PASSWORD_TOKEN: Joi.string().required(),
        EXPO_PUSH_NOTIFICATION: Joi.string().required(),
        JWT_FORGOT_PASSWORD_EXPIRATION_TIME: Joi.string().required(),
        JWT_VERIFY_EMAIL_TOKEN: Joi.string().required(),
        JWT_VERIFY_EMAIL_EXPIRATION_TIME: Joi.string().required(),
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        MAIL_FROM: Joi.string().required(),
        MAIL_API_KEY: Joi.string().required(),
        MAIL_CONFIRMATION_ENDPOINT: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),
        DO_REGION: Joi.string().required(),
        DO_ACCESS_KEY_ID: Joi.string().required(),
        DO_SECRET_ACCESS_KEY: Joi.string().required(),
        DO_SPACES_NAME: Joi.string().required(),
        DO_ENDPOINT_URL: Joi.string().required()
      })
    }),
    MailModule,
    AuthModule,
    UserModule,
    PlantModule,
    AlgaeModule,
    StoneModule,
    FertilizerModule,
    PostModule,
    TankModule,
    FilesModule,
    NotificationModule,
    CommentModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class AppModule {}
