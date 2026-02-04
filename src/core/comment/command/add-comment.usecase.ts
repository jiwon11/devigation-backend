import { Injectable, Inject } from '@nestjs/common';
import { Result } from '@common/types/result.type';
import { Option } from '@common/types/option.type';
import { Comment } from '@domain/comment/comment';
import { CommentId } from '@domain/comment/comment-id';
import { PostId } from '@domain/post/post-id';
import { UserId } from '@domain/user/user-id';
import { ParentCommentNotFoundException } from '@domain/comment/comment.exception';
import { PostNotFoundException } from '@domain/post/post.exception';
import { COMMENT_REPOSITORY, CommentRepositoryPort } from '../port/out/comment-repository.port';
import { POST_REPOSITORY, PostRepositoryPort } from '@core/post/port/out/post-repository.port';

export class AddCommentCommand {
  constructor(
    public readonly postId: string,
    public readonly authorId: string,
    public readonly content: string,
    public readonly parentId?: string,
  ) {}
}

@Injectable()
export class AddCommentUseCase {
  constructor(
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: CommentRepositoryPort,
    @Inject(POST_REPOSITORY)
    private readonly postRepository: PostRepositoryPort,
  ) {}

  async execute(command: AddCommentCommand): Promise<Result<Comment, Error>> {
    try {
      // Check if post exists
      const postId = PostId.create(command.postId);
      const postOption = await this.postRepository.findById(postId);
      if (!Option.isSome(postOption)) {
        return Result.fail(new PostNotFoundException(command.postId));
      }

      let parentDepth = 0;
      let parentCommentId: CommentId | undefined;

      // Check parent comment if this is a reply
      if (command.parentId !== undefined) {
        parentCommentId = CommentId.create(command.parentId);
        const parentOption = await this.commentRepository.findById(parentCommentId);
        if (!Option.isSome(parentOption)) {
          return Result.fail(new ParentCommentNotFoundException(command.parentId));
        }
        parentDepth = parentOption.value.depth;
      }

      const comment = Comment.create({
        postId,
        authorId: UserId.create(command.authorId),
        content: command.content,
        parentId: parentCommentId,
        parentDepth,
      });

      const savedComment = await this.commentRepository.save(comment);

      // Update post comment count
      const post = postOption.value;
      post.incrementCommentCount();
      await this.postRepository.save(post);

      return Result.ok(savedComment);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error(String(error)));
    }
  }
}