import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  IsUUID,
  IsNumber
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
  @IsNotEmpty()
  id: string
}

export class FollowDto {
  @IsNumber()
  id: number
}
