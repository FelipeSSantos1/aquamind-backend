import { Type } from 'class-transformer'
import {
  IsString,
  IsNumberString,
  IsISO8601,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  Min,
  IsNumber,
  IsBase64,
  ValidateNested,
  IsArray
} from 'class-validator'

export class GetTankByIdDto {
  @IsNumberString()
  id: string
}
export class CreateTankDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsISO8601()
  @IsOptional()
  born: string

  @IsNumber()
  @Min(10)
  length: number

  @IsNumber()
  @Min(10)
  width: number

  @IsNumber()
  @Min(10)
  height: number

  @IsOptional()
  @IsString()
  light?: string

  @IsOptional()
  @IsString()
  gravel?: string

  @IsNumber()
  @Min(0.5)
  @IsOptional()
  co2?: number

  @IsNumber()
  @Min(1)
  @IsOptional()
  dayLight?: number

  @IsOptional()
  @IsString()
  filter?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsBase64()
  avatar?: string

  @IsBoolean()
  @IsOptional()
  public?: boolean

  @IsOptional()
  @IsString()
  location?: string

  @ValidateNested({ each: true })
  @IsOptional()
  @IsArray()
  @Type(() => Plant)
  plants?: {
    plantId: number
  }[]

  @ValidateNested({ each: true })
  @IsOptional()
  @IsArray()
  @Type(() => Fertilizer)
  ferts?: {
    fertilizerId: number
  }[]
}

class Fertilizer {
  @IsNumber()
  fertilizerId: number

  @IsNumber()
  amount: number
}
class Plant {
  @IsNumber()
  plantId: number
}

export class UpdateTankDto {
  @IsNumberString()
  id: string
}
