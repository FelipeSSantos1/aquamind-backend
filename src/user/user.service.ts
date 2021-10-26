import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import { Prisma, Role, TokenType, User } from '@prisma/client'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import crypto from 'crypto'
import moment from 'moment'

import { PrismaError } from 'src/utils/prismaError'
import { MailService } from 'src/mail/mail.service'
import { PrismaService } from 'src/prisma.service'
import { AddUserDto, GetByEmailDto, UserIdDto } from './dto/user.dto'
import { createHash } from 'src/utils/crypt'

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  getAll() {
    return this.prismaService.user.findMany({
      select: {
        id: true,
        email: true,
        active: true,
        role: true,
        Profile: true
      },
      where: {
        active: true
      }
    })
  }

  async getById({ id }: UserIdDto) {
    try {
      const result = await this.prismaService.user.findUnique({
        where: {
          id
        },
        include: {
          Profile: true
        }
      })

      result.password = undefined
      return result
    } catch (error) {
      throw new BadRequestException()
    }
  }

  async getByIdWithRefreshToken({ id }: UserIdDto) {
    try {
      const result = await this.prismaService.user.findUnique({
        where: {
          id
        },
        include: {
          Profile: true,
          Tokens: {
            where: {
              type: TokenType.REFRESHTOKEN
            }
          }
        }
      })

      result.password = undefined
      return result
    } catch (error) {
      throw new BadRequestException()
    }
  }

  async getByEmail({ email }: GetByEmailDto) {
    const result = await this.prismaService.user.findUnique({
      where: {
        email
      },
      include: {
        Profile: true
      }
    })

    return result
  }

  async addUser({ email, password }: AddUserDto) {
    if (email && password) {
      try {
        const result = await this.prismaService.user.create({
          data: {
            email,
            password: createHash(password),
            profileId: (
              await this.prismaService.profile.create({
                data: {
                  username: `${email.split('@')[0]}_${crypto
                    .randomBytes(3)
                    .toString('hex')}`
                }
              })
            ).id
          }
        })

        const expiration = moment().add(
          this.configService.get('JWT_VERIFY_EMAIL_EXPIRATION_TIME'),
          'minutes'
        )
        const token = this.jwtService.sign(
          { userId: result.id },
          {
            secret: this.configService.get('JWT_VERIFY_EMAIL_TOKEN'),
            expiresIn: `${this.configService.get(
              'JWT_VERIFY_EMAIL_EXPIRATION_TIME'
            )}m`
          }
        )
        await this.prismaService.token.create({
          data: {
            expiration: expiration.toDate(),
            type: TokenType.EMAIL,
            token,
            userId: result.id
          }
        })

        const emailSent = await this.mailService.confirmEmail(
          token,
          email,
          expiration.utc().toString()
        )

        result.password = undefined
        return { ...result, emailSent }
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === PrismaError.UniqueConstraint) {
            throw new ConflictException(`Email ${email} already in use`)
          }
        }
        throw new InternalServerErrorException('Something went wrong')
      }
    }
  }

  async deleteUser({ id }: UserIdDto, user: User) {
    try {
      if (user.id !== id && user.role !== Role.ADMIN) {
        throw new ForbiddenException()
      }

      await this.prismaService.user.delete({
        where: {
          id
        }
      })
      return true
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw new ForbiddenException('You are not allowed to delete this user')
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaError.RecordDoesNotExist) {
          throw new NotFoundException('User to delete does not exist')
        }
      }
      throw new BadRequestException()
    }
  }

  async deactiveUser({ id }: UserIdDto, user: User) {
    try {
      if (user.id !== id && user.role !== Role.ADMIN) {
        throw new ForbiddenException()
      }

      const result = await this.prismaService.user.update({
        where: {
          id
        },
        data: {
          active: false
        },
        include: {
          Profile: true
        }
      })

      result.password = undefined
      return result
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw new ForbiddenException(
          'You are not allowed to deactivate this user'
        )
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaError.RecordDoesNotExist) {
          throw new NotFoundException('User does not exist')
        }
      }
      throw new BadRequestException()
    }
  }

  async activeUser({ id }: UserIdDto, user: User) {
    try {
      if (user.id !== id && user.role !== Role.ADMIN) {
        throw new ForbiddenException()
      }

      const result = await this.prismaService.user.update({
        where: {
          id
        },
        data: {
          active: true
        },
        include: {
          Profile: true
        }
      })

      result.password = undefined
      return result
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw new ForbiddenException(
          'You are not allowed to activate this user'
        )
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaError.RecordDoesNotExist) {
          throw new NotFoundException('User does not exist')
        }
      }
      throw new BadRequestException()
    }
  }

  async verifyEmail(user: User) {
    try {
      return await this.prismaService.user.update({
        where: {
          id: user.id
        },
        data: {
          active: true,
          emailVerified: true
        }
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaError.RecordDoesNotExist) {
          throw new NotFoundException('User does not exist')
        }
      }
      throw new BadRequestException()
    }
  }
}
