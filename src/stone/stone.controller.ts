import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard'
import { GetByNameDto, StoneIdDto } from './dto/stone.dto'
import { StoneService } from './stone.service'

@Controller('stone')
export class StoneController {
  constructor(private stoneService: StoneService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getAll() {
    return this.stoneService.getAll()
  }

  @Get(':id')
  @Throttle(30, 60)
  @UseGuards(JwtAuthGuard)
  getById(@Param() { id }: StoneIdDto) {
    return this.stoneService.getById({ id })
  }

  @Get('name/:name')
  @UseGuards(JwtAuthGuard)
  getByEmail(@Param() { name }: GetByNameDto) {
    return this.stoneService.getByName({ name })
  }
}
