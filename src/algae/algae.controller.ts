import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard'
import { GetByNameDto, AlgaeIdDto } from './dto/algae.dto'
import { AlgaeService } from './algae.service'

@Controller('algae')
export class AlgaeController {
  constructor(private algaeService: AlgaeService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getAll() {
    return this.algaeService.getAll()
  }

  @Get(':id')
  @Throttle(30, 60)
  @UseGuards(JwtAuthGuard)
  getById(@Param() { id }: AlgaeIdDto) {
    return this.algaeService.getById({ id })
  }

  @Get('name/:name')
  @UseGuards(JwtAuthGuard)
  getByEmail(@Param() { name }: GetByNameDto) {
    return this.algaeService.getByName({ name })
  }
}
