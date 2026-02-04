import { Injectable, Inject } from '@nestjs/common';
import { Result } from '@common/types/result.type';
import { Paginated } from '@common/types/pagination.type';
import { Post } from '@domain/post/post';
import { UserId } from '@domain/user/user-id';
import { PostStatus } from '@domain/post/post.enum';
import { POST_REPOSITORY, PostRepositoryPort, PostFilter } from '../port/out/post-repository.port';

export class ListPostsQuery {
  constructor(
    public readonly page: number = 1,
    public readonly limit: number = 20,
    public readonly authorId?: string,
    public readonly tags?: string[],
    public readonly search?: string,
  ) {}
}

@Injectable()
export class ListPostsUseCase {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: PostRepositoryPort,
  ) {}

  async execute(query: ListPostsQuery): Promise<Result<Paginated<Post>, Error>> {
    try {
      const filter: PostFilter = {
        status: PostStatus.PUBLISHED,
      };

      if (query.authorId !== undefined) {
        filter.authorId = UserId.create(query.authorId);
      }
      if (query.tags !== undefined && query.tags.length > 0) {
        filter.tags = query.tags;
      }
      if (query.search !== undefined) {
        filter.search = query.search;
      }

      const posts = await this.postRepository.findAll(
        { page: query.page, limit: query.limit },
        filter,
      );

      return Result.ok(posts);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error(String(error)));
    }
  }
}