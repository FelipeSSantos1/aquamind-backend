/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@nestjs/common'
import Mailgun from 'mailgun.js'
import formData from 'form-data'
import { ConfigService } from '@nestjs/config'

import { ForgotPasswordDto } from 'src/auth/dto/auth.dto'
import { sendMailProps, forgotPasswordProps } from './types'

@Injectable()
export class MailService {
  constructor() {}

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
    const url = `${config.get('MAIL_CONFIRMATION_ENDPOINT')}/token=${token}`
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
    const url = `${config.get('RESET_PASSWORD_ENDPOINT')}/token=${token}`
    return await this.sendMail({
      to: email,
      subject: 'Reset your password',
      template: 'reset-password',
      params: { url, email, expiresIn, ...params },
      text: `Reset your password accessing ${url}`
    })
  }
}
