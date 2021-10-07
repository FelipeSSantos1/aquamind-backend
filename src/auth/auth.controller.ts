import { Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common'

import ReqWithUser from './reqWithUser.interface'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from './localAuth.guard'
import { JwtRefreshTokenGuard } from './jwtRefreshToken.guard'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async logIn(@Req() req: ReqWithUser) {
    const { user } = req
    const accessToken = this.authService.createAccessToken(user.id)
    const refreshToken = await this.authService.createRefreshToken(user.id)
    user.password = undefined

    return { ...user, accessToken, refreshToken }
  }

  @HttpCode(200)
  @UseGuards(JwtRefreshTokenGuard)
  @Get('refreshAccessToken')
  async refreshAccessToken(@Req() req: ReqWithUser) {
    const accessToken = this.authService.createAccessToken(req.user.id)

    return { accessToken }
  }
}
