import { Injectable, Inject } from '@nestjs/common';
import { Option } from '@common/types/option.type';
import { Post } from '@domain/post/post';
import { PostId } from '@domain/post/post-id';
import { POST_REPOSITORY, PostRepositoryPort } from '../port/out/post-repository.port';

@Injectable()
export class PostService {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: PostRepositoryPort,
  ) {}

  async getPostById(postId: string): Promise<Post | null> {
    const postOption = await this.postRepository.findById(PostId.create(postId));
    return Option.isSome(postOption) ? postOption.value : null;
  }
}