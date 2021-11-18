import { IsString, IsObject, IsNumber, IsOptional } from 'class-validator'

export class SendNotificationDto {
  @IsNumber()
  to: number

  @IsString()
  title?: string

  @IsString()
  body: string

  @IsOptional()
  @IsNumber()
  postId?: number

  @IsOptional()
  @IsNumber()
  commentId?: number

  @IsOptional()
  @IsObject()
  data?: Record<string, unknown>
}
