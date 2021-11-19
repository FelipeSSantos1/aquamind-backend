import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import { Prisma, User, Role } from '@prisma/client'
import _ from 'lodash'

import { PrismaService } from 'src/prisma.service'
import { PrismaError } from 'src/utils/prismaError'
import { CreateCommentDto } from './dto/comment.dto'

@Injectable()
export class CommentService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCommentDto: CreateCommentDto, profileId: number) {
    try {
      return await this.prismaService.comment.create({
        data: {
          profileId,
          ...createCommentDto
        }
      })
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

  async findAllByPost(postId: number, user: User) {
    try {
      const result = await this.prismaService.comment.findMany({
        where: {
          postId
        },
        include: {
          Comment: {
            include: {
              Profile: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  avatar: true
                }
              },
              LikeComment: {
                take: 1,
                select: {
                  commentId: true,
                  profileId: true
                },
                where: {
                  profileId: user.profileId
                }
              },
              _count: {
                select: {
                  LikeComment: true
                }
              }
            },
            orderBy: {
              createdAt: 'asc'
            }
          },
          Profile: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true
            }
          },
          LikeComment: {
            take: 1,
            select: {
              commentId: true,
              profileId: true
            },
            where: {
              profileId: user.profileId
            }
          },
          _count: {
            select: {
              LikeComment: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      for (const comment of result) {
        for (const childComment of comment.Comment) {
          _.remove(result, { id: childComment.id })
        }
      }

      return _.sortBy(result, (comment) => -comment._count.LikeComment)
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

  async remove(id: number, user: User) {
    try {
      const comment = await this.prismaService.comment.findFirst({
        where: {
          id
        }
      })

      if (
        comment &&
        comment.profileId !== user.profileId &&
        user.role !== Role.ADMIN
      ) {
        throw new ForbiddenException()
      }

      return await this.prismaService.comment.delete({
        where: {
          id
        }
      })
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw new ForbiddenException(
          'You are not allowed to delete this comment'
        )
      }
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('Some of your input has a wrong value')
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaError.RecordDoesNotExist) {
          throw new NotFoundException('Comment not found')
        }
      }
      throw new InternalServerErrorException('Something went wrong')
    }
  }

  async likeComment(user: User, commentId: number) {
    try {
      return await this.prismaService.likeComment.create({
        data: {
          profileId: user.profileId,
          commentId
        }
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('Some of your input has a wrong value')
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaError.ForeignKeyConstraint) {
          throw new NotFoundException('Comment not found')
        }
        if (error.code === PrismaError.UniqueConstraint) {
          throw new ConflictException('Comment already liked')
        }
      }
      throw new InternalServerErrorException('Something went wrong')
    }
  }

  async dislikeComment(user: User, commentId: number) {
    try {
      return await this.prismaService.likeComment.delete({
        where: {
          profileId_commentId: {
            profileId: user.profileId,
            commentId
          }
        }
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('Some of your input has a wrong value')
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaError.RecordDoesNotExist) {
          throw new NotFoundException('Comment not found')
        }
      }
      throw new InternalServerErrorException('Something went wrong')
    }
  }
}
