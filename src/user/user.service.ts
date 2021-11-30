import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import { Prisma, Role, TokenType, User } from '@prisma/client'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import crypto from 'crypto'
import moment from 'moment'

import { PrismaError } from 'src/utils/prismaError'
import { MailService } from 'src/mail/mail.service'
import { PrismaService } from 'src/prisma.service'
import {
  AddUserDto,
  GetByEmailDto,
  UserIdDto,
  FollowDto,
  UpdatePhotoDto,
  UpdateProfileDto,
  UpdatePNTokenDto,
  ResetPasswordDto
} from './dto/user.dto'
import { createHash } from 'src/utils/crypt'
import { FilesService } from 'src/files/files.service'

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly filesService: FilesService
  ) {}

  getAll() {
    return this.prismaService.user.findMany({
      select: {
        id: true,
        email: true,
        active: true,
        role: true,
        Profile: true
      },
      where: {
        active: true
      }
    })
  }

  async getById({ id }: UserIdDto) {
    try {
      const result = await this.prismaService.user.findUnique({
        where: {
          id
        },
        include: {
          Profile: true
        }
      })

      result.password = undefined
      result.pnToken = undefined
      return result
    } catch (error) {
      throw new BadRequestException()
    }
  }

  async getByPNToken(token: string) {
    try {
      const result = await this.prismaService.user.findUnique({
        where: {
          pnToken: token
        },
        include: {
          Profile: true
        }
      })

      result.password = undefined
      result.pnToken = undefined
      return result
    } catch (error) {
      throw new BadRequestException()
    }
  }

  async getByIdWithEmailToken({ id }: UserIdDto) {
    try {
      const result = await this.prismaService.user.findUnique({
        where: {
          id
        },
        include: {
          Profile: true,
          Tokens: {
            where: {
              type: TokenType.EMAIL
            }
          }
        }
      })

      result.password = undefined
      result.pnToken = undefined
      return result
    } catch (error) {
      throw new BadRequestException()
    }
  }

  async getByIdWithForgotPasswordToken({ id }: UserIdDto) {
    try {
      const result = await this.prismaService.user.findUnique({
        where: {
          id
        },
        include: {
          Profile: true,
          Tokens: {
            where: {
              type: TokenType.FORGOTPASSWORD
            }
          }
        }
      })

      result.password = undefined
      result.pnToken = undefined
      return result
    } catch (error) {
      throw new BadRequestException()
    }
  }

  async getByIdWithRefreshToken({ id }: UserIdDto) {
    try {
      const result = await this.prismaService.user.findUnique({
        where: {
          id
        },
        include: {
          Profile: true,
          Tokens: {
            where: {
              type: TokenType.REFRESHTOKEN
            }
          }
        }
      })

      result.password = undefined
      result.pnToken = undefined
      return result
    } catch (error) {
      throw new BadRequestException()
    }
  }

  async getByEmail({ email }: GetByEmailDto) {
    const result = await this.prismaService.user.findUnique({
      where: {
        email
      },
      include: {
        Profile: true
      }
    })

    return result
  }

  async getProfile(user: User) {
    const result = await this.prismaService.profile.findUnique({
      where: {
        id: user.profileId
      },
      include: {
        User: true,
        _count: true
      }
    })
    result.User.password = undefined

    return result
  }

  async getByProfileId(profileId: number) {
    try {
      const result = await this.prismaService.profile.findUnique({
        where: {
          id: profileId
        },
        include: {
          User: true,
          _count: true
        }
      })
      if (!result) {
        throw new NotFoundException()
      }
      result.User.password = undefined

      return result
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User to send not found')
      }
    }
  }

  async createUser({ email, password }: AddUserDto) {
    if (email && password) {
      try {
        const result = await this.prismaService.user.create({
          data: {
            email,
            password: createHash(password),
            Profile: {
              create: {
                username: `${email.split('@')[0]}_${crypto
                  .randomBytes(3)
                  .toString('hex')}`
              }
            }
          }
        })

        const expiration = moment().add(
          this.configService.get('JWT_VERIFY_EMAIL_EXPIRATION_TIME'),
          'minutes'
        )
        const token = this.jwtService.sign(
          { userId: result.id },
          {
            secret: this.configService.get('JWT_VERIFY_EMAIL_TOKEN'),
            expiresIn: `${this.configService.get(
              'JWT_VERIFY_EMAIL_EXPIRATION_TIME'
            )}m`
          }
        )
        await this.prismaService.token.create({
          data: {
            expiration: expiration.toDate(),
            type: TokenType.EMAIL,
            token,
            userId: result.id
          }
        })

        const emailSent = await this.mailService.confirmEmail(
          token,
          email,
          expiration.utc().toString()
        )

        result.password = undefined
        return { ...result, emailSent }
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === PrismaError.UniqueConstraint) {
            throw new ConflictException(`Email ${email} already in use`)
          }
        }
        throw new InternalServerErrorException('Something went wrong')
      }
    }
  }

  async follow({ id }: FollowDto, user: User) {
    try {
      return await this.prismaService.follower.create({
        data: {
          idFollower: user.profileId,
          idFollowing: id
        }
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaError.ForeignKeyConstraint) {
          throw new BadRequestException("User doesn't exist")
        }
        if (error.code === PrismaError.UniqueConstraint) {
          throw new ConflictException('You are already following this user')
        }
      }
      throw new InternalServerErrorException('Something went wrong')
    }
  }

  async deleteUser({ id }: UserIdDto, user: User) {
    try {
      if (user.id !== id && user.role !== Role.ADMIN) {
        throw new ForbiddenException()
      }

      await this.prismaService.user.delete({
        where: {
          id
        }
      })
      return true
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw new ForbiddenException('You are not allowed to delete this user')
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaError.RecordDoesNotExist) {
          throw new NotFoundException('User to delete does not exist')
        }
      }
      throw new BadRequestException()
    }
  }

  async deactiveUser({ id }: UserIdDto, user: User) {
    try {
      if (user.id !== id && user.role !== Role.ADMIN) {
        throw new ForbiddenException()
      }

      const result = await this.prismaService.user.update({
        where: {
          id
        },
        data: {
          active: false
        },
        include: {
          Profile: true
        }
      })

      result.password = undefined
      result.pnToken = undefined
      return result
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw new ForbiddenException(
          'You are not allowed to deactivate this user'
        )
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaError.RecordDoesNotExist) {
          throw new NotFoundException('User does not exist')
        }
      }
      throw new BadRequestException()
    }
  }

  async activeUser({ id }: UserIdDto, user: User) {
    try {
      if (user.id !== id && user.role !== Role.ADMIN) {
        throw new ForbiddenException()
      }

      const result = await this.prismaService.user.update({
        where: {
          id
        },
        data: {
          active: true
        },
        include: {
          Profile: true
        }
      })

      result.password = undefined
      result.pnToken = undefined
      return result
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw new ForbiddenException(
          'You are not allowed to activate this user'
        )
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaError.RecordDoesNotExist) {
          throw new NotFoundException('User does not exist')
        }
      }
      throw new BadRequestException()
    }
  }

  async sendVerifyEmail(email: string) {
    try {
      const user = await this.getByEmail({ email })

      if (!user) {
        throw new NotFoundException()
      }
      await this.prismaService.token.deleteMany({
        where: {
          userId: user.id,
          type: TokenType.EMAIL
        }
      })

      const expiration = moment().add(
        this.configService.get('JWT_VERIFY_EMAIL_EXPIRATION_TIME'),
        'minutes'
      )
      const token = this.jwtService.sign(
        { userId: user.id },
        {
          secret: this.configService.get('JWT_VERIFY_EMAIL_TOKEN'),
          expiresIn: `${this.configService.get(
            'JWT_VERIFY_EMAIL_EXPIRATION_TIME'
          )}m`
        }
      )
      await this.prismaService.token.create({
        data: {
          expiration: expiration.toDate(),
          type: TokenType.EMAIL,
          token,
          userId: user.id
        }
      })

      const emailSent = await this.mailService.confirmEmail(
        token,
        email,
        expiration.utc().toString()
      )

      return emailSent
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Email does not exist in our system')
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaError.RecordDoesNotExist) {
          throw new NotFoundException('Email does not exist')
        }
      }
      throw new InternalServerErrorException('Something went wrong')
    }
  }

  async verifyEmail(user: User) {
    try {
      const result = await this.prismaService.user.update({
        where: {
          id: user.id
        },
        data: {
          active: true,
          emailVerified: true
        }
      })

      await this.prismaService.token.deleteMany({
        where: {
          userId: user.id,
          type: TokenType.EMAIL
        }
      })

      result.password = undefined
      result.pnToken = undefined
      return result
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaError.RecordDoesNotExist) {
          throw new NotFoundException('User does not exist')
        }
      }
      throw new InternalServerErrorException('Something went wrong')
    }
  }

  async updatePhoto(photo: UpdatePhotoDto, user: User) {
    try {
      const uploadedFile = !!photo.avatar
        ? await this.filesService.uploadProfileAvatar(
            photo.avatar,
            user.profileId
          )
        : null

      const result = await this.prismaService.profile.update({
        where: {
          id: user.profileId
        },
        data: {
          avatar: !!uploadedFile ? uploadedFile.Key : ''
        }
      })

      if (!result) throw new NotFoundException()
      return result
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Profile not found')
      }
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('Some of your input has a wrong value')
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaError.RecordDoesNotExist) {
          throw new NotFoundException('Profile not found')
        }
      }
      throw new InternalServerErrorException('Something went wrong')
    }
  }

  async resetPassword(body: ResetPasswordDto, user: User) {
    try {
      const result = await this.prismaService.user.update({
        where: {
          id: user.id
        },
        data: {
          password: createHash(body.password)
        }
      })

      if (!result) throw new NotFoundException()

      result.password = undefined
      result.pnToken = undefined
      await this.prismaService.token.deleteMany({
        where: {
          userId: user.id,
          type: TokenType.FORGOTPASSWORD
        }
      })

      return result
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Profile not found')
      }
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('Some of your input has a wrong value')
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaError.RecordDoesNotExist) {
          throw new NotFoundException('Profile not found')
        }
      }
      throw new InternalServerErrorException('Something went wrong')
    }
  }

  async updateProfile(body: UpdateProfileDto, user: User) {
    try {
      const result = await this.prismaService.profile.update({
        where: {
          id: user.profileId
        },
        data: {
          ...body
        },
        include: {
          User: true,
          _count: true
        }
      })

      if (!result) throw new NotFoundException()

      return result
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Profile not found')
      }
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('Some of your input has a wrong value')
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaError.RecordDoesNotExist) {
          throw new NotFoundException('Profile not found')
        }
        if (error.code === PrismaError.UniqueConstraint) {
          throw new ConflictException('Username already in use')
        }
      }
      throw new InternalServerErrorException('Something went wrong')
    }
  }

  async updatePNToken(body: UpdatePNTokenDto, user: User) {
    try {
      const result = await this.prismaService.user.update({
        where: {
          id: user.id
        },
        data: {
          pnToken: body.token
        }
      })

      if (!result) throw new NotFoundException()

      result.password = undefined
      result.pnToken = undefined
      return result
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User not found')
      }
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('Some of your input has a wrong value')
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaError.RecordDoesNotExist) {
          throw new NotFoundException('User not found')
        }
      }
      throw new InternalServerErrorException('Something went wrong')
    }
  }
}
