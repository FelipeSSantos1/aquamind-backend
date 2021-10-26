import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { UserService } from 'src/user/user.service'

@Injectable()
export class JwtVerifyEmailStrategy extends PassportStrategy(
  Strategy,
  'jwt-verify-email'
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_VERIFY_EMAIL_TOKEN')
    })
  }

  async validate(payload: TokenPayload) {
    try {
      const user = await this.userService.getById({ id: payload.userId })

      return user
    } catch (error) {
      return null
    }
  }
}
