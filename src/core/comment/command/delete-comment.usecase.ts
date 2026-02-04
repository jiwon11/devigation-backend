import { Injectable, Inject } from '@nestjs/common';
import { Result } from '@common/types/result.type';
import { Option } from '@common/types/option.type';
import { CommentId } from '@domain/comment/comment-id';
import { UserId } from '@domain/user/user-id';
import { CommentNotFoundException, CommentAccessDeniedException } from '@domain/comment/comment.exception';
import { COMMENT_REPOSITORY, CommentRepositoryPort } from '../port/out/comment-repository.port';
import { POST_REPOSITORY, PostRepositoryPort } from '@core/post/port/out/post-repository.port';

export class DeleteCommentCommand {
  constructor(
    public readonly commentId: string,
    public readonly userId: string,
  ) {}
}

@Injectable()
export class DeleteCommentUseCase {
  constructor(
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: CommentRepositoryPort,
    @Inject(POST_REPOSITORY)
    private readonly postRepository: PostRepositoryPort,
  ) {}

  async execute(command: DeleteCommentCommand): Promise<Result<void, Error>> {
    try {
      const commentId = CommentId.create(command.commentId);
      const commentOption = await this.commentRepository.findById(commentId);

      if (!Option.isSome(commentOption)) {
        return Result.fail(new CommentNotFoundException(command.commentId));
      }

      const comment = commentOption.value;
      const userId = UserId.create(command.userId);

      if (!comment.isOwnedBy(userId)) {
        return Result.fail(new CommentAccessDeniedException(command.commentId, command.userId));
      }

      // Soft delete if has replies, hard delete otherwise
      if (comment.replyCount > 0) {
        comment.softDelete();
        await this.commentRepository.save(comment);
      } else {
        await this.commentRepository.delete(commentId);
      }

      // Update post comment count
      const postOption = await this.postRepository.findById(comment.postId);
      if (Option.isSome(postOption)) {
        postOption.value.decrementCommentCount();
        await this.postRepository.save(postOption.value);
      }

      return Result.ok(undefined);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error(String(error)));
    }
  }
}