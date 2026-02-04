import { Injectable, Inject } from '@nestjs/common';
import { Result } from '@common/types/result.type';
import { Option } from '@common/types/option.type';
import { Post } from '@domain/post/post';
import { PostId } from '@domain/post/post-id';
import { UserId } from '@domain/user/user-id';
import { PostNotFoundException, PostAccessDeniedException } from '@domain/post/post.exception';
import { POST_REPOSITORY, PostRepositoryPort } from '../port/out/post-repository.port';

export class PublishPostCommand {
  constructor(
    public readonly postId: string,
    public readonly userId: string,
  ) {}
}

export class UnpublishPostCommand {
  constructor(
    public readonly postId: string,
    public readonly userId: string,
  ) {}
}

@Injectable()
export class PublishPostUseCase {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: PostRepositoryPort,
  ) {}

  async publish(command: PublishPostCommand): Promise<Result<Post, Error>> {
    try {
      const postId = PostId.create(command.postId);
      const postOption = await this.postRepository.findById(postId);

      if (!Option.isSome(postOption)) {
        return Result.fail(new PostNotFoundException(command.postId));
      }

      const post = postOption.value;
      const userId = UserId.create(command.userId);

      if (!post.isOwnedBy(userId)) {
        return Result.fail(new PostAccessDeniedException(command.postId, command.userId));
      }

      post.publish();
      const updatedPost = await this.postRepository.save(post);
      return Result.ok(updatedPost);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error(String(error)));
    }
  }

  async unpublish(command: UnpublishPostCommand): Promise<Result<Post, Error>> {
    try {
      const postId = PostId.create(command.postId);
      const postOption = await this.postRepository.findById(postId);

      if (!Option.isSome(postOption)) {
        return Result.fail(new PostNotFoundException(command.postId));
      }

      const post = postOption.value;
      const userId = UserId.create(command.userId);

      if (!post.isOwnedBy(userId)) {
        return Result.fail(new PostAccessDeniedException(command.postId, command.userId));
      }

      post.unpublish();
      const updatedPost = await this.postRepository.save(post);
      return Result.ok(updatedPost);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error(String(error)));
    }
  }
}