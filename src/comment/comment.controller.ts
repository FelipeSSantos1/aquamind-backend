import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  UseGuards
} from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard'

import ReqWithUser from 'src/auth/reqWithUser.interface'
import { FindOneParam } from 'src/utils/findOneParam'
import { CommentService } from './comment.service'
import { CreateCommentDto, LikeCommentDto } from './dto/comment.dto'

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createCommentDto: CreateCommentDto, @Req() req: ReqWithUser) {
    return this.commentService.create(createCommentDto, req.user)
  }

  @Get(':id')
  @Throttle(30, 60)
  @UseGuards(JwtAuthGuard)
  findAllByPost(@Param() { id }: FindOneParam, @Req() req: ReqWithUser) {
    return this.commentService.findAllByPost(Number(id), req.user)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param() { id }: FindOneParam, @Req() req: ReqWithUser) {
    return this.commentService.remove(Number(id), req.user)
  }

  @Post('like')
  @Throttle(30, 60)
  @UseGuards(JwtAuthGuard)
  likeComment(@Body() likeCommentDto: LikeCommentDto, @Req() req: ReqWithUser) {
    return this.commentService.likeComment(req.user, likeCommentDto.commentId)
  }

  @Delete('like/:id')
  @Throttle(30, 60)
  @UseGuards(JwtAuthGuard)
  dislikeComment(@Param() { id }: FindOneParam, @Req() req: ReqWithUser) {
    return this.commentService.dislikeComment(req.user, Number(id))
  }
}
