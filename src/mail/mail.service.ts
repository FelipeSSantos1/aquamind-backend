/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@nestjs/common'
import Mailgun from 'mailgun.js'
import formData from 'form-data'
import { ConfigService } from '@nestjs/config'

import { ForgotPasswordDto } from 'src/auth/dto/auth.dto'
import { PrismaService } from 'src/prisma.service'
import { SendMailDto } from './dto/mail.dto'
import { sendMailProps, forgotPasswordProps } from './types'
import { User } from '.prisma/client'

@Injectable()
export class MailService {
  constructor(private readonly prismaService: PrismaService) {}

  private async sendMail({
    to,
    subject,
    params,
    template,
    text = ''
  }: sendMailProps) {
    const config = new ConfigService()
    const domain = 'aquamind.app'
    const apiKey = config.get('MAIL_API_KEY')
    const mailgun = new Mailgun(formData)
    const mg = mailgun.client({
      username: 'api',
      key: apiKey
    })
    const mailgunData = {
      from: `Aquamind <${config.get('MAIL_FROM')}>`,
      to,
      subject,
      template,
      'h:X-Mailgun-Variables': JSON.stringify({
        ...params
      }),
      text
    }
    try {
      await mg.messages.create(domain, mailgunData)
      return true
    } catch (error) {
      return false
    }
  }

  async confirmEmail(token: string, email: string, expiresIn: string) {
    const config = new ConfigService()
    const url = `${config.get('MAIL_CONFIRMATION_ENDPOINT')}?token=${token}`
    return await this.sendMail({
      to: email,
      subject: 'Confirm your email',
      template: 'email-confirmation',
      params: { url, email, expiresIn },
      text: `confirm your email accessing ${url}`
    })
  }

  async forgotPassword({
    token,
    email,
    expiresIn,
    ...params
  }: forgotPasswordProps & ForgotPasswordDto) {
    const config = new ConfigService()
    const url = `${config.get('RESET_PASSWORD_ENDPOINT')}?token=${token}`
    return await this.sendMail({
      to: email,
      subject: 'Reset your password',
      template: 'reset-password',
      params: { url, email, expiresIn, ...params },
      text: `Reset your password accessing ${url}`
    })
  }

  async contactUs({ subject, text }: SendMailDto, user: User) {
    const config = new ConfigService()
    const domain = 'aquamind.app'
    const apiKey = config.get('MAIL_API_KEY')
    const mailgun = new Mailgun(formData)
    const mg = mailgun.client({
      username: 'api',
      key: apiKey
    })
    try {
      const response = await this.prismaService.profile.findUnique({
        where: {
          id: user.profileId
        }
      })
      const mailgunData = {
        from: `Aquamind <${config.get('MAIL_FROM')}>`,
        to: config.get('MAIL_TO'),
        subject,
        html: `<h1>${response.username} says:</h1><p>${text}</p><br /><h2>profile: ${response.id}</h2><h2>name: ${response.name}</h2><h2>country: ${response.country}</h2><h2>email: ${user.email}</h2>`
      }
      await mg.messages.create(domain, mailgunData)
      return true
    } catch (error) {
      return false
    }
  }
}
