import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Expo, ExpoPushMessage } from 'expo-server-sdk'
import { Prisma, User } from '@prisma/client'

import { PrismaService } from 'src/prisma.service'
import { UserService } from 'src/user/user.service'
import { SendNotificationDto } from './dto/notification.dto'
import { PrismaError } from 'src/utils/prismaError'

@Injectable()
export class NotificationService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly userService: UserService
  ) {}

  async sendNotification(
    { to, title, body, commentId, postId, data }: SendNotificationDto,
    user: User
  ) {
    try {
      const toProfileResponse = await this.userService.getByProfileId(to)
      const { pnToken } = toProfileResponse.User

      if (!Expo.isExpoPushToken(pnToken)) {
        throw new BadRequestException()
      }

      const expo = new Expo({
        accessToken: this.configService.get('EXPO_PUSH_NOTIFICATION')
      })
      const message: ExpoPushMessage = {
        to: pnToken,
        sound: 'default',
        title,
        body,
        data
      }
      const notificationResponse = await expo.sendPushNotificationsAsync([
        message
      ])

      return await this.prismaService.notification.create({
        data: {
          title,
          message: body,
          fromProfileId: user.profileId,
          toProfileId: toProfileResponse.id,
          postId,
          commentId,
          expoId:
            notificationResponse[0].status === 'ok'
              ? notificationResponse[0].id
              : undefined
        }
      })
    } catch (error) {
      console.log({ error })
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaError.ForeignKeyConstraint) {
          throw new NotFoundException('ForeignKeyConstraint')
        }
      }
      if (error instanceof BadRequestException) {
        throw new BadRequestException(
          `Push token is not a valid Expo push token`
        )
      }
      throw new InternalServerErrorException('Something went wrong')
    }
  }

  getAllByUser(user: User) {
    return this.prismaService.notification.findMany({
      where: {
        toProfileId: user.profileId
      },
      select: {
        id: true,
        fromProfileId: true,
        toProfileId: true,
        message: true,
        createdAt: true,
        title: true,
        read: true,
        commentId: true,
        postId: true
      },
      orderBy: [
        {
          createdAt: 'desc'
        }
      ]
    })
  }
}
