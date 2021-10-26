import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import { Prisma, Role, User } from '@prisma/client'

import { PrismaService } from 'src/prisma.service'
import { PrismaError } from 'src/utils/prismaError'
import { FilesService } from 'src/files/files.service'
import { UpdateTankDto, CreateTankDto, UpdatePhotoDto } from './dto/tank.dto'

@Injectable()
export class TankService {
  constructor(
    private readonly filesService: FilesService,
    private readonly prismaService: PrismaService
  ) {}

  async create(tank: CreateTankDto, user: User) {
    const uploadedFile = await this.filesService.uploadTankAvatar(
      tank.avatar,
      user.profileId
    )
    try {
      const result = await this.prismaService.tank.create({
        data: {
          height: tank.height,
          length: tank.length,
          name: tank.name,
          width: tank.width,
          born: tank.born,
          co2: tank.co2,
          dayLight: tank.dayLight,
          description: tank.description,
          filter: tank.filter,
          gravel: tank.gravel,
          light: tank.light,
          public: tank.public,
          location: tank.location,
          avatar: uploadedFile.Key,
          profileId: user.profileId,
          TankPlant: {
            createMany: {
              data: tank.plants ? [...tank.plants] : []
            }
          },
          TankFertilizer: {
            createMany: {
              data: tank.ferts ? [...tank.ferts] : []
            }
          }
        },
        include: {
          TankFertilizer: {
            include: {
              Fertilizer: true
            }
          },
          TankPlant: {
            include: {
              Plant: true
            }
          }
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

  async findAllByUser(user: User) {
    try {
      const result = this.prismaService.tank.findMany({
        where: {
          profileId: user.profileId
        },
        include: {
          TankFertilizer: {
            select: {
              amount: true,
              Fertilizer: {
                select: {
                  id: true,
                  avatar: true,
                  name: true,
                  unit: true
                }
              }
            },
            orderBy: {
              Fertilizer: {
                name: 'asc'
              }
            }
          },
          TankPlant: {
            select: {
              Plant: {
                select: {
                  id: true,
                  name: true,
                  avatar: true
                }
              }
            },
            orderBy: {
              Plant: {
                name: 'asc'
              }
            }
          }
        },
        orderBy: {
          born: 'desc'
        }
      })

      return result
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong')
    }
  }

  async findOne(id: number) {
    try {
      const result = await this.prismaService.tank.findFirst({
        where: {
          id
        },
        include: {
          TankFertilizer: {
            select: {
              amount: true,
              Fertilizer: {
                select: {
                  id: true,
                  avatar: true,
                  name: true,
                  unit: true
                }
              }
            },
            orderBy: {
              Fertilizer: {
                name: 'asc'
              }
            }
          },
          TankPlant: {
            select: {
              Plant: {
                select: {
                  id: true,
                  name: true,
                  avatar: true
                }
              }
            },
            orderBy: {
              Plant: {
                name: 'asc'
              }
            }
          }
        }
      })
      if (!result) {
        throw new NotFoundException()
      }

      return result
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Tank not found')
      }
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('Some of your input has a wrong value')
      }
      throw new InternalServerErrorException('Something went wrong')
    }
  }

  async update(id: number, tank: UpdateTankDto) {
    const { plants, ferts, ...restTank } = tank
    try {
      await this.prismaService.tankFertilizer.deleteMany({
        where: {
          tankId: id
        }
      })

      await this.prismaService.tankPlant.deleteMany({
        where: {
          tankId: id
        }
      })

      const result = await this.prismaService.tank.update({
        where: {
          id
        },
        data: {
          ...restTank,
          TankPlant: {
            createMany: {
              data: plants ? [...plants] : []
            }
          },
          TankFertilizer: {
            createMany: {
              data: ferts ? [...ferts] : []
            }
          }
        },
        include: {
          TankFertilizer: {
            select: {
              amount: true,
              Fertilizer: {
                select: {
                  id: true,
                  avatar: true,
                  name: true,
                  unit: true
                }
              }
            },
            orderBy: {
              Fertilizer: {
                name: 'asc'
              }
            }
          },
          TankPlant: {
            select: {
              Plant: {
                select: {
                  id: true,
                  name: true,
                  avatar: true
                }
              }
            },
            orderBy: {
              Plant: {
                name: 'asc'
              }
            }
          }
        }
      })

      if (!result) throw new NotFoundException()
      return result
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Tank not found')
      }
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('Some of your input has a wrong value')
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaError.RecordDoesNotExist) {
          throw new NotFoundException('Tank not found')
        }
      }
      throw new InternalServerErrorException('Something went wrong')
    }
  }

  async updatePhoto(id: number, photo: UpdatePhotoDto, user: User) {
    const uploadedFile = await this.filesService.uploadTankAvatar(
      photo.avatar,
      user.profileId
    )

    try {
      const result = await this.prismaService.tank.update({
        where: {
          id
        },
        data: {
          avatar: uploadedFile.Key
        },
        include: {
          TankFertilizer: {
            select: {
              amount: true,
              Fertilizer: {
                select: {
                  id: true,
                  avatar: true,
                  name: true,
                  unit: true
                }
              }
            },
            orderBy: {
              Fertilizer: {
                name: 'asc'
              }
            }
          },
          TankPlant: {
            select: {
              Plant: {
                select: {
                  id: true,
                  name: true,
                  avatar: true
                }
              }
            },
            orderBy: {
              Plant: {
                name: 'asc'
              }
            }
          }
        }
      })

      if (!result) throw new NotFoundException()
      return result
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Tank not found')
      }
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('Some of your input has a wrong value')
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaError.RecordDoesNotExist) {
          throw new NotFoundException('Tank not found')
        }
      }
      throw new InternalServerErrorException('Something went wrong')
    }
  }

  async remove(id: number, user: User) {
    try {
      const tank = await this.findOne(id)
      if (
        tank &&
        tank.profileId !== user.profileId &&
        user.role !== Role.ADMIN
      ) {
        throw new ForbiddenException()
      }

      return await this.prismaService.tank.delete({
        where: {
          id
        }
      })
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw new ForbiddenException('You are not allowed to delete this tank')
      }
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('Some of your input has a wrong value')
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaError.RecordDoesNotExist) {
          throw new NotFoundException('Tank not found')
        }
      }
      throw new InternalServerErrorException('Something went wrong')
    }
  }
}
