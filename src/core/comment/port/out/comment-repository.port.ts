import { Option } from '@common/types/option.type';
import { Paginated, PaginationParams } from '@common/types/pagination.type';
import { Comment } from '@domain/comment/comment';
import { CommentId } from '@domain/comment/comment-id';
import { PostId } from '@domain/post/post-id';

export const COMMENT_REPOSITORY = Symbol('COMMENT_REPOSITORY');

export interface CommentRepositoryPort {
  save(comment: Comment): Promise<Comment>;
  findById(id: CommentId): Promise<Option<Comment>>;
  findByPostId(postId: PostId, params: PaginationParams): Promise<Paginated<Comment>>;
  findReplies(parentId: CommentId, params: PaginationParams): Promise<Paginated<Comment>>;
  delete(id: CommentId): Promise<void>;
  countByPostId(postId: PostId): Promise<number>;
}