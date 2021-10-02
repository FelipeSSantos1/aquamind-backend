import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common'
import { User as UserModel, Prisma, TokenType } from '@prisma/client'
import { PrismaService } from '../prisma.service'
import moment from 'moment'

import { User } from './types'
import { PasswordService } from 'src/password/password.service'
import { MailService } from 'src/mail/mail.service'
import { AuthService } from 'src/auth/auth.service'

@Controller('user')
export class UserController {
  constructor(
    private readonly prismaService: PrismaService,
    private passwordService: PasswordService,
    private mailService: MailService,
    private authService: AuthService,
  ) {}

  @Get('users')
  getAll(): Promise<Omit<UserModel, 'password'>[]> {
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

  @Get(':id')
  getById(@Param('id') id: string) {
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

  @Get('email/:email')
  getByEmail(@Param('email') email: string) {
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

  @Post()
  async addUser(@Body() body: User) {
    const { email, password } = body
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
          if (error.code === 'P2002') {
            throw new ConflictException(`Email ${email} already in use`)
          }
        }
        throw new ConflictException()
      }
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    if (id) {
      try {
        await this.prismaService.user.delete({
          where: {
            id,
          },
        })
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2025') {
            throw new NotFoundException('Record to delete does not exist')
          }
        }
        throw new BadRequestException()
      }
    }
  }

  @Put('deactivate')
  async deactiveUser(@Body() body: { id: string }) {
    const { id } = body
    if (id) {
      try {
        await this.prismaService.user.update({
          where: {
            id,
          },
          data: {
            active: false,
          },
        })
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2025') {
            throw new NotFoundException('Record to delete does not exist')
          }
        }
        throw new BadRequestException()
      }
    }
  }

  @Put('activate')
  async activeUser(@Body() body: { id: string }) {
    const { id } = body
    if (id) {
      try {
        await this.prismaService.user.update({
          where: {
            id,
          },
          data: {
            active: true,
          },
        })
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2025') {
            throw new NotFoundException('Record to delete does not exist')
          }
        }
        throw new BadRequestException()
      }
    }
  }
}
