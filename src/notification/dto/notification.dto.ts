import { IsString, IsObject, IsNumber, IsOptional } from 'class-validator'

export class SendNotificationDto {
  @IsNumber()
  to: number

  @IsString()
  title?: string

  @IsString()
  body: string

  @IsOptional()
  @IsObject()
  postId?: number

  @IsOptional()
  @IsObject()
  commentId?: number

  @IsOptional()
  @IsObject()
  data?: Record<string, unknown>
}
