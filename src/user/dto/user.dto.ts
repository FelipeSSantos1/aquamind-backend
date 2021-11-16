import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  IsUUID,
  IsNumber,
  IsBase64,
  IsOptional
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

export class SendVerifyEmail {
  @IsEmail()
  email: string
}
export class UpdatePhotoDto {
  @IsBase64()
  avatar: string
}
export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name: string

  @IsString()
  @IsNotEmpty()
  username: string

  @IsOptional()
  @IsString()
  country: string

  @IsOptional()
  @IsString()
  bio: string
}

export class UpdatePNTokenDto {
  @IsString()
  @IsNotEmpty()
  token: string
}
