import { BadRequestException, Injectable } from '@nestjs/common'

import { PrismaService } from 'src/prisma.service'
import { GetByNameDto, PlantIdDto } from './dto/plant.dto'

@Injectable()
export class PlantService {
  constructor(private readonly prismaService: PrismaService) {}

  getAll() {
    return this.prismaService.plant.findMany({
      include: {
        Brand: true,
        Photos: true
      },
      orderBy: [
        {
          name: 'asc'
        },
        {
          scientificName: 'asc'
        }
      ]
    })
  }

  async getById({ id }: PlantIdDto) {
    try {
      const result = await this.prismaService.plant.findUnique({
        where: {
          id: Number(id)
        },
        include: {
          Brand: true,
          Photos: true
        }
      })

      return result
    } catch (error) {
      throw new BadRequestException()
    }
  }

  async getByName({ name }: GetByNameDto) {
    const result = await this.prismaService.plant.findMany({
      where: {
        OR: [
          {
            name: {
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
        Brand: true,
        Photos: true
      },
      orderBy: [
        {
          name: 'asc'
        },
        {
          scientificName: 'asc'
        }
      ]
    })

    return result
  }
}
