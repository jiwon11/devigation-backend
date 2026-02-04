import { Injectable, Inject } from '@nestjs/common';
import { Result } from '@common/types/result.type';
import { Option } from '@common/types/option.type';
import { Roadmap } from '@domain/roadmap/roadmap';
import { RoadmapId } from '@domain/roadmap/roadmap-id';
import { UserId } from '@domain/user/user-id';
import { RoadmapNotFoundException, RoadmapAccessDeniedException } from '@domain/roadmap/roadmap.exception';
import { UpdateRoadmapCommand } from './update-roadmap.command';
import { ROADMAP_REPOSITORY, RoadmapRepositoryPort } from '../port/out/roadmap-repository.port';

@Injectable()
export class UpdateRoadmapUseCase {
  constructor(
    @Inject(ROADMAP_REPOSITORY)
    private readonly roadmapRepository: RoadmapRepositoryPort,
  ) {}

  async execute(command: UpdateRoadmapCommand): Promise<Result<Roadmap, Error>> {
    try {
      const roadmapId = RoadmapId.create(command.roadmapId);
      const roadmapOption = await this.roadmapRepository.findById(roadmapId);

      if (!Option.isSome(roadmapOption)) {
        return Result.fail(new RoadmapNotFoundException(command.roadmapId));
      }

      const roadmap = roadmapOption.value;
      const userId = UserId.create(command.userId);

      if (!roadmap.isOwnedBy(userId)) {
        return Result.fail(new RoadmapAccessDeniedException(command.roadmapId, command.userId));
      }

      if (command.title !== undefined) {
        roadmap.updateTitle(command.title);
      }
      if (command.description !== undefined) {
        roadmap.updateDescription(command.description);
      }
      if (command.category !== undefined) {
        roadmap.updateCategory(command.category);
      }
      if (command.visibility !== undefined) {
        roadmap.updateVisibility(command.visibility);
      }
      if (command.tags !== undefined) {
        roadmap.updateTags(command.tags);
      }
      if (command.thumbnailUrl !== undefined) {
        roadmap.updateThumbnail(command.thumbnailUrl);
      }

      const updatedRoadmap = await this.roadmapRepository.save(roadmap);
      return Result.ok(updatedRoadmap);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error(String(error)));
    }
  }
}