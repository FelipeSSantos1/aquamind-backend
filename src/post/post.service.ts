import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import { Prisma, User } from '@prisma/client'
import _ from 'lodash'

import { FilesService } from 'src/files/files.service'
import { PrismaService } from 'src/prisma.service'
import { PrismaError } from 'src/utils/prismaError'
import { GetPostByIdDto, CreatePostDto, UpdatePostDto } from './dto/post.dto'

@Injectable()
export class PostService {
  constructor(
    private readonly filesService: FilesService,
    private readonly prismaService: PrismaService
  ) {}

  async create(post: CreatePostDto, user: User) {
    const fileNames = await this.filesService.uploadPostPhotos(
      post.photos,
      user.profileId
    )

    const imagePaths = _.map(fileNames, (url) => {
      return { url }
    })

    try {
      const result = await this.prismaService.post.create({
        data: {
          profileId: user.profileId,
          description: post.description,
          Photos: {
            createMany: {
              data: imagePaths
            }
          }
        },
        include: {
          Photos: true
        }
      })

      return result
    } catch (error) {
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('Some of your input has a wrong value')
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaError.ForeignKeyConstraint) {
          throw new NotFoundException('ForeignKeyConstraint')
        }
      }
      throw new InternalServerErrorException('Something went wrong')
    }
  }

  async findAllPaginated(take = 10, cursor = 0) {
    try {
      if (!cursor) {
        const firstQuery = await this.prismaService.post.findMany({
          take,
          include: {
            Photos: {
              select: {
                id: true,
                url: true
              }
            },
            Profile: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true,
                country: true
              }
            },
            _count: {
              select: {
                Comment: true,
                LikePost: true
              }
            }
          },
          orderBy: {
            id: 'desc'
          }
        })

        return firstQuery
      } else {
        const nextQuery = await this.prismaService.post.findMany({
          take,
          skip: 1,
          cursor: {
            id: cursor
          },
          include: {
            Photos: {
              select: {
                id: true,
                url: true
              }
            },
            Profile: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true,
                country: true
              }
            },
            _count: {
              select: {
                Comment: true,
                LikePost: true
              }
            }
          },
          orderBy: {
            id: 'desc'
          }
        })

        return nextQuery
      }
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong')
    }
  }

  findOne(id: GetPostByIdDto) {
    return `This action returns a #${id} post`
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`
  }

  remove(id: GetPostByIdDto) {
    return `This action removes a #${id} post`
  }
}
