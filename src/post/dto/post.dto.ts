import {
  IsString,
  IsNumberString,
  IsArray,
  IsOptional,
  IsBase64,
  IsNumber
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

  @IsNumber()
  @IsOptional()
  tankId?: number
}
export class GetAllPaginationParam {
  @IsNumberString()
  take: string

  @IsNumberString()
  cursor: string
}
export class UpdatePostDto {}
