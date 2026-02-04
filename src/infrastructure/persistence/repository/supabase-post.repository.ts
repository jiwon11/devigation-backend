import { Injectable } from '@nestjs/common';
import { Option } from '@common/types/option.type';
import { Paginated, Pagination, PaginationParams } from '@common/types/pagination.type';
import { Post } from '@domain/post/post';
import { PostId } from '@domain/post/post-id';
import { UserId } from '@domain/user/user-id';
import { RoadmapId } from '@domain/roadmap/roadmap-id';
import { PostRepositoryPort, PostFilter } from '@core/post/port/out/post-repository.port';
import { SupabaseService } from '@infrastructure/supabase/supabase.service';

@Injectable()
export class SupabasePostRepository implements PostRepositoryPort {
  constructor(private readonly supabase: SupabaseService) {}

  async save(post: Post): Promise<Post> {
    return post;
  }

  async findById(id: PostId): Promise<Option<Post>> {
    return Option.none();
  }

  async findBySlug(slug: string): Promise<Option<Post>> {
    return Option.none();
  }

  async findAll(params: PaginationParams, filter?: PostFilter): Promise<Paginated<Post>> {
    return Pagination.create([], params, 0);
  }

  async findByAuthor(authorId: UserId, params: PaginationParams): Promise<Paginated<Post>> {
    return Pagination.create([], params, 0);
  }

  async findByRoadmap(roadmapId: RoadmapId, params: PaginationParams): Promise<Paginated<Post>> {
    return Pagination.create([], params, 0);
  }

  async delete(id: PostId): Promise<void> {}

  async incrementViewCount(id: PostId): Promise<void> {
    await this.supabase
      .getAdminClient()
      .rpc('increment_post_view_count', { post_id: id.value });
  }
}