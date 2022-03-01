import { BadRequestException, Injectable } from '@nestjs/common'

import { PrismaService } from 'src/prisma.service'
import { GetByNameDto, WoodIdDto } from './dto/wood.dto'

@Injectable()
export class WoodService {
  constructor(private readonly prismaService: PrismaService) {}

  getAll() {
    return this.prismaService.wood.findMany({
      select: {
        id: true,
        name: true,
        thumb: true
      },
      orderBy: [
        {
          name: 'asc'
        }
      ]
    })
  }

  async getById({ id }: WoodIdDto) {
    try {
      const result = await this.prismaService.wood.findUnique({
        where: {
          id: Number(id)
        },
        include: {
          Photos: true
        }
      })

      return result
    } catch (error) {
      throw new BadRequestException()
    }
  }

  async getByName({ name }: GetByNameDto) {
    const result = await this.prismaService.wood.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive'
        }
      },
      include: {
        Photos: true
      },
      orderBy: [
        {
          name: 'asc'
        }
      ]
    })

    return result
  }
}
