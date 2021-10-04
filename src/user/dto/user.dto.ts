import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  IsUUID,
} from 'class-validator'

export class AddUserDto {
  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  password: string
}

export class GetByEmailDto {
  @IsEmail()
  email: string
}

export class UserIdDto {
  @IsUUID()
  id: string
}
