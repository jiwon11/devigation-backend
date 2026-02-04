export interface PaginationParams {
  readonly page: number;
  readonly limit: number;
}

export interface PaginationMeta {
  readonly page: number;
  readonly limit: number;
  readonly totalCount: number;
  readonly totalPages: number;
  readonly hasNextPage: boolean;
  readonly hasPrevPage: boolean;
}

export interface Paginated<T> {
  readonly data: readonly T[];
  readonly meta: PaginationMeta;
}

export const Pagination = {
  create: <T>(data: readonly T[], params: PaginationParams, totalCount: number): Paginated<T> => {
    const totalPages = Math.ceil(totalCount / params.limit);
    return {
      data,
      meta: {
        page: params.page,
        limit: params.limit,
        totalCount,
        totalPages,
        hasNextPage: params.page < totalPages,
        hasPrevPage: params.page > 1,
      },
    };
  },

  getOffset: (params: PaginationParams): number => {
    return (params.page - 1) * params.limit;
  },
} as const;