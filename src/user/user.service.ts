import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Prisma, TokenType } from '@prisma/client'
import moment from 'moment'

import { PrismaError } from 'src/utils/prismaError'
import { AuthService } from 'src/auth/auth.service'
import { MailService } from 'src/mail/mail.service'
import { PasswordService } from 'src/password/password.service'
import { PrismaService } from 'src/prisma.service'
import { AddUserDto, GetByEmailDto, UserIdDto } from './dto/user.dto'

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private passwordService: PasswordService,
    private mailService: MailService,
    private authService: AuthService,
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

  public getById({ id }: UserIdDto) {
    return this.prismaService.user.findUnique({
      select: {
        id: true,
        email: true,
        active: true,
        role: true,
        profile: true,
      },
      where: {
        id,
      },
    })
  }

  public getByEmail({ email }: GetByEmailDto) {
    return this.prismaService.user.findUnique({
      select: {
        id: true,
        email: true,
        active: true,
        role: true,
        profile: true,
      },
      where: {
        email,
      },
    })
  }

  public async addUser({ email, password }: AddUserDto) {
    if (email && password) {
      try {
        const expiration = moment().add(10, 'minutes').toDate()
        const token = this.authService.generateEmailToken()

        const result = await this.prismaService.user.create({
          data: {
            email,
            password: await this.passwordService.hashPassword(password),
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

        return { id: result.id, emailSent }
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === PrismaError.UniqueConstraint) {
            throw new ConflictException(`Email ${email} already in use`)
          }
        }
        throw new ConflictException()
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
        return await this.prismaService.user.update({
          where: {
            id,
          },
          data: {
            active: false,
          },
          select: {
            id: true,
            email: true,
            active: true,
            role: true,
            profile: true,
          },
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

  public async activeUser({ id }: UserIdDto) {
    if (id) {
      try {
        return await this.prismaService.user.update({
          where: {
            id,
          },
          data: {
            active: true,
          },
          select: {
            id: true,
            email: true,
            active: true,
            role: true,
            profile: true,
          },
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
}
