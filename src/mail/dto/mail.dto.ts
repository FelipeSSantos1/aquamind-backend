import { IsString, IsNotEmpty } from 'class-validator'

export class SendMailDto {
  @IsNotEmpty()
  @IsString()
  subject: string

  @IsNotEmpty()
  @IsString()
  text: string
}
