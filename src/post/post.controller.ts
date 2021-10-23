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
import {
  GetPostByIdDto,
  CreatePostDto,
  UpdatePostDto,
  GetAllPaginationParam
} from './dto/post.dto'
import ReqWithUser from 'src/auth/reqWithUser.interface'
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard'
import { FindOneParam } from 'src/utils/findOneParam'

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createPostDto: CreatePostDto, @Req() req: ReqWithUser) {
    return this.postService.create(createPostDto, req.user)
  }

  @Get('paginate/:take/:cursor')
  @UseGuards(JwtAuthGuard)
  findAllPaginated(@Param() { take, cursor }: GetAllPaginationParam) {
    return this.postService.findAllPaginated(Number(take), Number(cursor))
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param() { id }: FindOneParam) {
    return this.postService.findOne(Number(id))
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
