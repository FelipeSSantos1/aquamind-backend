import {
  BadRequestException,
  ForbiddenException,
  Injectable
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { TokenType } from '@prisma/client'
import moment from 'moment'

import { PrismaService } from 'src/prisma.service'
import { UserService } from 'src/user/user.service'
import { validateHash } from 'src/utils/crypt'
import { createHashOneWay } from 'src/utils/crypt'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService
  ) {}

  public async getAuthenticatedUser(email: string, hashedPassword: string) {
    try {
      const user = await this.userService.getByEmail({ email })
      const isPasswordMatching = await validateHash(
        hashedPassword,
        user.password
      )
      if (!isPasswordMatching) return null

      user.password = undefined
      return user
    } catch (error) {
      throw new ForbiddenException('Something went wrong')
    }
  }

  public createAccessToken(userId: string) {
    const token = this.jwtService.sign(
      { userId },
      {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: `${this.configService.get(
          'JWT_ACCESS_TOKEN_EXPIRATION_TIME'
        )}m`
      }
    )

    return token
  }

  public async createRefreshToken(userId: string) {
    const token = this.jwtService.sign(
      { userId },
      {
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: `${this.configService.get(
          'JWT_REFRESH_TOKEN_EXPIRATION_TIME'
        )}y`
      }
    )

    try {
      const hashedToken = createHashOneWay(token)
      const expiration = moment().add(1, 'year').toISOString()
      await this.prismaService.token.upsert({
        create: {
          token: hashedToken,
          type: TokenType.REFRESHTOKEN,
          expiration,
          userId
        },
        update: {
          token: hashedToken,
          expiration,
          valid: true
        },
        where: {
          userId_type: {
            type: TokenType.REFRESHTOKEN,
            userId
          }
        }
      })

      return token
    } catch (error) {
      throw new BadRequestException()
    }
  }
}
