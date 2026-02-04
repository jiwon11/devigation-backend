import { Option } from '@common/types/option.type';
import { Paginated, PaginationParams } from '@common/types/pagination.type';
import { Post } from '@domain/post/post';
import { PostId } from '@domain/post/post-id';
import { UserId } from '@domain/user/user-id';
import { RoadmapId } from '@domain/roadmap/roadmap-id';
import { PostStatus } from '@domain/post/post.enum';

export const POST_REPOSITORY = Symbol('POST_REPOSITORY');

export interface PostFilter {
  authorId?: UserId;
  roadmapId?: RoadmapId;
  status?: PostStatus;
  tags?: string[];
  search?: string;
}

export interface PostRepositoryPort {
  save(post: Post): Promise<Post>;
  findById(id: PostId): Promise<Option<Post>>;
  findBySlug(slug: string): Promise<Option<Post>>;
  findAll(params: PaginationParams, filter?: PostFilter): Promise<Paginated<Post>>;
  findByAuthor(authorId: UserId, params: PaginationParams): Promise<Paginated<Post>>;
  findByRoadmap(roadmapId: RoadmapId, params: PaginationParams): Promise<Paginated<Post>>;
  delete(id: PostId): Promise<void>;
  incrementViewCount(id: PostId): Promise<void>;
}