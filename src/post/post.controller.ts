import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common'
import { PostService } from './post.service'
import { GetPostByIdDto, CreatePostDto, UpdatePostDto } from './dto/post.dto'

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto)
  }

  @Get()
  findAll() {
    return this.postService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: GetPostByIdDto) {
    return this.postService.findOne(id)
  }

  @Put(':id')
  update(
    @Param('id') id: GetPostByIdDto,
    @Body() updatePostDto: UpdatePostDto
  ) {
    return this.postService.update(+id, updatePostDto)
  }

  @Delete(':id')
  remove(@Param('id') id: GetPostByIdDto) {
    return this.postService.remove(id)
  }
}
