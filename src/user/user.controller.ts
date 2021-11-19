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
import { Throttle } from '@nestjs/throttler'
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard'
import { JwtResetPasswordGuard } from 'src/auth/jwtResetPassword.guard'
import { JwtVerifyEmailGuard } from 'src/auth/jwtVerifyEmail.guard'
import ReqWithUser from 'src/auth/reqWithUser.interface'
import {
  AddUserDto,
  GetByEmailDto,
  UserIdDto,
  FollowDto,
  SendVerifyEmail,
  UpdatePhotoDto,
  UpdateProfileDto,
  UpdatePNTokenDto,
  ResetPasswordDto
} from './dto/user.dto'
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

  @Get('profile/profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: ReqWithUser) {
    return this.userService.getProfile(req.user)
  }

  @Post()
  createUser(@Body() body: AddUserDto) {
    return this.userService.createUser(body)
  }

  @Post('follow')
  @UseGuards(JwtAuthGuard)
  follow(@Body() body: FollowDto, @Req() req: ReqWithUser) {
    return this.userService.follow(body, req.user)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteUser(@Param() { id }: UserIdDto, @Req() req: ReqWithUser) {
    return this.userService.deleteUser({ id }, req.user)
  }

  @Patch('deactivate')
  @UseGuards(JwtAuthGuard)
  deactiveUser(@Body() body: UserIdDto, @Req() req: ReqWithUser) {
    return this.userService.deactiveUser(body, req.user)
  }

  @Patch('activate')
  @UseGuards(JwtAuthGuard)
  activeUser(@Body() body: UserIdDto, @Req() req: ReqWithUser) {
    return this.userService.activeUser(body, req.user)
  }

  @Patch('verifyEmail')
  @UseGuards(JwtVerifyEmailGuard)
  verifyEmail(@Req() req: ReqWithUser) {
    return this.userService.verifyEmail(req.user)
  }

  @Post('sendVerifyEmail')
  @Throttle(2, 60)
  sendVerifyEmail(@Body() { email }: SendVerifyEmail) {
    return this.userService.sendVerifyEmail(email)
  }

  @Patch('updatePhoto')
  @UseGuards(JwtAuthGuard)
  updatePhoto(@Body() photo: UpdatePhotoDto, @Req() req: ReqWithUser) {
    return this.userService.updatePhoto(photo, req.user)
  }

  @Patch('resetPassword')
  @UseGuards(JwtResetPasswordGuard)
  resetPassword(@Body() body: ResetPasswordDto, @Req() req: ReqWithUser) {
    return this.userService.resetPassword(body, req.user)
  }

  @Patch('updateProfile')
  @UseGuards(JwtAuthGuard)
  updateProfile(@Body() body: UpdateProfileDto, @Req() req: ReqWithUser) {
    return this.userService.updateProfile(body, req.user)
  }

  @Patch('updatePNToken')
  @UseGuards(JwtAuthGuard)
  updatePNTonek(@Body() body: UpdatePNTokenDto, @Req() req: ReqWithUser) {
    return this.userService.updatePNToken(body, req.user)
  }
}
