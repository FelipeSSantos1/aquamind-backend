import { ForbiddenException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { UserService } from 'src/user/user.service'
import { validateHash } from 'src/utils/crypt'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public async getAuthenticatedUser(email: string, hashedPassword: string) {
    try {
      const user = await this.userService.getByEmail({ email })
      const isPasswordMatching = await validateHash(
        hashedPassword,
        user.password,
      )
      if (!isPasswordMatching) return null

      user.password = undefined
      return user
    } catch (error) {
      throw new ForbiddenException('Something went wrong')
    }
  }

  public async createAccessToken(userId: string) {
    const payload: TokenPayload = { userId }
    const token = this.jwtService.sign(payload)

    return token
  }
}
