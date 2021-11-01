import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { ForbiddenException, Injectable } from '@nestjs/common'
import { AuthService } from './auth.service'
import { Profile, User } from '.prisma/client'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email'
    })
  }

  async validate(email: string, password: string) {
    try {
      const user = await this.authService.getAuthenticatedUser(email, password)

      if (!user.active) throw new ForbiddenException('Account not active')
      if (!user.emailVerified)
        throw new ForbiddenException('Email not verified')

      return user
    } catch (error) {
      console.log(error)
      if (error instanceof ForbiddenException) throw error

      throw new ForbiddenException('Something went wrong')
    }
  }
}
