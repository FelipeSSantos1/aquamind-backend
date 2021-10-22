import {
  IsString,
  IsNumberString,
  IsArray,
  IsOptional,
  IsBase64
} from 'class-validator'

export class GetPostByIdDto {
  @IsNumberString()
  id: string
}
export class CreatePostDto {
  @IsArray()
  @IsBase64({ each: true })
  photos: string[]

  @IsString()
  @IsOptional()
  description?: string
}
export class UpdatePostDto {}
