import { IsString, IsObject, IsNumber, IsOptional } from 'class-validator'

export class SendNotificationDto {
  @IsNumber()
  profileId: number

  @IsString()
  title?: string

  @IsString()
  body: string

  @IsOptional()
  @IsObject()
  data?: Record<string, unknown>
}
