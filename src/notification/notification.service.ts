import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Expo, ExpoPushMessage } from 'expo-server-sdk'
import { User } from '@prisma/client'

import { PrismaService } from 'src/prisma.service'
import { UserService } from 'src/user/user.service'
import { SendNotificationDto } from './dto/notification.dto'

@Injectable()
export class NotificationService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly userService: UserService
  ) {}

  async sendNotification(
    { profileId, title, body, data }: SendNotificationDto,
    user: User
  ) {
    try {
      const toProfileResponse = await this.userService.getByProfileId(profileId)
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

      return await this.prismaService.message.create({
        data: {
          title,
          message: body,
          fromProfileId: user.profileId,
          toProfileId: toProfileResponse.id,
          expoId:
            notificationResponse[0].status === 'ok'
              ? notificationResponse[0].id
              : undefined
        }
      })
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User to send not found')
      }
      if (error instanceof BadRequestException) {
        throw new BadRequestException(
          `Push token is not a valid Expo push token`
        )
      }
      throw new InternalServerErrorException('Something went wrong')
    }
  }
}
