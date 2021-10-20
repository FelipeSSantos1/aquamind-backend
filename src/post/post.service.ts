import { Injectable } from '@nestjs/common'
import { GetPostByIdDto, CreatePostDto, UpdatePostDto } from './dto/post.dto'

@Injectable()
export class PostService {
  create(createPostDto: CreatePostDto) {
    return 'This action adds a new post'
  }

  findAll() {
    return `This action returns all post`
  }

  findOne(id: GetPostByIdDto) {
    return `This action returns a #${id} post`
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`
  }

  remove(id: GetPostByIdDto) {
    return `This action removes a #${id} post`
  }
}
