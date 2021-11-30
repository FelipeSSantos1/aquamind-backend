import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard'
import ReqWithUser from 'src/auth/reqWithUser.interface'
import { SendNotificationDto } from './dto/notification.dto'
import { NotificationService } from './notification.service'

@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Post('one')
  @UseGuards(JwtAuthGuard)
  sendNotification(@Body() body: SendNotificationDto, @Req() req: ReqWithUser) {
    return this.notificationService.sendNotification(body, req.user)
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getAllByUser(@Req() req: ReqWithUser) {
    return this.notificationService.getAllByUser(req.user)
  }
}
