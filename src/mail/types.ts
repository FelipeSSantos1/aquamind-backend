export type sendMailProps = {
  to: string
  subject: string
  params: any
  template: string
  text?: string
}

export type forgotPasswordProps = {
  token: string
  email: string
  name: string
  ip: string
  expiresIn: string
}
