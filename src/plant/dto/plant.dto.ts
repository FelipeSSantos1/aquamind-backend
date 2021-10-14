import {
  IsString,
  IsNotEmpty,
  IsNumberString,
  MinLength
} from 'class-validator'

export class GetByNameDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string
}

export class PlantIdDto {
  @IsNumberString()
  id: string
}
