import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards
} from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard'
import { JwtVerifyEmailGuard } from 'src/auth/jwtVerifyEmail.guard'
import ReqWithUser from 'src/auth/reqWithUser.interface'
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
  async deleteUser(@Param() { id }: UserIdDto, @Req() req: ReqWithUser) {
    return this.userService.deleteUser({ id }, req.user)
  }

  @Patch('deactivate')
  @UseGuards(JwtAuthGuard)
  async deactiveUser(@Body() body: UserIdDto, @Req() req: ReqWithUser) {
    return this.userService.deactiveUser(body, req.user)
  }

  @Patch('activate')
  @UseGuards(JwtAuthGuard)
  async activeUser(@Body() body: UserIdDto, @Req() req: ReqWithUser) {
    return this.userService.activeUser(body, req.user)
  }

  @Patch('verifyEmail')
  @UseGuards(JwtVerifyEmailGuard)
  async verifyEmail(@Req() req: ReqWithUser) {
    return this.userService.verifyEmail(req.user)
  }
}
