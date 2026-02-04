import { Injectable, Inject } from '@nestjs/common';
import { Result } from '@common/types/result.type';
import { Option } from '@common/types/option.type';
import { Post } from '@domain/post/post';
import { PostId } from '@domain/post/post-id';
import { UserId } from '@domain/user/user-id';
import { PostNotFoundException, PostAccessDeniedException } from '@domain/post/post.exception';
import { POST_REPOSITORY, PostRepositoryPort } from '../port/out/post-repository.port';

export class UpdatePostCommand {
  constructor(
    public readonly postId: string,
    public readonly userId: string,
    public readonly title?: string,
    public readonly content?: string,
    public readonly excerpt?: string,
    public readonly thumbnailUrl?: string,
    public readonly tags?: string[],
  ) {}
}

@Injectable()
export class UpdatePostUseCase {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: PostRepositoryPort,
  ) {}

  async execute(command: UpdatePostCommand): Promise<Result<Post, Error>> {
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

      if (command.title !== undefined) {
        post.updateTitle(command.title);
      }
      if (command.content !== undefined) {
        post.updateContent(command.content);
      }
      if (command.excerpt !== undefined) {
        post.updateExcerpt(command.excerpt);
      }
      if (command.thumbnailUrl !== undefined) {
        post.updateThumbnail(command.thumbnailUrl);
      }
      if (command.tags !== undefined) {
        post.updateTags(command.tags);
      }

      const updatedPost = await this.postRepository.save(post);
      return Result.ok(updatedPost);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error(String(error)));
    }
  }
}