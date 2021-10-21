import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Patch
} from '@nestjs/common'

import ReqWithUser from 'src/auth/reqWithUser.interface'
import { TankService } from './tank.service'
import { CreateTankDto, UpdateTankDto } from './dto/tank.dto'
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard'
import { FindOneParam } from 'src/utils/findOneParam'

@Controller('tank')
export class TankController {
  constructor(private readonly tankService: TankService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() tank: CreateTankDto, @Req() req: ReqWithUser) {
    return this.tankService.create(tank, req.user)
  }

  @Get('byUser')
  @UseGuards(JwtAuthGuard)
  findAllByUser(@Req() req: ReqWithUser) {
    return this.tankService.findAllByUser(req.user)
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.tankService.findOne(+id)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param() { id }: FindOneParam, @Body() updateTankDto: UpdateTankDto) {
    return this.tankService.update(Number(id), updateTankDto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.tankService.remove(+id)
  }
}
