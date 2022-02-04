import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import { Prisma, Role, User } from '@prisma/client'
import _ from 'lodash'

import { FilesService } from 'src/files/files.service'
import { PrismaService } from 'src/prisma.service'
import { PrismaError } from 'src/utils/prismaError'
import { CreatePostDto, UpdatePostDto } from './dto/post.dto'

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

    const uploadedImages = _.map(fileNames, (file) => {
      return { url: file.image, width: file.width, height: file.height }
    })

    try {
      const result = await this.prismaService.post.create({
        data: {
          profileId: user.profileId,
          description: post.description,
          tankId: post.tankId,
          Photos: {
            createMany: {
              data: uploadedImages
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

  async findAllPaginated(take = 10, cursor = 0, user: User) {
    try {
      if (!cursor) {
        const firstQuery = await this.prismaService.post.findMany({
          take,
          include: {
            Photos: {
              select: {
                id: true,
                url: true,
                width: true,
                height: true
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
            Tank: {
              select: {
                id: true,
                location: true,
                length: true,
                width: true,
                height: true
              }
            },
            LikePost: {
              take: 1,
              select: {
                postId: true,
                profileId: true
              },
              where: {
                profileId: user.profileId
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
                url: true,
                width: true,
                height: true
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
            Tank: {
              select: {
                id: true,
                location: true,
                length: true,
                width: true,
                height: true
              }
            },
            LikePost: {
              take: 1,
              select: {
                postId: true,
                profileId: true
              },
              where: {
                profileId: user.profileId
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

  async findAllOnlyFollowingPaginated(user: User, take = 10, cursor = 0) {
    try {
      const following = await this.prismaService.follower.findMany({
        where: {
          idFollower: user.profileId
        },
        select: {
          idFollowing: true
        }
      })
      const followingIds = _.map(following, (follower) => follower.idFollowing)

      if (!cursor) {
        const firstQuery = await this.prismaService.post.findMany({
          take,
          where: {
            profileId: {
              in: followingIds
            }
          },
          include: {
            Photos: {
              select: {
                id: true,
                url: true,
                width: true,
                height: true
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
            Tank: {
              select: {
                id: true,
                location: true,
                length: true,
                width: true,
                height: true
              }
            },
            LikePost: {
              take: 1,
              select: {
                postId: true,
                profileId: true
              },
              where: {
                profileId: user.profileId
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
          where: {
            profileId: {
              in: followingIds
            }
          },
          include: {
            Photos: {
              select: {
                id: true,
                url: true,
                width: true,
                height: true
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
            Tank: {
              select: {
                id: true,
                location: true,
                length: true,
                width: true,
                height: true
              }
            },
            LikePost: {
              take: 1,
              select: {
                postId: true,
                profileId: true
              },
              where: {
                profileId: user.profileId
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

  async findOne(id: number, user: User) {
    try {
      const response = await this.prismaService.post.findFirst({
        where: {
          id
        },
        include: {
          Comment: {
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
          Photos: {
            select: {
              id: true,
              url: true,
              width: true,
              height: true
            }
          },
          Tank: {
            select: {
              avatar: true,
              born: true,
              co2: true,
              dayLight: true,
              description: true,
              filter: true,
              substrate: true,
              height: true,
              length: true,
              light: true,
              location: true,
              name: true,
              width: true,
              id: true,
              TankFertilizer: {
                select: {
                  amount: true,
                  Fertilizer: {
                    select: {
                      avatar: true,
                      name: true,
                      unit: true,
                      id: true,
                      Brand: {
                        select: {
                          name: true,
                          logo: true,
                          website: true,
                          id: true
                        }
                      }
                    }
                  }
                }
              },
              TankPlant: {
                select: {
                  Plant: {
                    select: {
                      avatar: true,
                      name: true,
                      id: true
                    }
                  }
                }
              }
            }
          },
          _count: {
            select: {
              LikePost: true,
              Comment: true
            }
          }
        }
      })

      const { Comment } = response

      for (const comment of Comment) {
        for (const childComment of comment.Comment) {
          _.remove(Comment, { id: childComment.id })
        }
      }
      response.Comment = _.sortBy(
        Comment,
        (comment) => -comment._count.LikeComment
      )

      return response
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong')
    }
  }

  async update(id: number, post: UpdatePostDto, user: User) {
    try {
      const postResponse = await this.findOne(id, user)

      if (
        postResponse &&
        postResponse.profileId !== user.profileId &&
        user.role !== Role.ADMIN
      ) {
        throw new ForbiddenException()
      }

      const result = await this.prismaService.post.update({
        where: {
          id
        },
        data: {
          ...post
        }
      })

      if (!result) throw new NotFoundException()
      return result
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw new ForbiddenException('You are not allowed to update this post')
      }
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Post not found')
      }
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('Some of your input has a wrong value')
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaError.RecordDoesNotExist) {
          throw new NotFoundException('Post not found')
        }
        if (error.code === PrismaError.ForeignKeyConstraint) {
          throw new NotFoundException('Tank not found constraint')
        }
      }
      throw new InternalServerErrorException('Something went wrong')
    }
  }

  async remove(id: number, user: User) {
    try {
      const post = await this.findOne(id, user)

      if (
        post &&
        post.profileId !== user.profileId &&
        user.role !== Role.ADMIN
      ) {
        throw new ForbiddenException()
      }

      return await this.prismaService.post.delete({
        where: {
          id
        }
      })
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw new ForbiddenException('You are not allowed to delete this post')
      }
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('Some of your input has a wrong value')
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaError.RecordDoesNotExist) {
          throw new NotFoundException('Post not found')
        }
      }
      throw new InternalServerErrorException('Something went wrong')
    }
  }

  async likePost(user: User, postId: number) {
    try {
      return await this.prismaService.likePost.create({
        data: {
          profileId: user.profileId,
          postId
        }
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('Some of your input has a wrong value')
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaError.ForeignKeyConstraint) {
          throw new NotFoundException('Post not found')
        }
        if (error.code === PrismaError.UniqueConstraint) {
          throw new ConflictException('Post already liked')
        }
      }
      throw new InternalServerErrorException('Something went wrong')
    }
  }

  async dislikePost(user: User, postId: number) {
    try {
      return await this.prismaService.likePost.delete({
        where: {
          postId_profileId: {
            profileId: user.profileId,
            postId
          }
        }
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('Some of your input has a wrong value')
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaError.RecordDoesNotExist) {
          throw new NotFoundException('Post not found')
        }
      }
      throw new InternalServerErrorException('Something went wrong')
    }
  }
}
