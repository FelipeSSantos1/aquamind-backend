import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  UseGuards,
  Patch
} from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'

import { PostService } from './post.service'
import {
  CreatePostDto,
  UpdatePostDto,
  GetAllPaginationParam,
  LikePostDto
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

  @Post('like')
  @Throttle(30, 60)
  @UseGuards(JwtAuthGuard)
  likePost(@Body() likePostDto: LikePostDto, @Req() req: ReqWithUser) {
    return this.postService.likePost(req.user, likePostDto.postId)
  }

  @Delete('like/:id')
  @Throttle(30, 60)
  @UseGuards(JwtAuthGuard)
  dislikePost(@Param() { id }: FindOneParam, @Req() req: ReqWithUser) {
    return this.postService.dislikePost(req.user, Number(id))
  }

  @Get('paginate/:take/:cursor')
  @Throttle(30, 60)
  @UseGuards(JwtAuthGuard)
  findAllPaginated(
    @Param() { take, cursor }: GetAllPaginationParam,
    @Req() req: ReqWithUser
  ) {
    return this.postService.findAllPaginated(
      Number(take),
      Number(cursor),
      req.user
    )
  }

  @Get('onlyFollowing/paginate/:take/:cursor')
  @Throttle(30, 60)
  @UseGuards(JwtAuthGuard)
  findAllOnlyFollowingPaginated(
    @Param() { take, cursor }: GetAllPaginationParam,
    @Req() req: ReqWithUser
  ) {
    return this.postService.findAllOnlyFollowingPaginated(
      req.user,
      Number(take),
      Number(cursor)
    )
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param() { id }: FindOneParam, @Req() req: ReqWithUser) {
    return this.postService.findOne(Number(id), req.user)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param() { id }: FindOneParam,
    @Body() post: UpdatePostDto,
    @Req() req: ReqWithUser
  ) {
    return this.postService.update(Number(id), post, req.user)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param() { id }: FindOneParam, @Req() req: ReqWithUser) {
    return this.postService.remove(Number(id), req.user)
  }
}
