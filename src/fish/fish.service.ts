import { BadRequestException, Injectable } from '@nestjs/common'

import { PrismaService } from 'src/prisma.service'
import { GetByNameDto, FishIdDto } from './dto/fish.dto'

@Injectable()
export class FishService {
  constructor(private readonly prismaService: PrismaService) {}

  getAll() {
    return this.prismaService.fish.findMany({
      select: {
        id: true,
        commonName: true,
        scientificName: true,
        thumb: true,
        Photos: true
      },
      orderBy: [
        {
          scientificName: 'asc'
        }
      ]
    })
  }

  async getById({ id }: FishIdDto) {
    try {
      const result = await this.prismaService.fish.findUnique({
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
    const result = await this.prismaService.fish.findMany({
      where: {
        OR: [
          {
            commonName: {
              contains: name,
              mode: 'insensitive'
            }
          },
          {
            scientificName: {
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
          scientificName: 'asc'
        }
      ]
    })

    return result
  }
}
