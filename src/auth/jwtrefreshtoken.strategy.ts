import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'
import moment from 'moment'

import { validateHash } from 'src/utils/crypt'
import { UserService } from 'src/user/user.service'

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token'
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET'),
      passReqToCallback: true
    })
  }

  async validate(request: Request, payload: TokenPayload) {
    const user = await this.userService.getByIdWithRefreshToken({
      id: payload.userId
    })
    const refreshToken = ExtractJwt.fromAuthHeaderAsBearerToken()(request)

    if (user?.Token?.length) {
      const token = user.Token[0]
      const isSameToken = await validateHash(refreshToken, token.token) //ToDo: bcrypt returns true to old JWT also
      const isExpired = moment().isAfter(token.expiration)

      if (isSameToken && token.valid && !isExpired) return user
    }

    return null
  }
}
