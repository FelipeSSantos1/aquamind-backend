import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import { Prisma, TokenType } from '@prisma/client'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
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

  public getAll() {
    return this.prismaService.user.findMany({
      select: {
        id: true,
        email: true,
        active: true,
        role: true,
        profile: true
      },
      where: {
        active: true
      }
    })
  }

  public async getById({ id }: UserIdDto) {
    try {
      const result = await this.prismaService.user.findUnique({
        where: {
          id
        },
        include: {
          profile: true
        }
      })

      result.password = undefined
      return result
    } catch (error) {
      throw new BadRequestException()
    }
  }

  public async getByIdWithRefreshToken({ id }: UserIdDto) {
    try {
      const result = await this.prismaService.user.findUnique({
        where: {
          id
        },
        include: {
          profile: true,
          Token: {
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

  public async getByEmail({ email }: GetByEmailDto) {
    const result = await this.prismaService.user.findUnique({
      where: {
        email
      },
      include: {
        profile: true
      }
    })

    return result
  }

  public async addUser({ email, password }: AddUserDto) {
    if (email && password) {
      try {
        const result = await this.prismaService.user.create({
          data: {
            email,
            password: createHash(password)
          }
        })

        const expiration = moment().add(10, 'minutes').toDate()
        const token = this.jwtService.sign(
          { userId: result.id },
          {
            secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
            expiresIn: `${this.configService.get(
              'JWT_ACCESS_TOKEN_EXPIRATION_TIME'
            )}m`
          }
        )
        await this.prismaService.token.create({
          data: {
            expiration,
            type: TokenType.EMAIL,
            token,
            userId: result.id
          }
        })

        const emailSent = await this.mailService.confirmEmail(token, email)

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

  public async deleteUser({ id }: UserIdDto) {
    if (id) {
      try {
        await this.prismaService.user.delete({
          where: {
            id
          }
        })
        return true
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === PrismaError.RecordDoesNotExist) {
            throw new NotFoundException('User to delete does not exist')
          }
        }
        throw new BadRequestException()
      }
    }
  }

  public async deactiveUser({ id }: UserIdDto) {
    if (id) {
      try {
        const result = await this.prismaService.user.update({
          where: {
            id
          },
          data: {
            active: false
          },
          include: {
            profile: true
          }
        })

        result.password = undefined
        return result
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

  public async activeUser({ id }: UserIdDto) {
    if (id) {
      try {
        const result = await this.prismaService.user.update({
          where: {
            id
          },
          data: {
            active: true
          },
          include: {
            profile: true
          }
        })

        result.password = undefined
        return result
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
}
