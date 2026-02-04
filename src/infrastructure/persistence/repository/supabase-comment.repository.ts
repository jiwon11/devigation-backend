import { Injectable } from '@nestjs/common';
import { Option } from '@common/types/option.type';
import { Paginated, Pagination, PaginationParams } from '@common/types/pagination.type';
import { Comment } from '@domain/comment/comment';
import { CommentId } from '@domain/comment/comment-id';
import { PostId } from '@domain/post/post-id';
import { CommentRepositoryPort } from '@core/comment/port/out/comment-repository.port';
import { SupabaseService } from '@infrastructure/supabase/supabase.service';

@Injectable()
export class SupabaseCommentRepository implements CommentRepositoryPort {
  constructor(private readonly supabase: SupabaseService) {}

  async save(comment: Comment): Promise<Comment> {
    return comment;
  }

  async findById(id: CommentId): Promise<Option<Comment>> {
    return Option.none();
  }

  async findByPostId(postId: PostId, params: PaginationParams): Promise<Paginated<Comment>> {
    return Pagination.create([], params, 0);
  }

  async findReplies(parentId: CommentId, params: PaginationParams): Promise<Paginated<Comment>> {
    return Pagination.create([], params, 0);
  }

  async delete(id: CommentId): Promise<void> {}

  async countByPostId(postId: PostId): Promise<number> {
    return 0;
  }
}