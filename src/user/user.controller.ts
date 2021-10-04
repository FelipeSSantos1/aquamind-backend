import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { AddUserDto, GetByEmailDto, UserIdDto } from './dto/user.dto'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('users')
  getAll() {
    return this.userService.getAll()
  }

  @Get(':id')
  getById(@Param() { id }: UserIdDto) {
    return this.userService.getById({ id })
  }

  @Get('email/:email')
  getByEmail(@Param() { email }: GetByEmailDto) {
    return this.userService.getByEmail({ email })
  }

  @Post()
  async addUser(@Body() body: AddUserDto) {
    return this.userService.addUser(body)
  }

  @Delete(':id')
  async deleteUser(@Param() { id }: UserIdDto) {
    return this.userService.deleteUser({ id })
  }

  @Put('deactivate')
  async deactiveUser(@Body() body: UserIdDto) {
    return this.userService.deactiveUser(body)
  }

  @Put('activate')
  async activeUser(@Body() body: UserIdDto) {
    return this.userService.activeUser(body)
  }
}
