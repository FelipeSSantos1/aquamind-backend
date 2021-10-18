import { BadRequestException, Injectable } from '@nestjs/common'

import { GetByIdDto, GetByNameDto } from './dto/fertilizer.dto'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class FertilizerService {
  constructor(private readonly prismaService: PrismaService) {}

  getAll() {
    return this.prismaService.fertilizer.findMany({
      include: {
        Brand: true
      },
      orderBy: [
        {
          name: 'asc'
        }
      ]
    })
  }

  async getById({ id }: GetByIdDto) {
    try {
      const result = await this.prismaService.fertilizer.findUnique({
        where: {
          id: Number(id)
        },
        include: {
          Brand: true
        }
      })

      return result
    } catch (error) {
      throw new BadRequestException()
    }
  }

  public async getByName({ name }: GetByNameDto) {
    const result = await this.prismaService.fertilizer.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive'
        }
      },
      include: {
        Brand: true
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
