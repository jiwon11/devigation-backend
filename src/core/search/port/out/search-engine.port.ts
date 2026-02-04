import { Paginated, PaginationParams } from '@common/types/pagination.type';

export const SEARCH_ENGINE = Symbol('SEARCH_ENGINE');

export interface SearchResult<T> {
  item: T;
  score: number;
  highlights?: Record<string, string[]>;
}

export interface SearchEnginePort {
  searchRoadmaps<T>(query: string, params: PaginationParams): Promise<Paginated<SearchResult<T>>>;
  searchPosts<T>(query: string, params: PaginationParams): Promise<Paginated<SearchResult<T>>>;
  searchUsers<T>(query: string, params: PaginationParams): Promise<Paginated<SearchResult<T>>>;
  searchAll<T>(query: string, params: PaginationParams): Promise<{
    roadmaps: Paginated<SearchResult<T>>;
    posts: Paginated<SearchResult<T>>;
    users: Paginated<SearchResult<T>>;
  }>;
}