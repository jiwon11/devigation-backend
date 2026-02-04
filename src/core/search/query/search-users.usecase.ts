import { Injectable, Inject } from '@nestjs/common';
import { Result } from '@common/types/result.type';
import { Paginated } from '@common/types/pagination.type';
import { User } from '@domain/user/user';
import { SEARCH_ENGINE, SearchEnginePort, SearchResult } from '../port/out/search-engine.port';

export class SearchUsersQuery {
  constructor(
    public readonly query: string,
    public readonly page: number = 1,
    public readonly limit: number = 20,
  ) {}
}

@Injectable()
export class SearchUsersUseCase {
  constructor(
    @Inject(SEARCH_ENGINE)
    private readonly searchEngine: SearchEnginePort,
  ) {}

  async execute(query: SearchUsersQuery): Promise<Result<Paginated<SearchResult<User>>, Error>> {
    try {
      const results = await this.searchEngine.searchUsers<User>(query.query, {
        page: query.page,
        limit: query.limit,
      });
      return Result.ok(results);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error(String(error)));
    }
  }
}