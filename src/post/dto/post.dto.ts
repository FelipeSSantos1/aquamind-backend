import {
  IsString,
  IsNotEmpty,
  IsNumberString,
  MinLength
} from 'class-validator'

export class GetPostByIdDto {
  @IsNumberString()
  id: string
}
export class CreatePostDto {
  @IsNumberString()
  id: string
}
export class UpdatePostDto {
  @IsNumberString()
  id: string
}
