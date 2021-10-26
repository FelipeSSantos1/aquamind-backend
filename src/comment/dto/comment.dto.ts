import { IsString, IsNumber, IsOptional } from 'class-validator'

export class CreateCommentDto {
  @IsNumber()
  postId: number

  @IsString()
  comment: string

  @IsNumber()
  @IsOptional()
  parentId?: number
}

export class LikeCommentDto {
  @IsNumber()
  commentId: number
}
