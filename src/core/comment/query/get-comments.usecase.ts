import { Injectable, Inject } from '@nestjs/common';
import { Result } from '@common/types/result.type';
import { Paginated } from '@common/types/pagination.type';
import { Comment } from '@domain/comment/comment';
import { PostId } from '@domain/post/post-id';
import { CommentId } from '@domain/comment/comment-id';
import { COMMENT_REPOSITORY, CommentRepositoryPort } from '../port/out/comment-repository.port';

export class GetCommentsQuery {
  constructor(
    public readonly postId: string,
    public readonly page: number = 1,
    public readonly limit: number = 20,
  ) {}
}

export class GetRepliesQuery {
  constructor(
    public readonly parentId: string,
    public readonly page: number = 1,
    public readonly limit: number = 20,
  ) {}
}

@Injectable()
export class GetCommentsUseCase {
  constructor(
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: CommentRepositoryPort,
  ) {}

  async getComments(query: GetCommentsQuery): Promise<Result<Paginated<Comment>, Error>> {
    try {
      const postId = PostId.create(query.postId);
      const comments = await this.commentRepository.findByPostId(postId, {
        page: query.page,
        limit: query.limit,
      });
      return Result.ok(comments);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error(String(error)));
    }
  }

  async getReplies(query: GetRepliesQuery): Promise<Result<Paginated<Comment>, Error>> {
    try {
      const parentId = CommentId.create(query.parentId);
      const replies = await this.commentRepository.findReplies(parentId, {
        page: query.page,
        limit: query.limit,
      });
      return Result.ok(replies);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error(String(error)));
    }
  }
}