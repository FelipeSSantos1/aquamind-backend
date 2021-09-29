import { Controller, Get, Param } from '@nestjs/common'
import { User as UserModel } from '@prisma/client'
import { PrismaService } from '../prisma.service'

@Controller()
export class UserController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get('users')
  async getAll(): Promise<UserModel[]> {
    return this.prismaService.user.findMany()
  }

  @Get('user/:id')
  async getById(@Param('id') id: string): Promise<UserModel> {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
    })
  }

  @Get('user/email/:email')
  async getByEmail(@Param('email') email: string): Promise<UserModel> {
    return this.prismaService.user.findUnique({
      where: {
        email,
      },
    })
  }
}
