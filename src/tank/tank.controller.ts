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
import { CreateTankDto, UpdateTankDto, UpdatePhotoDto } from './dto/tank.dto'
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
  findOne(@Param() { id }: FindOneParam) {
    return this.tankService.findOne(Number(id))
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param() { id }: FindOneParam, @Body() tank: UpdateTankDto) {
    return this.tankService.update(Number(id), tank)
  }

  @Patch('updatePhoto/:id')
  @UseGuards(JwtAuthGuard)
  updatePhoto(
    @Param() { id }: FindOneParam,
    @Body() photo: UpdatePhotoDto,
    @Req() req: ReqWithUser
  ) {
    return this.tankService.updatePhoto(Number(id), photo, req.user)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param() { id }: FindOneParam) {
    return this.tankService.remove(Number(id))
  }
}
