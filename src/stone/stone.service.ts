import { BadRequestException, Injectable } from '@nestjs/common'

import { PrismaService } from 'src/prisma.service'
import { GetByNameDto, StoneIdDto } from './dto/stone.dto'

@Injectable()
export class StoneService {
  constructor(private readonly prismaService: PrismaService) {}

  getAll() {
    return this.prismaService.stone.findMany({
      include: {
        Photos: true
      },
      orderBy: [
        {
          name: 'asc'
        }
      ]
    })
  }

  async getById({ id }: StoneIdDto) {
    try {
      const result = await this.prismaService.stone.findUnique({
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
    const result = await this.prismaService.stone.findMany({
      where: {
        OR: [
          {
            name: {
              contains: name,
              mode: 'insensitive'
            }
          }
        ]
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
