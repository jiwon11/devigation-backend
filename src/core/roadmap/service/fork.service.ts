import { Injectable, Inject } from '@nestjs/common';
import { RoadmapId } from '@domain/roadmap/roadmap-id';
import { UserId } from '@domain/user/user-id';
import { Paginated } from '@common/types/pagination.type';
import { Roadmap } from '@domain/roadmap/roadmap';
import { ROADMAP_REPOSITORY, RoadmapRepositoryPort } from '../port/out/roadmap-repository.port';

@Injectable()
export class ForkService {
  constructor(
    @Inject(ROADMAP_REPOSITORY)
    private readonly roadmapRepository: RoadmapRepositoryPort,
  ) {}

  async getForksOf(
    roadmapId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<Paginated<Roadmap>> {
    return this.roadmapRepository.findForkedFrom(
      RoadmapId.create(roadmapId),
      { page, limit },
    );
  }
}