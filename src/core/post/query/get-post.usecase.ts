import { Injectable, Inject } from '@nestjs/common';
import { Result } from '@common/types/result.type';
import { Option } from '@common/types/option.type';
import { Post } from '@domain/post/post';
import { PostId } from '@domain/post/post-id';
import { UserId } from '@domain/user/user-id';
import { PostNotFoundException, PostAccessDeniedException } from '@domain/post/post.exception';
import { POST_REPOSITORY, PostRepositoryPort } from '../port/out/post-repository.port';

export class GetPostQuery {
  constructor(
    public readonly postId: string,
    public readonly userId?: string,
  ) {}
}

@Injectable()
export class GetPostUseCase {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: PostRepositoryPort,
  ) {}

  async execute(query: GetPostQuery): Promise<Result<Post, Error>> {
    try {
      const postId = PostId.create(query.postId);
      const postOption = await this.postRepository.findById(postId);

      if (!Option.isSome(postOption)) {
        return Result.fail(new PostNotFoundException(query.postId));
      }

      const post = postOption.value;

      // Check access for drafts
      if (!post.isPublished()) {
        if (query.userId === undefined) {
          return Result.fail(new PostAccessDeniedException(query.postId, 'anonymous'));
        }
        const userId = UserId.create(query.userId);
        if (!post.isOwnedBy(userId)) {
          return Result.fail(new PostAccessDeniedException(query.postId, query.userId));
        }
      }

      // Increment view count for published posts
      if (post.isPublished()) {
        await this.postRepository.incrementViewCount(postId);
      }

      return Result.ok(post);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error(String(error)));
    }
  }
}