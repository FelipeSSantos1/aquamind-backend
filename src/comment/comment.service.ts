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

import { NotificationService } from 'src/notification/notification.service'
import { PrismaService } from 'src/prisma.service'
import { PrismaError } from 'src/utils/prismaError'
import { CreateCommentDto } from './dto/comment.dto'

@Injectable()
export class CommentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationService: NotificationService
  ) {}

  async create(createCommentDto: CreateCommentDto, user: User) {
    try {
      const createdComment = await this.prismaService.comment.create({
        data: {
          profileId: user.profileId,
          ...createCommentDto
        },
        include: {
          Profile: true
        }
      })

      const postOwner = await this.prismaService.post.findFirst({
        where: {
          id: createCommentDto.postId
        },
        include: {
          Profile: {
            include: {
              User: true
            }
          }
        }
      })

      if (postOwner.Profile.User) {
        this.notificationService.sendNotification(
          {
            to: postOwner.Profile.id,
            title: 'New comment',
            body: `${createdComment.Profile.username} commented on your post`,
            postId: createCommentDto.postId,
            commentId: createdComment.id,
            data: {
              url: `aquamindapp://likePostComment/${createCommentDto.postId}/${createdComment.id}`
            }
          },
          user
        )
      }

      return createdComment
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
      const likedComment = await this.prismaService.likeComment.create({
        data: {
          profileId: user.profileId,
          commentId
        },
        include: {
          Profile: true
        }
      })

      const commentOwner = await this.prismaService.comment.findFirst({
        where: {
          id: commentId
        },
        include: {
          Profile: {
            include: {
              User: true
            }
          }
        }
      })

      if (commentOwner) {
        this.notificationService.sendNotification(
          {
            to: commentOwner.profileId,
            title: 'Someone liked your comment',
            body: `${likedComment.Profile.username} liked your comment`,
            postId: commentOwner.postId,
            commentId: commentId,
            data: {
              url: `aquamindapp://likePostComment/${commentOwner.postId}/${commentId}`
            }
          },
          commentOwner.Profile.User
        )
      }

      return likedComment
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
