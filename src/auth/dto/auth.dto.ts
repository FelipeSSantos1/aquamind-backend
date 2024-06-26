import { IsEmail, IsString, IsNotEmpty, MinLength, IsIP } from 'class-validator'

export class LogInDto {
  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  password: string
}

export class ForgotPasswordDto {
  @IsEmail()
  email: string

  @IsIP()
  ip: string

  @IsString()
  @IsNotEmpty()
  device: string
}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  password: string
}
