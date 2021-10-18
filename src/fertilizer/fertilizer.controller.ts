import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { FertilizerService } from './fertilizer.service'
import { GetByIdDto, GetByNameDto } from './dto/fertilizer.dto'
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard'

@Controller('fertilizer')
export class FertilizerController {
  constructor(private readonly fertilizerService: FertilizerService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getAll() {
    return this.fertilizerService.getAll()
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getById(@Param() { id }: GetByIdDto) {
    return this.fertilizerService.getById({ id })
  }

  @Get('name/:name')
  @UseGuards(JwtAuthGuard)
  getByEmail(@Param() { name }: GetByNameDto) {
    return this.fertilizerService.getByName({ name })
  }
}
