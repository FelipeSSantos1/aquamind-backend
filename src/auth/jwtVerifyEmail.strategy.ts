import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { Request } from 'express'
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
      secretOrKey: configService.get('JWT_VERIFY_EMAIL_TOKEN'),
      passReqToCallback: true
    })
  }

  async validate(request: Request, payload: TokenPayload) {
    try {
      const user = await this.userService.getByIdWithEmailToken({
        id: payload.userId
      })

      const reqToken = ExtractJwt.fromAuthHeaderAsBearerToken()(request)
      const dbToken = user.Tokens[0].token

      if (dbToken !== reqToken) return null

      return user
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User not found')
      }
      throw new ForbiddenException()
    }
  }
}
