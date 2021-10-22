import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Req,
  UseGuards
} from '@nestjs/common'

import { PostService } from './post.service'
import { GetPostByIdDto, CreatePostDto, UpdatePostDto } from './dto/post.dto'
import ReqWithUser from 'src/auth/reqWithUser.interface'
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard'

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createPostDto: CreatePostDto, @Req() req: ReqWithUser) {
    return this.postService.create(createPostDto, req.user)
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.postService.findAll()
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: GetPostByIdDto) {
    return this.postService.findOne(id)
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: GetPostByIdDto,
    @Body() updatePostDto: UpdatePostDto
  ) {
    return this.postService.update(+id, updatePostDto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: GetPostByIdDto) {
    return this.postService.remove(id)
  }
}
