import { Injectable, Inject } from '@nestjs/common';
import { Result } from '@common/types/result.type';
import { Paginated } from '@common/types/pagination.type';
import { Post } from '@domain/post/post';
import { SEARCH_ENGINE, SearchEnginePort, SearchResult } from '../port/out/search-engine.port';

export class SearchPostsQuery {
  constructor(
    public readonly query: string,
    public readonly page: number = 1,
    public readonly limit: number = 20,
  ) {}
}

@Injectable()
export class SearchPostsUseCase {
  constructor(
    @Inject(SEARCH_ENGINE)
    private readonly searchEngine: SearchEnginePort,
  ) {}

  async execute(query: SearchPostsQuery): Promise<Result<Paginated<SearchResult<Post>>, Error>> {
    try {
      const results = await this.searchEngine.searchPosts<Post>(query.query, {
        page: query.page,
        limit: query.limit,
      });
      return Result.ok(results);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error(String(error)));
    }
  }
}