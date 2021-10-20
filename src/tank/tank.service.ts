import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import { Prisma, User } from '@prisma/client'

import { PrismaService } from 'src/prisma.service'
import { PrismaError } from 'src/utils/prismaError'
import { UpdateTankDto, CreateTankDto } from './dto/tank.dto'

@Injectable()
export class TankService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(tank: CreateTankDto, user: User) {
    try {
      const result = await this.prismaService.tank.create({
        data: {
          height: tank.height,
          length: tank.length,
          name: tank.name,
          width: tank.width,
          born: tank.born,
          co2: tank.co2,
          dayLight: tank.dayLight,
          description: tank.description,
          filter: tank.filter,
          gravel: tank.gravel,
          light: tank.light,
          public: tank.public,
          location: tank.location,
          avatar: tank.avatar,
          profileId: user.profileId
        }
      })

      return result
    } catch (error) {
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('Some of your input has a wrong value')
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaError.ForeignKeyConstraint) {
          throw new NotFoundException('Create a profile before add a tank')
        }
      }
      throw new InternalServerErrorException('Something went wrong')
    }
  }

  findAll() {
    return `This action returns all tank`
  }

  findOne(id: number) {
    return `This action returns a #${id} tank`
  }

  update(id: number, updateTankDto: UpdateTankDto) {
    console.log(updateTankDto)
    return `This action updates a #${id} tank`
  }

  remove(id: number) {
    return `This action removes a #${id} tank`
  }
}
