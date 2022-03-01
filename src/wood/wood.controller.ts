import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard'
import { GetByNameDto, WoodIdDto } from './dto/wood.dto'
import { WoodService } from './wood.service'

@Controller('wood')
export class WoodController {
  constructor(private woodService: WoodService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getAll() {
    return this.woodService.getAll()
  }

  @Get(':id')
  @Throttle(30, 60)
  @UseGuards(JwtAuthGuard)
  getById(@Param() { id }: WoodIdDto) {
    return this.woodService.getById({ id })
  }

  @Get('name/:name')
  @UseGuards(JwtAuthGuard)
  getByEmail(@Param() { name }: GetByNameDto) {
    return this.woodService.getByName({ name })
  }
}
