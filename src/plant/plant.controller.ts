import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard'
import { GetByNameDto, PlantIdDto } from './dto/plant.dto'
import { PlantService } from './plant.service'

@Controller('plant')
export class PlantController {
  constructor(private plantService: PlantService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getAll() {
    return this.plantService.getAll()
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getById(@Param() { id }: PlantIdDto) {
    return this.plantService.getById({ id })
  }

  @Get('name/:name')
  @UseGuards(JwtAuthGuard)
  getByEmail(@Param() { name }: GetByNameDto) {
    return this.plantService.getByName({ name })
  }
}
