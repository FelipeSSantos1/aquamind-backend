import {
  IsString,
  IsNumberString,
  IsISO8601,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  Min,
  IsNumber
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
  @IsString()
  avatar?: string

  @IsBoolean()
  @IsOptional()
  public?: boolean

  @IsOptional()
  @IsString()
  location?: string
}

export class UpdateTankDto {
  @IsNumberString()
  id: string
}
