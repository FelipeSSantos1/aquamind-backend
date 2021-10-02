import { Injectable } from '@nestjs/common'
import { MailService } from '../mail/mail.service'

@Injectable()
export class AuthService {
  constructor(private mailService: MailService) {}

  async forgotPassword(email: string) {
    // const token = Math.floor(1000 + Math.random() * 9000).toString();
    // create user in db
    // ...
    // send mail with url to define a new password
    // await this.mailService.forgotPassword(url);
  }

  generateEmailToken(): string {
    return Math.floor(10000000 + Math.random() * 90000000).toString()
  }
}
