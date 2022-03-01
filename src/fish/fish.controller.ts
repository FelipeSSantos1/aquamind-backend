import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard'
import { GetByNameDto, FishIdDto } from './dto/fish.dto'
import { FishService } from './fish.service'

@Controller('fish')
export class FishController {
  constructor(private fishService: FishService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getAll() {
    return this.fishService.getAll()
  }

  @Get(':id')
  @Throttle(30, 60)
  @UseGuards(JwtAuthGuard)
  getById(@Param() { id }: FishIdDto) {
    return this.fishService.getById({ id })
  }

  @Get('name/:name')
  @UseGuards(JwtAuthGuard)
  getByEmail(@Param() { name }: GetByNameDto) {
    return this.fishService.getByName({ name })
  }
}
