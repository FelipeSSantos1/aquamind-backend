import { Type } from 'class-transformer'
import {
  IsString,
  IsNumberString,
  IsOptional,
  IsBase64,
  IsNumber,
  ValidateNested,
  ArrayMinSize
} from 'class-validator'

export class Photo {
  @IsBase64()
  image: string

  @IsNumber()
  width: number

  @IsNumber()
  height: number
}
export class CreatePostDto {
  @ValidateNested({ each: true })
  @Type(() => Photo)
  @ArrayMinSize(1)
  photos: Photo[]

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
export class UpdatePostDto {
  @IsString()
  @IsOptional()
  description?: string

  @IsNumber()
  @IsOptional()
  tankId?: number
}

export class LikePostDto {
  @IsNumber()
  postId: number
}
