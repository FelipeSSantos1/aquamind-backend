import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards
} from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard'
import { AddUserDto, GetByEmailDto, UserIdDto } from './dto/user.dto'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('users')
  @UseGuards(JwtAuthGuard)
  getAll() {
    return this.userService.getAll()
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getById(@Param() { id }: UserIdDto) {
    return this.userService.getById({ id })
  }

  @Get('email/:email')
  @UseGuards(JwtAuthGuard)
  getByEmail(@Param() { email }: GetByEmailDto) {
    return this.userService.getByEmail({ email })
  }

  @Post()
  async addUser(@Body() body: AddUserDto) {
    return this.userService.addUser(body)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Param() { id }: UserIdDto) {
    return this.userService.deleteUser({ id })
  }

  @Put('deactivate')
  @UseGuards(JwtAuthGuard)
  async deactiveUser(@Body() body: UserIdDto) {
    return this.userService.deactiveUser(body)
  }

  @Put('activate')
  @UseGuards(JwtAuthGuard)
  async activeUser(@Body() body: UserIdDto) {
    return this.userService.activeUser(body)
  }
}
