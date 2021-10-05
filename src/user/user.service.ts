import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Prisma, TokenType } from '@prisma/client'
import moment from 'moment'

import { PrismaError } from 'src/utils/prismaError'
import { MailService } from 'src/mail/mail.service'
import { PrismaService } from 'src/prisma.service'
import { AddUserDto, GetByEmailDto, UserIdDto } from './dto/user.dto'
import { createHash, generateEmailToken } from 'src/utils/crypt'

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private mailService: MailService,
  ) {}

  public getAll() {
    return this.prismaService.user.findMany({
      select: {
        id: true,
        email: true,
        active: true,
        role: true,
        profile: true,
      },
      where: {
        active: true,
      },
    })
  }

  public async getById({ id }: UserIdDto) {
    const result = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      include: {
        profile: true,
      },
    })

    result.password = undefined
    return result
  }

  public async getByEmail({ email }: GetByEmailDto) {
    const result = await this.prismaService.user.findUnique({
      where: {
        email,
      },
      include: {
        profile: true,
      },
    })

    result.password = undefined
    return result
  }

  public async addUser({ email, password }: AddUserDto) {
    if (email && password) {
      try {
        const expiration = moment().add(10, 'minutes').toDate()
        const token = generateEmailToken()

        const result = await this.prismaService.user.create({
          data: {
            email,
            password: await createHash(password),
            Token: {
              create: {
                expiration,
                type: TokenType.EMAIL,
                token,
              },
            },
          },
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
        throw new HttpException(
          'Something went wrong',
          HttpStatus.INTERNAL_SERVER_ERROR,
        )
      }
    }
  }

  public async deleteUser({ id }: UserIdDto) {
    if (id) {
      try {
        await this.prismaService.user.delete({
          where: {
            id,
          },
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
            id,
          },
          data: {
            active: false,
          },
          include: {
            profile: true,
          },
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
            id,
          },
          data: {
            active: true,
          },
          include: {
            profile: true,
          },
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
