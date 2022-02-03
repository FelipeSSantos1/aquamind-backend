import { BadRequestException, Injectable } from '@nestjs/common'

import { PrismaService } from 'src/prisma.service'
import { GetByNameDto, AlgaeIdDto } from './dto/algae.dto'

@Injectable()
export class AlgaeService {
  constructor(private readonly prismaService: PrismaService) {}

  getAll() {
    return this.prismaService.algae.findMany({
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

  async getById({ id }: AlgaeIdDto) {
    try {
      const result = await this.prismaService.algae.findUnique({
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
    const result = await this.prismaService.algae.findMany({
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
