import { Injectable } from '@nestjs/common';
import { Paginated, Pagination, PaginationParams } from '@common/types/pagination.type';
import { SearchEnginePort, SearchResult } from '@core/search/port/out/search-engine.port';
import { SupabaseService } from '@infrastructure/supabase/supabase.service';

@Injectable()
export class PostgresSearchAdapter implements SearchEnginePort {
  constructor(private readonly supabaseService: SupabaseService) {}

  async searchRoadmaps<T>(
    query: string,
    params: PaginationParams,
  ): Promise<Paginated<SearchResult<T>>> {
    // PostgreSQL full-text search implementation
    return Pagination.create([], params, 0);
  }

  async searchPosts<T>(
    query: string,
    params: PaginationParams,
  ): Promise<Paginated<SearchResult<T>>> {
    return Pagination.create([], params, 0);
  }

  async searchUsers<T>(
    query: string,
    params: PaginationParams,
  ): Promise<Paginated<SearchResult<T>>> {
    return Pagination.create([], params, 0);
  }

  async searchAll<T>(
    query: string,
    params: PaginationParams,
  ): Promise<{
    roadmaps: Paginated<SearchResult<T>>;
    posts: Paginated<SearchResult<T>>;
    users: Paginated<SearchResult<T>>;
  }> {
    const [roadmaps, posts, users] = await Promise.all([
      this.searchRoadmaps<T>(query, params),
      this.searchPosts<T>(query, params),
      this.searchUsers<T>(query, params),
    ]);

    return { roadmaps, posts, users };
  }
}