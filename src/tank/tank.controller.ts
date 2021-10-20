import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req
} from '@nestjs/common'

import ReqWithUser from 'src/auth/reqWithUser.interface'
import { TankService } from './tank.service'
import { CreateTankDto, UpdateTankDto } from './dto/tank.dto'
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard'

@Controller('tank')
export class TankController {
  constructor(private readonly tankService: TankService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() tank: CreateTankDto, @Req() req: ReqWithUser) {
    return this.tankService.create(tank, req.user)
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.tankService.findAll()
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.tankService.findOne(+id)
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateTankDto: UpdateTankDto) {
    return this.tankService.update(+id, updateTankDto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.tankService.remove(+id)
  }
}
