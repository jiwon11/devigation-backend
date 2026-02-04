import { Injectable, Inject } from '@nestjs/common';
import { Result } from '@common/types/result.type';
import { Paginated } from '@common/types/pagination.type';
import { Roadmap } from '@domain/roadmap/roadmap';
import { UserId } from '@domain/user/user-id';
import { RoadmapCategory } from '@domain/roadmap/roadmap.enum';
import { ROADMAP_REPOSITORY, RoadmapRepositoryPort, RoadmapFilter } from '../port/out/roadmap-repository.port';

export class ListRoadmapsQuery {
  constructor(
    public readonly page: number = 1,
    public readonly limit: number = 20,
    public readonly category?: RoadmapCategory,
    public readonly authorId?: string,
    public readonly tags?: string[],
    public readonly search?: string,
  ) {}
}

@Injectable()
export class ListRoadmapsUseCase {
  constructor(
    @Inject(ROADMAP_REPOSITORY)
    private readonly roadmapRepository: RoadmapRepositoryPort,
  ) {}

  async execute(query: ListRoadmapsQuery): Promise<Result<Paginated<Roadmap>, Error>> {
    try {
      const filter: RoadmapFilter = {
        isPublic: true,
      };

      if (query.category !== undefined) {
        filter.category = query.category;
      }
      if (query.authorId !== undefined) {
        filter.authorId = UserId.create(query.authorId);
      }
      if (query.tags !== undefined && query.tags.length > 0) {
        filter.tags = query.tags;
      }
      if (query.search !== undefined) {
        filter.search = query.search;
      }

      const roadmaps = await this.roadmapRepository.findAll(
        { page: query.page, limit: query.limit },
        filter,
      );

      return Result.ok(roadmaps);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error(String(error)));
    }
  }
}