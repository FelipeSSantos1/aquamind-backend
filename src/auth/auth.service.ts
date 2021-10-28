import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Prisma, TokenType, User } from '@prisma/client'
import moment from 'moment'

import { MailService } from 'src/mail/mail.service'
import { PrismaService } from 'src/prisma.service'
import { UserService } from 'src/user/user.service'
import { validateHash } from 'src/utils/crypt'
import { createHash } from 'src/utils/crypt'
import { PrismaError } from 'src/utils/prismaError'
import { ForgotPasswordDto } from './dto/auth.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService
  ) {}

  async getAuthenticatedUser(email: string, password: string) {
    try {
      const user = await this.userService.getByEmail({ email })
      const isPasswordMatching = validateHash(password, user.password)
      if (!isPasswordMatching) return null

      user.password = undefined
      return user
    } catch (error) {
      throw new ForbiddenException('Something went wrong')
    }
  }

  createAccessToken(userId: string) {
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

  async createRefreshToken(userId: string) {
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
      const hashedToken = createHash(token)
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

  async deleteRefreshToken(userId: string) {
    try {
      await this.prismaService.token.deleteMany({
        where: {
          userId,
          type: TokenType.REFRESHTOKEN
        }
      })

      return true
    } catch (error) {
      throw new BadRequestException()
    }
  }

  async forgotPassword(params: ForgotPasswordDto) {
    try {
      const user = await this.userService.getByEmail({ email: params.email })
      if (!user) {
        throw new NotFoundException()
      }
      await this.prismaService.token.deleteMany({
        where: {
          userId: user.id,
          type: TokenType.FORGOTPASSWORD
        }
      })

      const expiration = moment().add(
        this.configService.get('JWT_FORGOT_PASSWORD_EXPIRATION_TIME'),
        'minutes'
      )
      const token = this.jwtService.sign(
        { userId: user.id },
        {
          secret: this.configService.get('JWT_FORGOT_PASSWORD_TOKEN'),
          expiresIn: `${this.configService.get(
            'JWT_FORGOT_PASSWORD_EXPIRATION_TIME'
          )}m`
        }
      )
      await this.prismaService.token.create({
        data: {
          expiration: expiration.toDate(),
          type: TokenType.FORGOTPASSWORD,
          token,
          userId: user.id
        }
      })

      const emailSent = await this.mailService.forgotPassword({
        ...params,
        token,
        name: user.Profile.username,
        expiresIn: expiration.utc().toString()
      })

      return { emailSent }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Email does not exist in our system')
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaError.RecordDoesNotExist) {
          throw new NotFoundException('Email does not exist')
        }
      }
      throw new InternalServerErrorException('Something went wrong')
    }
  }

  async resetPassword(password: string, user: User) {
    try {
      await this.prismaService.token.deleteMany({
        where: {
          userId: user.id,
          type: TokenType.FORGOTPASSWORD
        }
      })

      const updatedUser = await this.prismaService.user.update({
        where: {
          id: user.id
        },
        data: {
          password: createHash(password)
        }
      })
      updatedUser.password = undefined

      return updatedUser
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User does not exist in our system')
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaError.RecordDoesNotExist) {
          throw new NotFoundException('User does not exist')
        }
      }
      throw new InternalServerErrorException('Something went wrong')
    }
  }
}
