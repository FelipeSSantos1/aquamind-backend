import { ForbiddenException, Injectable } from '@nestjs/common'

import { UserService } from 'src/user/user.service'
import { MailService } from 'src/mail/mail.service'
import { validateHash } from 'src/utils/crypt'

@Injectable()
export class AuthService {
  constructor(
    private mailService: MailService,
    private userService: UserService,
  ) {}

  async forgotPassword(email: string) {
    // const token = Math.floor(1000 + Math.random() * 9000).toString();
    // create user in db
    // ...
    // send mail with url to define a new password
    // await this.mailService.forgotPassword(url);
  }

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
}
