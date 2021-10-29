import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { ForbiddenException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'
import moment from 'moment'

import { createHash } from 'src/utils/crypt'
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
    try {
      const user = await this.userService.getByIdWithRefreshToken({
        id: payload.userId
      })
      const refreshToken = ExtractJwt.fromAuthHeaderAsBearerToken()(request)

      if (user?.Tokens?.length) {
        const token = user.Tokens[0]
        const isSameToken = createHash(refreshToken) === token.token
        const isExpired = moment().isAfter(token.expiration)

        if (isSameToken && token.valid && !isExpired) return user
      }

      return null
    } catch (error) {
      throw new ForbiddenException()
    }
  }
}
