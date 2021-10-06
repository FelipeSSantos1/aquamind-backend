import { Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common'

import ReqWithUser from './reqWithUser.interface'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from './localAuth.guard'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async logIn(@Req() req: ReqWithUser) {
    const { user } = req
    const accessToken = await this.authService.createAccessToken(user.id)
    user.password = undefined

    return { ...user, accessToken }
  }
}
