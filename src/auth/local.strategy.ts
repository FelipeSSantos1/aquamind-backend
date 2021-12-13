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

      if (!user.active)
        throw new ForbiddenException(
          'Account not active. If you have not received an email, please ask for a new one at create account screen'
        )
      if (!user.emailVerified)
        throw new ForbiddenException(
          'Email not verified. If you have not received an email, please ask for a new one at create account screen'
        )

      return user
    } catch (error) {
      if (error instanceof ForbiddenException) throw error

      throw new ForbiddenException('Something went wrong')
    }
  }
}
