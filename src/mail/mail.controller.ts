import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'

import { JwtAuthGuard } from 'src/auth/jwtAuth.guard'
import ReqWithUser from 'src/auth/reqWithUser.interface'
import { SendMailDto } from './dto/mail.dto'
import { MailService } from './mail.service'

@Controller('mail')
export class MailController {
  constructor(private mailService: MailService) {}

  @Post('contactUs')
  @Throttle(5, 60)
  @UseGuards(JwtAuthGuard)
  contactUS(@Body() createPostDto: SendMailDto, @Req() req: ReqWithUser) {
    return this.mailService.contactUs(createPostDto, req.user)
  }
}
