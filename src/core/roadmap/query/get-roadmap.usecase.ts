import { Injectable, Inject } from '@nestjs/common';
import { Result } from '@common/types/result.type';
import { Option } from '@common/types/option.type';
import { Roadmap } from '@domain/roadmap/roadmap';
import { RoadmapId } from '@domain/roadmap/roadmap-id';
import { UserId } from '@domain/user/user-id';
import { RoadmapNotFoundException, RoadmapAccessDeniedException } from '@domain/roadmap/roadmap.exception';
import { ROADMAP_REPOSITORY, RoadmapRepositoryPort } from '../port/out/roadmap-repository.port';

export class GetRoadmapQuery {
  constructor(
    public readonly roadmapId: string,
    public readonly userId?: string,
  ) {}
}

@Injectable()
export class GetRoadmapUseCase {
  constructor(
    @Inject(ROADMAP_REPOSITORY)
    private readonly roadmapRepository: RoadmapRepositoryPort,
  ) {}

  async execute(query: GetRoadmapQuery): Promise<Result<Roadmap, Error>> {
    try {
      const roadmapId = RoadmapId.create(query.roadmapId);
      const roadmapOption = await this.roadmapRepository.findById(roadmapId);

      if (!Option.isSome(roadmapOption)) {
        return Result.fail(new RoadmapNotFoundException(query.roadmapId));
      }

      const roadmap = roadmapOption.value;

      // Check access for private roadmaps
      if (!roadmap.isPublic()) {
        if (query.userId === undefined) {
          return Result.fail(new RoadmapAccessDeniedException(query.roadmapId, 'anonymous'));
        }
        const userId = UserId.create(query.userId);
        if (!roadmap.isOwnedBy(userId)) {
          return Result.fail(new RoadmapAccessDeniedException(query.roadmapId, query.userId));
        }
      }

      // Increment view count
      await this.roadmapRepository.incrementViewCount(roadmapId);

      return Result.ok(roadmap);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error(String(error)));
    }
  }
}