/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@nestjs/common'
import Mailgun from 'mailgun.js'
import formData from 'form-data'
import { ConfigService } from '@nestjs/config'

import { sendMailProps } from './types'

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

  public async confirmEmail(token: string, email: string) {
    const url = `http://www.aquamind.app/confirmEmail/${token}`
    return await this.sendMail({
      to: email,
      subject: 'Confirm your email',
      template: 'email-confirmation',
      params: { url, email },
      text: `confirm your email accessing ${url}`
    })
  }
}
